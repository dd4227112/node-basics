const express = require('express');
const moviesRoutes = require('./Routes/moviesRoutes')
const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')
const app = express();
const morgan = require('morgan');
const CustomError = require('./Utils/CustomError');
const errorController = require('./Controllers/errorController');

/* ES MODULE
    import express  from 'express'
    import { readFileSync} from 'fs'
    const app = express();
*/
// MIDDLEWERE 
// use json() middleware to add request body to request object
app.use(express.json());
process.env.ENVIRONMENT === 'development' ? app.use(morgan('dev')) : '' // morgan is not function middleware, it return the function middleware, so we call the function morgan()
app.use(express.static('./public')) // apply the static express middleware to save the static file by passing the path of the static files

// our custom middleware
function addCreatedAt(request, response, next) {
    request.createdAt = new Date().toISOString() // return date as staring value in ISO format
    next(); //call next function to excute next middleware
}

// routes = url + method
// GET REQUESTS/ROUTES
app.get('/', (request, response) => { //make a get route
    response.status(200)
    response.send('<h4>Running nodejs - express application'); // send() used to response in text/html data format. content-type is automatically set to text/html when use send() function 
});

app.get('/data', (request, response) => { //make a get route
    const data = {
        name: "David Daniel",
        proffesion: "Software Developer",
        experience: "3 years"
    }
    response.status(200)
    response.json(data); // json() used to response in json data format. content-type is automatically set to application/json when use json() function 
});

//API WITH EXPRESS


//HANDLERS FUNCTION


// const prefix = '/api/v1/';
const prefix = process.env.PREFIX // use environment varibale
/* ALTERNATIVE TO CREATE ROUTES
    // GET REQUEST - /api/v1/movies'

    app.get(prefix + 'movies', getAllMovies);
    // GET REQUEST WITH ID - /api/v1/movies/id'

    app.get(prefix + 'movies/:id/:name?', getMovieById);

    // POST REQUEST
    app.post(prefix + 'movies', createMovie);

    // PATCH REQUEST  WITH ID - /api/v1/movies/id'
    app.patch(prefix + 'movies/:id/', updateMovieById);

    // DELETE REQUEST  WITH ID - /api/v1/movies/id'
    app.delete(prefix + 'movies/:id/', deleteMovieById);
*/

/* NORMAL EXPRESS ROUTES

    // since api uses the same endpint, we can chain the using express route function
    app.route(prefix + 'movies')
        .get(apiActions.getAllMovies)
        .post(apiActions.createMovie)

    //  apply middle in this routes bellow
    app.use(addCreatedAt);
    app.route(prefix + 'movies/:id/:name?')  // we name parameter as on option by adding ? mark
        .get(apiActions.getMovieById)
        .patch(apiActions.updateMovieById)
        .delete(apiActions.deleteMovieById)
*/


// mount routes
app.use(prefix + 'movies', moviesRoutes)
app.use(prefix + 'auth', authRoutes);
app.use(prefix + 'users', userRoutes)
// define the defaiult route which will be excuted when the route doesn't match any other route (not found). Remember this be defined as the last routes
app.all('*', (req, res, next) => {
    // we are going to use global error handling middleware
    // res.status(404).json({ //200- OK
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on the server`) // javascript error constuctor, It accept the error message
    // err.statusCode = 404;
    // err.statusMessage = 'fail';

    /* Let use the CustomError class instead of calling error constructor  as we did above in the commented code*/
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404)

    //calling the global error middleware, we call next() and pass any value, so when next() is called with any value, express will assume that there is an error then will skip next middleware and call global error middleware
    next(err);
});

// ERROR HANDLING
// // GLOBAL MIDDLEWARE ( This will handle any arror that occured to our application, can be route, model, controller or anything else)
// // We are going to create a Custom Error class and import it anywhere in our application-->/Utils/CustomError.js
// app.use((error, request, response, next) => {
//     error.statusCode = error.statusCode || 500; // if no status code set , use 500 as default
//     error.statusMessage = error.statusMessage || 'error';//  if no status message set , use error as default

//     response.status(error.statusCode).json({
//         status: error.statusMessage,
//         messsage: error.message
//     })
//     next();
// });
/* We have moved the global middleware code above to errorController-->Controller/errorController.js */
app.use(errorController);

// start server, we are moving to a separate file(server.js) and this will be our entry file
// const port = 8003;

// app.listen(port, () => {
//     console.log('Server has started and running at http://127.0.0.1:' + port);
// });

//export app module
module.exports = app;
