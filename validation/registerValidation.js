const req = require("express/lib/request");
const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
    let errors = {};
    // checks email input
    if(isEmpty(data.email)) {
        error.email = "Email required"
    } else if(!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, try again";
    }

    // check name input
    if (isEmpty(data.name)) {
        errors.name = "Name required";
    } else if(!Validator.isLength(data.password, {min: 2, max: 125})) {
        errors.name = "Name must be between 2-125 characters";
    }

    // checks password input
    if(isEmpty(data.password)) {
        errors.password = "Password required";
    } else if(!Validator.isLength(data.password, {min: 6, max: 125})) {
        errors.password = "Must be between 6-125 characters";
    }

    // check confirmed password input
    if(isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirmation required";
    } else if(!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords input do not match";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
};

module.exports = validateRegisterInput;