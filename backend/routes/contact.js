const express = require("express");
const router = express.Router();

const Contact = require('../models/contactModel');

router.post('/add', async (req, res) => {
    try {
        const { email,message, name } = req.body

        if (!name || !email) {
            return res.status(400).json({ error: "Either name or email is missing" })
        }
        if (!message)
            return res.status(400).json({ error: "message is missing" })

        const existContact = await Contact.findOne({ email })
        if (existContact) {
            return res.status(400).json({ error: "Contact already exist" })
        }

        const rev = new Contact({
            name,email,message
        })
        const savedContact = await rev.save()

        try {
            return res.status(200).json({
                success: true,
                message: 'Cantact Saved',
                res: savedContact
            })
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Failed to save Contact' })

        }
    }
    catch (e) {
        console.log(e);
    }
})

module.exports=router