const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const requiresAuth = require("../middleware/permissions");
const validatePostInput = require("../validation/postValidation");

// @route GET /api/posts/test
// @desc test the posts route
// @access Public
router.get("/test", (req, res) => {
    res.send("posts route working");
});


// @route POST /api/posts/new
// @desc creates new post
// @access Private
router.post("/new", requiresAuth, async (req, res) => {
    try {
        const {isValid, errors} = validatePostInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }
        // creates new post
        const newPost = new Post({
            user: req.user._id,
            content: req.body.content,
            complete: false,
        })

        // save post
        await newPost.save();

        return res.json(newPost)

    } catch(err) {
        console.log(err);

        return res.status(500).send(err.message);
    }
});

// @route GET /api/posts/current
// @desc current users post
// @access Private
router.get("/current", requiresAuth, async (req, res) => {
    try {
        const completePosts = await Post.find({
                user: req.user._id,
                complete: true,
            }).sort({completedAt: -1});

            const incompletePosts = await Post.find({
                user: req.user._id,
                complete: false,
            }).sort({createdAt: -1});

            return res.json({ incomplete: incompletePosts, complete: completePosts });
    } catch(err) {
        console.log(err)
        return res.status(500).send(err.message);
    }
})

module.exports = router;