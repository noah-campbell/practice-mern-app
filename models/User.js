const { Schema, model } = require("mongoose");

// set the Schema for an account
const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    }, 
    {
        timestamps: true
    }
);

//export the model
const User = model("User", UserSchema);
module.exports = User;