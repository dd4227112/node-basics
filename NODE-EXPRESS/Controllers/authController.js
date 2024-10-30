const CustomError = require('../Utils/CustomError');
const sendMail = require('../Utils/Email');
const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncError')
const jwt = require('jsonwebtoken');
const util = require('node:util');
const crypto = require('crypto');

// reusable function to create jwt token 
const signInToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRETE, { algorithm: process.env.JWT_ALGORITHM, expiresIn: process.env.TOKEN_EXPIRE })

}

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
    const user = await User.findOne({ _id: decodeToken.id, email: decodeToken.email });
    if (!user) return next(new CustomError('User with the given token doesn\'t exist', 401));

    //4.check if user changed the password after token is issued

    //5. Allow user to acces the route
    req.user = user;  // we haved added user object to request object so that we can use it in the next request if needed
    next();

});
// module.exports.authorize = (role) => { // since middleware can't accept more than three prameters(req, res, next), we create a wrapper function which wil receive the fourth paramter and return  our middleware
//     return (req, res, next) => {
//         if (!req.user.role === role) {
//             return next(new CustomError('Access denied to this action', 403)); // forbidden
//         }
//         next();
//     }
// }
// for multiple roles, we can use rest parameters and this will return a string of roles as array ('user', 'admin', 'coordinator)
module.exports.authorize = (...role) => {

    return (req, res, next) => {
        console.log(req.user);
        if (!role.includes(req.user.role)) { // check if user role is among of the array values
            return next(new CustomError('Access denied to this action', 403)); // forbidden
        }
        next();
    }
}

//forget Pasword
module.exports.forgetPasword = asyncErrorHandler(async (req, res, next) => {
    //1. find user by email
    const email = req.body.email;
    if (!email) return next(new CustomError('Please provide your email'), 401);

    const user = await User.findOne({ email });

    if (!user) return next(new CustomError('No user registered with this email'), 401);

    //2. create reset token and update token and expire in the database
    //2.1 generate token 
    const token = user.createResetPasswordToken();

    //2.2 save in the database by disable validation
    await user.save({ validateBeforeSave: false });
    // send email to user with a reset link
    const resetLink = `${process.env.PROTOCAL}://${req.get('host')}${process.env.PREFIX}auth/resetPasword/${token}`;
    const message = `We have a reset password request. Please use the below link to reset your password <br><br> ${resetLink} <br>Or Click<a href="${resetLink}"> RESET PASSWORD </a><br><br> This link will expire after 10 minutes.`;
    const subject = "Reset Password Link";
    // pass this option in sendMail() to send email
    try {
        await sendMail({
            email,
            subject,
            message
        });
        res.status(200).json({
            status: "success",
            message: "Password Reset link sent to your email account!",
        })

    } catch (error) {
        user.passwordResetToken = undefined;
        user.tokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new CustomError(error.message, 500));
    }

});
// resetPasword
module.exports.resetPasword = asyncErrorHandler(async (req, res, next) => {
    // check email and token, and update user password
    //since the token was encryped, let us encrypt then compare it
    passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken,
        tokenExpire: {
            $gt: Date.now()
        }
    })
    if (!user) return next(new CustomError('Invalid Token or Token has expired'), 401);
    if (!req.body.confirmPassword || !req.body.password) return next(new CustomError('Password or Confirm Password are required'), 401);

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.tokenExpire = undefined;
    user.passwordChangedAt = Date.now();
    //update and send response
    await createUserResponse(user, res);
});
const createUserResponse = async (user, res) => {
    await user.save();
    token = signInToken(user._id, user.email);

    res.status(200).json({
        status: "success",
        token
    });
}