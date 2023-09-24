const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Crop = require('../models/cropModel');
const Category = require('../models/categoryModel');

const auth = require('../middleware/auth');
const role=require('../middleware/role')
const {ROLES}=require('../constant/index')

//add a crop
router.post('/add', auth, async (req, res) => {
    try {
        const { cropName, plantingSeason, soilType, quality, price, category, stock } = req.body

        if (!cropName) {
            return res.status(400).json({ error: 'You must enter crop name' })
        }
        if (!plantingSeason) {
            return res.status(400).json({ error: 'You must enter planting season' })
        }
        if (!soilType) {
            return res.status(400).json({ error: 'You must enter soiltype' })
        }
        if (!quality) {
            return res.status(400).json({ error: 'You must enter quality' })
        }
        if (!price || !stock) {
            return res.status(400).json({ error: 'You must have forget to enter Price or stock' })
        }
        const existCat = await Category.findOne({ categoryName: category })
        if (!existCat) {
            return res.status(400).json({ error: 'No such category exist' })
        }

        const crop = new Crop({
            cropName, plantingSeason, soilType, quality, price, user: req.user._id, category: existCat._id, stock
        })
        try {
            const svaedCrop = await crop.save();
            res.status(200).json({
                success: true,
                message: 'crop has been uploaded',
                crop: svaedCrop,
            })
        } catch (e) {
            console.log(e)
        }

    }
    catch (errror) {
        return res.status(404).json({
            error: 'Your request cannot be proceed'
        })
    }
})

// find crop by name 
router.get('/search/:cropName', async (req, res) => {
    try {
        const cropName = req.params.cropName
        if (!cropName) {
            return res.status(400).json({ error: "pls mention cropName" })
        }
        const existuser = await Crop.findOne({ cropName })
        if (!existuser) {
            return res.status(400).json({ error: "Crop does not exist" })
        } else {
            return res.status(200).json({
                success: true,
                res: existuser
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// find all crop cultivated by individual farmer

router.get('/mycrop', async (req, res) => {
    try {
        const userCrop = []
        const user = req.user.id
        const allUserCrop = await Crop.find({ user })
        allUserCrop.forEach(crop => {
            userCrop.push(crop)
        })
        if (!allUserCrop) {
            return res.status(400).json({ error: 'The register user does not have a single crop yet' })
        } else {
            return res.status(200).json({
                success: true,
                res: userCrop
            })
        }
    }
    catch (error) {
        console.log(error);
    }
})

router.get('/allCrop', async (req, res) => {
    try {
        const allCrop = []
        const crop = await Crop.find({})
        crop.forEach(crop => {
            allCrop.push(crop)
        });
        if (!crop) {
            return res.status(400).json({ error: 'No crop yet' })
        } else {
            return res.status(200).json({
                success: true,
                res: allCrop
            })
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.put('/delete/:cropName', auth, async (req, res) => {
    const cropName = req.params.cropName
    console.log(cropName)
    if (!cropName) {
        return res.status(400).json({ error: "pls mention cropName" })
    }
    const existuser = await Crop.findOne({ cropName })
    if (!existuser) {
        return res.status(400).json({ error: "Crop does not exist" })
    } else {
        Crop.findOneAndDelete({ cropName }).then(response => {
            return res.status(200).json({
                success: true,
                message: `deleted crop ${cropName} from database`
            })
        }).catch(err => {
            return res.status(400).json({ error: "Operation failed" })
        })
    }
})


module.exports = router
