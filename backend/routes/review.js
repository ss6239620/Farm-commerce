const express = require("express");
const router = express.Router();

const Review = require('../models/reviewModel');
const Crop = require('../models/cropModel');
const User = require('../models/users');



const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
    try {
        const { cropName, rating, review, isRecommended, name } = req.body
        const reviewUser = req.user

        if (!rating || !review) {
            return res.status(400).json({ error: "Either rating or review is missing" })
        }
        if (!cropName)
            return res.status(400).json({ error: "crop name is missing" })

        const cropUser = await User.findOne({ name: name })
        if (!cropUser) {
            return res.status(400).json({ error: "No such crop user exist" })
        }

        const existCrop = await Crop.findOne({ cropName: cropName, user: cropUser })
        if (!existCrop) {
            return res.status(400).json({ error: "No such crop exist" })
        }

        const rev = new Review({
            crop: existCrop._id,
            cropUser: cropUser._id,
            reviewUser: reviewUser._id,
            rating: rating,
            review: review,
            isRecommended: isRecommended ? isRecommended : true,
        })
        const savedReview = await rev.save()

        try {
            return res.status(200).json({
                success: true,
                message: 'Review Saved',
                res: savedReview
            })
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Failed to save Review' })

        }
    }
    catch (e) {
        console.log(e);
    }
})

router.get("/", async (req, res) => {
    try {
        const limit = 10
        const review = await Review.find({})
            .sort('-created')
            .limit(limit)
            .exec()

        if (review)
            return res.status(200).json({
                success: true,
                res: review
            })
        else
            return res.status(400).json({ error: "No review yet" })

    } catch (e) {
        console.log(e);
    }
})

// get individual crop review 
router.get('/cropReview', async (req, res) => {
    const { userName, cropName } = req.body

    // user who created crop 
    const cropUser = await User.findOne({ name: userName })
    if (!cropUser)
        return res.status(400).json({ error: "No such user" })

    const crop = await Crop.findOne({ cropName: cropName, user: cropUser._id })
    if (!cropName)
        return res.status(400).json({ error: "No such Crop" })

    const review = await Review.find({ crop })

    try {
        return res.status(200).json({
            success: true,
            res: review
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "No review yet" })
    }
})

// update review 
router.put('/update/:_id', auth, async (req, res) => {
    const _id = req.params._id
    const { rating, review, isRecommended } = req.body

    if (!rating || !review) {
        return res.status(400).json({ error: "You forget to mention either rating review" })
    }
    if (!_id)
        return res.status(400).json({ error: "pls provide a id to update" })

    const reviewExist = await Review.findOne({ _id })
    if (reviewExist) {
        reviewExist.rating = rating,
            reviewExist.review = review,
            reviewExist.isRecommended = isRecommended ? isRecommended : false
    }
    const updateReview = await reviewExist.save()

    try {
        return res.status(200).json({
            success: true,
            message: 'review updated succesfully',
            res: updateReview
        })
    } catch (e) {
        return res.status(400).json({ error: "Failed to update" })
    }
})

module.exports = router