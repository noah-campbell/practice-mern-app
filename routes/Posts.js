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
});

// @route PUT /api/posts/:PostId/complete
// @desc completing post
// @access Private
router.put("/:postId/complete", requiresAuth, async(req, res) => {
    try {

        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.postId
        });

        if(!post) {
            return res.status(404).json({
                error :"could not find post"
            });
        }

        if(post.complete) {
            return res.status(400).json({
                error: "post is already complete"
            })
        }

        const updatedPost = await Post.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.postId,
        },
        {
            complete: true,
            completeAt: new Date(),
        },
        {
            new: true
        });

        return res.json(updatedPost);
    } catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }
});


// @route PUT /api/posts/:PostId/incomplete
// @desc marking post as incomplete 
// @access Private
router.put("/:postId/incomplete", requiresAuth, async (req, res) => {
    try {
        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.postId,
        });

        if(!post) {
            return res.status(400).json({
                error: "could not find post"
            });
        }

        if(!post.complete) {
            return res.status(400).json({
                error: "post is already incomplete"
            });
        }

        const updatedPost = await Post.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.postId,
            },
            {
                complete: false,
                completedAt: null,
            },
            {
                new: true,
            }
        );

        return res.json(updatedPost);
    } catch(err) {
        return res.status(500).send(err.message);
    }
});

// @route PUT /api/posts/:postId
// @desc updates the posts
// @access Private
router.put("/:postId", requiresAuth, async (req, res) => {
    try {
        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.postId
        });

        if(!post) {
            return res.status(404).json({
                error: "could not find post"
            });
        }

        const { isValid, errors } = validatePostInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }

        const updatePost = await Post.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.postId,
            },
            {
                content: req.body.content
            },
            {
                new: true,
            }
        );

        return res.json(updatePost);
    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
});

// @route DELETE /api/posts/:postId
// @desc Delete a post
// @access Private
router.delete("/:postId", requiresAuth, async (req, res) => {
    try {
        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.postId,
        });

        if(!post) {
            return res.status(404).json({
                error: "could not find post"
            });
        }

        await Post.findOneAndRemove({
            user: req.user._id,
            _id: req.params.postId,
        });

        return res.json({ success: true });
    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})

module.exports = router;