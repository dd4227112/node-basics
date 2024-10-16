const express = require('express');
const moviesRoutes = require('./Routes/moviesRoutes')
const app = express();
const morgan = require('morgan');

/* ES MODULE
    import express  from 'express'
    import { readFileSync} from 'fs'
    const app = express();
*/
// MIDDLEWERE 
// use json() middleware to add request body to request object
app.use(express.json());
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : '' // morgan is not function middleware, it return the function middleware, so we call the function morgan()
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

// start server, we are moving to a separate file(server.js) and this will be our entry file
// const port = 8003;

// app.listen(port, () => {
//     console.log('Server has started and running at http://127.0.0.1:' + port);
// });

//export app module
module.exports = app;
