const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const keys = require('../config/keys')

// validation load
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')
const auth = require('../middleware/auth')

//Load User Model
const User = require('../models/users')

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
    // form validation
    const { errors, isValid } = validateRegisterInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exist" })
        } else {
            const newUser = new User({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                address: req.body.address,
                cropType: req.body.cropType,
                phone: req.body.phone,
                role:req.body.role
            });

            // hash password before storing
            const rounds = 10;
            bcrypt.genSalt(rounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json({
                            success: true,
                            user: {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                address: user.address,
                                cropType: user.cropType,
                                role: user.role,
                                createdAt: user.date
                            }
                        }))
                        .catch(err => console.log(err))
                })
            });
        };
    });
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
    // form validation
    const { errors, isValid } = validateLoginInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email
    const password = req.body.password

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(400).json({ emailnotfound: "Email not found" })
        }

        // check password 
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // create jwt token 
                const payload = {
                    id: user.id,
                    name: user.name
                };

                // sign token 
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer-" + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: 'Password incorrect' })
            }
        });
    });

});


router.post("/forgot", async (req, res) => {
    try {
        const email = req.body.email
        if (!email) {
            return res.status(400).json({ error: 'You must enter Email' })
        }
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ error: 'Email does not exist' })
        }

        const token = crypto.randomBytes(32).toString('hex')
        existingUser.resetPasswordToken = token
        existingUser.resetPasswordExpires = Date.now() + 3600000

        existingUser.save()

        return res.status(200).json({
            success: true,
            message: `Your token will expire in ${existingUser.resetPasswordExpires}`,
            token: existingUser.resetPasswordToken
        })
    }
    catch {
        return res.status(400).json({ error: 'Cannot process your request' })
    }
})

router.post("/reset/:token", async (req, res) => {
    try {
        const password = req.body.password
        if (!password) {
            return res.status(400).json({ error: 'You must enter password' })
        }
        const resetPass = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!resetPass) {
            return res.status(400).json({ error: 'It seems your token has expired' })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        resetPass.password = hash
        resetPass.resetPasswordToken = undefined
        resetPass.resetPasswordExpires = undefined
        resetPass.save()

        return res.status(200).json({
            success: true,
            message: "password Succesfully changed",
            res: resetPass
        });

    } catch (e) {
        return res.status(400).json({ error: 'Not able to reset your password' })
    }
})

router.post("/reset", auth, async (req, res) => {
    try {
        const { password, password2 } = req.body
        if (!password || !password2) {
            return res.status(400).json({ error: 'You must enter password and confirm password' })
        }
        if (!(password === password2)) {
            return res.status(400).json({ error: 'password does not match pls try again' })
        }
        const resetPass = await User.findOne({ email: req.user.email });

        if (!resetPass) {
            return res.status(400).json({ error: 'There is no user associated yo the given user' })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        resetPass.password = hash
        resetPass.save()

        return res.status(200).json({
            success: true,
            message: "password Succesfully changed",
            res: resetPass
        });

    } catch (e) {
        return res.status(400).json({ error: 'Not able to reset your password' })
    }
})

router.get('/search/:user', auth, async (req, res) => {
    try {
        const existUser = await User.findOne({ name: req.params.user }).sort('-date')
        if (!existUser) {
            return res.status(400).json({ error: 'No such user exist' })
        } else {
            return res.status(200).json({
                success: true,
                message: "found user",
                res: existUser
            })
        }
    } catch (e) {
        return res.status(400).json({ error: 'Server not reachable' })
    }
})




module.exports = router
