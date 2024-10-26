class CustomError extends Error { // we extend error class to make this class a error class
    constructor(message, statusCode) {
        // call the constructor of the base class i.e Error, and this constructor accept one parameter wich is the error message i.e new Error(error message)
        //to call the constructor of the base class, we use method supper(), since this  constructor accept error message parameter, will pass error message in super()  
        super(message)
        // set statusCode and statusMessage
        this.statusCode = statusCode;
        this.statusMessage = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'; // all operational error code range between 400 to 499 then we set message as fail otherwise it is programming error we set error
        this.isOperational = true;
        // create a stack property on this current object
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = CustomError;