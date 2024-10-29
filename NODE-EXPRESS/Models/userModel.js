const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a user\'s name'],
        minLength: [5, 'Name should be minimum 5 characters'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Please provide a user\'s email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    photo: String,

    password: {
        type: String,
        required: [true, 'Please provide a user\'s password'],
        minLength: [5, 'Password should be minimum 8 characters'],
        select: false
    },

    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function () {
                return this.password === this.confirmPassword
            },
            message: 'Passwords do not match'
        },
        select: false
    },
    passwordResetToken: String,

    tokenExpire: Date,
    
    passwordChangedAt: Date


});

userSchema.pre('save', async function (next) {
    //check if the field(i.e password) has been modifies
    if (!this.isModified('password')) {
        return next();
    }
    // encypt password using hash method
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});
// create a method that will be available in all instance of user model
userSchema.methods.checkUserPassword = async function (userPassword, paswordInDatabase) {
    return await bcrypt.compare(userPassword, paswordInDatabase);
}
// create a reset pass token method using crypto library
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.tokenExpire = Date.now() + (10 * 60 * 1000); // take current time and add 10 minutes (converted to milliseconds)
    return resetToken // we send a plain token to user but we save a encrypted token in  the database
}

const User = mongoose.model('User', userSchema);

module.exports = User;