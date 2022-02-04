const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middelware/permissions");

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

        // made new object to hide password from being accessed
        const userToReturn = { ...savedUser._doc };
        delete userToReturn.password;

        // return new user
        return res.json(userToReturn);
    } catch (err) {
        // if there is an error
        console.log(err);
        res.status(500).send(err.message)
    }
});

// @route       POST /api/auth/login
// @desc        login user and return access token
// @access      Public
router.post("/login", async (req, res) => {
    try {
        //check for user
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")
        })
        // if there is no one with that email, returns error
        if(!user) {
            return res
            .status(400)
            .json({error: "Email or password is incorrect"})
        }

        const passwordMatch = await bcrypt.compare(
            req.body.password, 
            user.password
        );
        // if the password does not match, send same error as above
        if(!passwordMatch) {
            return res
            .status(400)
            .json({error: "Email or password is incorrect"})
        }

        const payload = { userId: user._id };

        // passes json web token to user
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // passes cookie to user
        res.cookie("access-token", token, {
            // cookie requires expiration date in miliseconds
            expres: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        const userToReturn = { ...user._doc };
        delete userToReturn.password;

        // return use with jwt and cookie
        return res.json({
            token: token,
            user: userToReturn
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
});

// @route       GET /api/auth/current
// @desc        returns currently authed user
// @access      Private
router.get("/current", requiresAuth, (req, res) => {
    if(!req.user) {
        return res.status(401).send("Unauthorized");
    }

    return res.json(req.user);
})

module.exports = router;