const express = require("express");
const router = express.Router();

const Merchant = require('../models/merchantModel')
const Farm = require('../models/farmModel')
const User = require('../models/users')


const auth = require('../middleware/auth')
const role = require('../middleware/role')

const { ROLES } = require('../constant/index')

router.post('/add', auth, role.check(ROLES.Merchant), async (req, res) => {
    const { business, farmName, farmDesc } = req.body
    const existUser = await User.findOne({ name: req.user.name })
    if (!existUser)
        return res.status(400).json({ error: "First register before regestering as a merchant" })
    if (!business)
        return res.status(400).json({ error: "Business is missing" })
    if (!business || !farmName || !farmDesc)
        return res.status(400).json({ error: "Either farm name or farm description is missing" })

    const existMerchant = await Merchant.findOne({ email: req.user.email, name: req.user.name })

    const value = {
        farmName: farmName,
        farmDesc: farmDesc,
    }

    if (!existMerchant) {
        const savemerchant = new Merchant({
            name: existUser.name,
            email: existUser.email,
            phone: existUser.phone,
            farm: value,
            business: business
        })
        const save = await savemerchant.save()
        try {
            res.status(200).json({
                success: true,
                message: "added new product to a farm",
                res: save
            })
        } catch (e) {
            return res.status(400).json({ error: "Problem occured while creating merchant" })
        }
    }else{
        const save=new Merchant({
            farm:value,business:business
        })
        const merchant=await save.save()
        try{
            res.status(200).json({
                success: true,
                message: "added new product to a farm",
                res: save
            })
        }catch(e){
            return res.status(400).json({ error: "Problem occured while creating merchant" })
        }
    }
})

module.exports = router


