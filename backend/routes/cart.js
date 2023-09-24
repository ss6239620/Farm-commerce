const express = require("express");
const router = express.Router();

const Cart = require('../models/cartModel')
const User = require('../models/users')
const Crop = require('../models/cropModel')
const taxConfig = require('../config/tax')


const auth = require('../middleware/auth')


router.post('/addtocart', auth, async (req, res) => {
    const { quantity, cropName, cropUser } = req.body
    const user = req.user._id
    const taxable = req.body.taxable ? req.body.taxable : false

    if (!quantity || !cropName || !cropUser)
        return res.status(400).json({ error: 'You must have forget to enter either quantity cropName,cropUser or taxable' })


    const existUser = await User.findOne({ name: cropUser })
    if (!existUser)
        return res.status(400).json({ error: 'There is no associated user to your choosen crop' })

    const existCrop = await Crop.findOne({ user: existUser._id, cropName: cropName })
    if (!existCrop)
        return res.status(400).json({ error: 'There is no associated crop to your choosen user' })

    const existcart = await Cart.findOne({ user })

    const value = calculateItemsSalesTax(quantity, existCrop.price, taxable)
    value.quantity = quantity
    value.crop = existCrop._id
    value.user = user

    if (!existcart) {
        const cart = new Cart({
            cartItem: value, user: user
        })
        const save = await cart.save()
        try {
            return res.status(200).json({
                success: true,
                message: "added to cart",
                res: save

            })
        } catch (e) {
            return res.status(400).json({ error: 'Not able to add in cart' })
        }

    } else {

        existcart.cartItem.push(value)

        const save = await existcart.save()
        try {
            return res.status(200).json({
                success: true,
                message: "added to cart",
                res: save

            })
        } catch (e) {
            return res.status(400).json({ error: 'Not able to add in cart' })
        }
    }
})


router.get('/getcart', auth, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart)
        return res.status(400).json({ error: 'No item in your cart' })
    return res.status(200).json({
        success: true,
        res: cart
    })
})


router.put('/deletecartitem', auth, async (req, res) => {
    const { cropName } = req.body

    const existCrop = await Crop.findOne({ cropName: cropName })
    if (!existCrop)
        return res.status(400).json({ error: 'No such crop exist in db' })

    const remove = await Cart.updateOne(
        { user: req.user._id },
        { $pull: { cartItem: { crop: existCrop._id } } }
    )

    try {
        return res.status(200).json({
            success: true,
            message: 'removed item from your cart',
            res: remove
        })
    } catch (e) {
        return res.status(400).json({ error: 'No such crop in your cart' })
    }
})

function calculateItemsSalesTax(quantity, price, taxable) {
    const cartItem = {}
    cartItem.priceWithTax = 0;
    cartItem.totalPrice = 0;
    cartItem.totalTax = 0;
    cartItem.taxable = taxable
    cartItem.purchasePrice = price;

    cartItem.totalPrice = parseFloat(Number((price * quantity).toFixed(2)));
    if (taxable) {
        const taxAmount = price * (taxConfig.stateTaxRate / 100) * 100;
        cartItem.totalTax = parseFloat(Number(taxAmount * quantity).toFixed(2))
        cartItem.priceWithTax = parseFloat(
            Number((cartItem.totalPrice + cartItem.totalTax).toFixed(2))
        );
    }
    return cartItem
}



module.exports = router