const express = require('express');
const Users = require('../../../../models/Users');
const router = express.Router()
const jwt = require('jsonwebtoken')
const ErrorHandler = require('../../../../errors/ErrorHandler');
const JWT_CONFIG = require('../../../../config/jwt');

// @desc    Server API Register Page
// @route   GET /api/auth/register

router.post("/register", async (req, res) => {

    try {

        const { name, email, phone } = req.fields;

        if (!email) res.status(400).send({ error: "Email is required" })
        if (!phone) res.status(400).send({ error: "Phone is required" })
        if (!name) res.status(400).send({ error: "Name is required" })

        let oldUser = await Users.findOne({ email })
        if (oldUser) {
            return res.status(409).send({
                message: "User already exists"
            })

        }

        const registeredUser = await Users.create({
            name,
            email: email.toLowerCase(),
            phone,
        }).then(user => {
            return user.toObject()
        })

        return res.status(201).json({
            message: "User created successfully",
            user: registeredUser,
        })
    }
    catch (err) {
        const message = ErrorHandler(err)
        return res.status(400).send(message)


    }
})

// @desc    Server API Login Page
// @route   GET /api/auth/login

router.post("/login", async (req, res) => {
    try {
        const { email } = req.fields
        if (!email) return res.status(400).json({ error: "Email is required" })

        const user = await Users.findOne({ email })

        if (user) {
            const token = jwt.sign({ id: user._id, email, name: user.name },
                process.env.JWT_SECRET, {
                expiresIn: JWT_CONFIG.JWT_EXPIRE
            })
            return res.status(200).json({
                message: 'User logged in successfully',
                user: user.toObject(),
                access_token: token
            });
        }
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }
    catch (err) {
        const message = ErrorHandler(err)
        return res.status(400).send(message)


    }
})


module.exports = router