const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validateRegisterInput(data) {

    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.address = !isEmpty(data.address) ? data.address : ''
    data.cropType = !isEmpty(data.cropType) ? data.cropType : ''
    data.phone = !isEmpty(data.phone) ? data.phone : ''

    // name check
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required"
    }
    // address check
    if (Validator.isEmpty(data.address)) {
        errors.address = "address field is required"
    }

    // cropType check
    if (Validator.isEmpty(data.cropType)) {
        errors.cropType = "cropType field is required"
    }

    // check phone number
    if (Validator.isEmpty(data.phone)) {
        errors.phone = "phone number field is required"
    }
    

    // email check
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    // password check
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is empty";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm Password field is empty";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Password must match"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}