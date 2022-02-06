const Validator = require("validator");
const Post = require("../models/Post");
const isEmpty = require("./isEmpty");

// Catches errors in posts and set limit to 300 characters
const validatePostInput = data => {
    let errors = {};

    // check content input
    if(isEmpty(data.content)) {
        errors.content = "content field can not be empty";
    } else if(!Validator.isLength(data.content, {min: 1, max: 300})) {
        errors.content = "Post must be between 1-300 characters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validatePostInput;