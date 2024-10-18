const express = require('express');
const apiActions = require('../Controllers/moviesController')
/* ROUTE MOUNTING ( we can apply a middleware to a specific routes) using express Router() */
const router = express.Router();

// create a param middleware, this will run on route with parameters ie  api/movies/:id
// apply checkId middleware from '/Controllers/moviesController'
router.param('id', apiActions.checkId);

router.route('/')
    .get(apiActions.getAllMovies)
    .post(apiActions.validatePostBody, apiActions.createMovie) // middleware chaining( applying multiple middleware on the same routes)

router.route('/:id/:name?')  // we name parameter as on option by adding ? mark
    .get(apiActions.getMovieById)
    .patch(apiActions.updateMovieById)
    .delete(apiActions.deleteMovieById) 

//export modules
module.exports = router;
