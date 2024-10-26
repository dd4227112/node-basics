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
module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500; // if no status code set , use 500 as default
    error.statusMessage = error.statusMessage || 'error';//  if no status message set , use error as default
    // modify the error response based on application environment, we want to send full detailed error information in development for easy debug and less error detail in production for security purpose
    if (process.env.ENVIRONMENT !== 'development') {
        devError(response, error)
    } else {
        prodError(response, error);
    }
    next();
}