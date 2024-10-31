const CustomError = require('../Utils/CustomError');
const sendMail = require('../Utils/Email');
const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncError')
const jwt = require('jsonwebtoken');
const util = require('node:util');
const crypto = require('crypto');

// reusable function to create jwt token 
const signInToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRETE, { algorithm: process.env.JWT_ALGORITHM, expiresIn: process.env.TOKEN_EXPIRE })

}

module.exports.createUser = asyncErrorHandler(async (req, res, next) => {
    let user = await User.create(req.body);
    //remove password key from the response object, since we dont want to show password in the response
    user.password = undefined;
    // login the user with jwt

    //create a token
    const token = signInToken(user._id, user.email)

    //  store token in the cookies , this will prevent x-site attack since token will not be stored in browser's local storage
    let options = {
        maxAge: process.env.TOKEN_EXPIRE, // set expire time
        httpOnly: true // cookies can not be read or modified by any browser
    }
    if (process.env.ENVIRONMENT === 'production') {
        options.secure = true //set security true means over https  protocals only, Usually in production environment 
    }
    res.cookie('jwtToken', token, options
    );

    res.status(201)
        .json({
            status: 'success',
            token,
            data: {
                user
            }
        });
});

module.exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    console.log(req)
    const users = await User.find();
    res.status(200)
        .json({
            status: 'success',
            data: {
                users
            }
        });

});

module.exports.getUser = asyncErrorHandler(async (req, res, next) => {

});

module.exports.updateUser = asyncErrorHandler(async (req, res, next) => {
    // we dont update password
    if (req.body.password || req.body.confirmPassword) {
        return next(new CustomError('You can update password on this requests'), 400); //400 bad requesst
    }
    const updateBody = filterFields(req.body, 'name', 'email');
    if (!updateBody) return next(new CustomError('You have included non-updatable fields only'), 400);

    const user = await User.findByIdAndUpdate(req.params.id, updateBody, { new: true, runValidators: true }); //new:true return update document after update, otherwise return the old data after update
    res.status(200).json({
        status: "success",
        user
    });
});

module.exports.deleteUser = asyncErrorHandler(async (req, res, next) => {

});

module.exports.changePassword = asyncErrorHandler(async (req, res, next) => {
    //check if user has posted cuurent password
    if (!req.body.currentPassword) return next(new CustomError('Please provide your current password'), 401);
    // fetch user details
    const user = await User.findOne({ _id: req.user._id }).select('+password');

    if (! await user.checkUserPassword(req.body.currentPassword, user.password)) {
        return next(new CustomError('Incorrect current password'), 401);
    }
    //  if (req.body.confirmPassword !== req.body.password) return next(new CustomError('Password do not match'), 401);
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await createUserResponse(user, res);
});

const createUserResponse = async (user, res) => {
    await user.save(); //require all fields to be included in the document
    token = signInToken(user._id, user.email);
    //  store token in the cookies , this will prevent x-site attack since token will not be stored in browser's local storage
    let options = {
        maxAge: process.env.TOKEN_EXPIRE,
        httpOnly: true // cookies can not be read or modified by any browser
    }
    if (process.env.ENVIRONMENT === 'production') {
        options.secure = true //set security true means over https  protocals only, Usually in production environment 
    }
    res.cookie('jwtToken', token, options
    );

    res.status(200).json({
        status: "success",
        token
    });
}

function filterFields(req, ...fields) {
    let updateFields = {};
    Object.keys(req).forEach((requestkey) => {
        if (fields.includes(requestkey)) {
            updateFields[requestkey] = req[requestkey];
        }
    });
    console.log(updateFields);
    return updateFields;
}
module.exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
    //actually we dont delete user, we will set inactive
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.status(201).json({
        status: "success",
        message: "User deleted"
    });

});