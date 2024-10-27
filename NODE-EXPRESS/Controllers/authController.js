const CustomError = require('../Utils/CustomError');
const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncError')
const jwt = require('jsonwebtoken');
const util = require('node:util')

// reusable function to create jwt token 
const signInToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRETE, { algorithm: process.env.JWT_ALGORITHM, expiresIn: process.env.TOKEN_EXPIRE })

}
module.exports.createUser = asyncErrorHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    // login the user with jwt

    //create a token
    const token = signInToken(user._id, user.email)
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

});
module.exports.deleteUser = asyncErrorHandler(async (req, res, next) => {

});
module.exports.loginUser = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email or password is poted
    if (!email || !password) {
        error = new CustomError('Email and Password are required!', 400);
        return next(error);
    }

    // check if user with that email exist
    const user = await User.findOne({ email }).select('+password');// since key and value are the same ( email:email), since password was ignored in user model from select query, we add it here because we want to use it ( +password)
    if (!user || !(await user.checkUserPassword(password, user.password))) {
        error = new CustomError('Email or password is incorrect', 404);
        return next(error);
    }

    //create a token
    const token = signInToken(user._id, user.email);
    res.status(200).json({
        status: "success",
        token,
        user
    })

});
module.exports.logoutUser = (req, res, next) => {

}

// create a route protection middleware. it check the authorization token, validate it then allow or deny access
module.exports.AuthMiddleware = asyncErrorHandler(async (req, res, next) => {
    //STEPS
    //1. read the token & check if exist
    const tokenParam = req.headers.authorization; // get authorization value from request headers
    let token;
    if (tokenParam && tokenParam.startsWith('bearer')) {
        const tokenArray = tokenParam.split(' '); // create array from string by using space in the string, key 0 will be bearer and 1  the actual token
        token = tokenArray[1];
    }
    if (!token) return next(new CustomError('Unauthorized access', 401));


    //2. validate the token
    //user jwt verify function to verfiy the token, but this function run async but does not return a promise. To make it return a promisse we use nodejs util library with promisify function
    const decodeToken = await util.promisify(jwt.verify)(token, process.env.JWT_SECRETE);
    // 3. check if user exist
    const user = User.findOne({ _id: decodeToken.id, email: decodeToken.email });
    if (!user) return next(new CustomError('User with the given token doesn\'t exist', 401));

    //4.check if user changed the password after token is issued

    //5. Allow user to acces the route
    next();

});