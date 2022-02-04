const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const validateRegisterInput = require("../validation/registerValidation");

// @route       GET /api/auth/test
// @desc        Test the auth route
// @access      Public
router.get("/test", (req, res) => {
    res.send("Auth route is working");
});

// @route       POST /api/auth/register
// @desc        Creates a new user
// @access      Public
router.post("/register", async (req, res) => {
    try {
        // checks inputs validity
        const {errors, isValid} = validateRegisterInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }

        // check for existing user
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")
        });



        if(existingEmail) {
            return res.status(400).json({error: "there is already an account with this email"})
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        // tries to create new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });
        // then saves the user to database
        const savedUser = await newUser.save();

        // return new user
        return res.json(savedUser);
    } catch (err) {
        // if there is an error
        console.log(err);
        res.status(500).send(err.message)
    }
})

module.exports = router;