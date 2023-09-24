const express = require("express");
const router = express.Router();

const Order = require('../models/orderModel')
const auth = require('../middleware/auth')


// Create Order 
router.post('/placeOrder', auth, async (req, res) => {
    console.log('here')
    try {
        const { quantity, totalAmount, crop } = req.body

        console.log(req.body);
        const user = req.user.id
        if (!quantity || !totalAmount) {
            return res.status(400).json({ error: 'Either quantity or totalAmount is missing' })
        }
        if (!crop) {
            return res.status(400).json({ error: 'pls provide proper crop_id' })
        }
        const order = new Order({
            quantity,
            totalAmount,
            crop,
            user
        })
        try {
            const savedOrder = await order.save()
            return res.status(200).json({
                success: true,
                message: 'Your order has been placed',
                res: savedOrder
            })
        }
        catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
})

router.put('/cancelOrder/:_id', auth, async (req, res) => {
    const _id = req.params._id
    console.log(_id);
    if (!_id) {
        return res.status(400).json({ error: 'Order Id is missing' })
    }

    const existOrder = await Order.findOneAndRemove({ _id })
    console.log(existOrder);
    if (existOrder) {
        return res.status(200).json({
            success: true,
            message: `Your order ${_id} has succesfully canceled`
        })
    } else {
        return res.status(400).json({ error: 'Order does not exist' })
    }
})


router.get('/findOrder/:_id', auth, async (req, res) => {
    try{
        const {_id}=req.params
        if (!_id) {
            return res.status(400).json({ error: 'Order Id is missing' })
        }

        const existOrder = await Order.findOne({ _id })
        if (existOrder) {
            return res.status(200).json({
                success: true,
                res:existOrder
            })
        } else {
            return res.status(400).json({ error: 'Order does not exist' })
        }

    }catch(e){
        console.log(e);
    }

})


router.get('/allOrder', auth, async (req, res) => {
    try {
        const allOrder = []
        const order = await Order.find({})
        order.forEach(order => {
            allOrder.push(order)
        });
        if (!order) {
            return res.status(400).json({ error: 'No order yet' })
        } else {
            return res.status(200).json({
                success: true,
                res: allOrder
            })
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.get('/orderStatus/:_id', auth, async (req, res) => {
    try {
        const _id = req.params._id
        if (!_id) {
            return res.status(400).json({ error: 'Order Id is missing' })
        }

        const existOrder = await Order.findOne({ _id })
        if (existOrder) {
            return res.status(200).json({
                success: true,
                message: `Your order is at ${existOrder.orderStatus}`
            })
        } else {
            return res.status(400).json({ error: 'Order does not exist' })
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.put('/updateStatus/:_id/:status', auth, async (req, res) => {
    try {
        const { _id, status } = req.params;

        if (!_id || !status) {
            return res.status(400).json({ error: 'Either Order_id or updated status is missing' })
        }
        const existOrder = await Order.findOne({ _id })
        if (existOrder) {
            existOrder.orderStatus = status;
            existOrder.save()
            return res.status(200).json({
                success: true,
                message: `Your order is updated (${existOrder.orderStatus}) successfully`
            })
        } else {
            return res.status(400).json({ error: 'Order does not exist' })
        }
    }
    catch (e) {
        console.log(e);
    }
})


module.exports = router