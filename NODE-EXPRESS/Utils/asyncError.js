module.exports = (func) => { // this will receive a wait function as parater (func), once this function return reject promise (error) then we will handle the error in tach block
    return (req, res, next) => { // create a function that will be called by express when the main async function is called. Also prevent immediate excution of hanlder function 
        func(req, res, next).catch((error) => {
            next(error)
        });
    }
}