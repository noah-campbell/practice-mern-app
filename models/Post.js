const { Schema, model } = require("mongoose");

// set the Schema for a users post
const PostSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        complete: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
);

//export the model
const Post = model("Post", PostSchema);
module.exports = Post;