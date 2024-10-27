const CustomError = require('./../Utils/CustomError');
function devError(response, error) {
    response.status(error.statusCode).json({
        status: error.statusMessage,
        messsage: error.message,
        stackTrace: error.stack,
        error: error
    });
}
function prodError(response, error) {
    if (error.isOperational) {
        response.status(error.statusCode).json({
            status: error.statusMessage,
            messsage: error.message
        });
    } else {
        response.status(500).json({
            status: 'error',
            messsage: 'Something went wrong!! Please try again later'
        });
    }
}
const castErrorHandler = (error) => {
    const message = `Invalid value for field ${error.path}:  ${error.value}!`;
    return new CustomError(message, 404);
}
const validatorErrorHandler = (error) => {
    const errors = Object.values(error.errors).map(val => val.message);
    const errorMessage = errors.join('. ');
    return new CustomError(errorMessage, 400);
}
const duplicateErrorHandler = (error) => {
    // const message = `Duplicate value ${error.keyValue.name} for movie name`;
    const message = `Validation error occured`;
    return new CustomError(message, 400);
}
const jwtError = (error) => {
    return new CustomError(error.message, 401)
}
module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500; // if no status code set , use 500 as default
    error.statusMessage = error.statusMessage || 'error';//  if no status message set , use error as default
    // modify the error response based on application environment, we want to send full detailed error information in development for easy debug and less error detail in production for security purpose
    if (process.env.ENVIRONMENT === 'development') {
        devError(response, error);
    } else {
        if (error.name === 'CastError') {
            console.log("Eror name 2");
            error = castErrorHandler(error);
        } else if (error.name === 'ValidationError') {
            error = validatorErrorHandler(error);
        }
        else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error = jwtError(error);
        }
        else if (error.code = 11000) {
            error = duplicateErrorHandler(error);
        }
        prodError(response, error);
    }
    next();
}