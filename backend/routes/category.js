const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const Category = require('../models/categoryModel')
const User = require('../models/users')


router.post('/add', auth, async (req, res) => {
    try {
        const { categoryName, categoryDesc } = req.body
        if (!categoryName || !categoryDesc) {
            return res.status(400).json({ error: "Either category name or description is missing" })
        }
        const user = await User.findOne({ name: req.user.name })
        const existCategory = await Category.findOne({ categoryName })
        if (existCategory) {
            return res.status(400).json({ error: "Category already exist" })
        } else {
            const category = new Category({
                categoryName, categoryDesc, createdBy: user._id
            })
            const savedCategory = await category.save()
            try {
                return res.status(200).json({
                    success: true,
                    message: 'Categoey Saved',
                    res: savedCategory
                })
            } catch (err) {
                console.log(err);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.get('/list', async (req, res) => {
    const allCategory = []
    const existCategory = await Category.find({})
    existCategory.forEach(cat => {
        allCategory.push(cat)
    })

    if (!existCategory)
        return res.status(400).json({ error: 'No Category Exist' })
    else {
        return res.status(200).json({
            success: true,
            res: allCategory
        })
    }
})

router.get('/:categoryName', async (req, res) => {
    try {
        const catName = req.params.categoryName
        if (!catName)
            return res.status(400).json({ error: 'categoryName missing' })

        const existCategory = await Category.findOne({ categoryName: catName })
        if (!existCategory) {
            return res.status(400).json({ error: 'No such category exist' })
        }
        else {
            return res.status(200).json({
                message: true,
                res: existCategory
            })
        }
    } catch (e) {
        console.log(e);
    }
})

router.put('/updateCategory/:categoryName', auth, async (req, res) => {
    try {
        const { updateCatName, updatecatDesc } = req.body

        if (!updateCatName || !updatecatDesc) {
            return res.status(400).json({ error: 'categoryname or categorydesc is missing' })
        }
        const existCategory = await Category.findOne({ categoryName: req.params.categoryName })
        if (existCategory) {
            if (updateCatName)
                existCategory.categoryName = updateCatName

            if (updatecatDesc)
                existCategory.categoryDesc = updatecatDesc

            existCategory.createdBy = req.user._id

            existCategory.save()
            return res.status(200).json({
                success: true,
                message: `Your category is updated successfully`,
                res: existCategory
            })
        } else {
            return res.status(400).json({ error: 'Category does not exist' })
        }
    }
    catch (e) {
        console.log(e);
    }
})

module.exports = router
