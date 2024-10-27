const express = require('express');
const apiActions = require('../Controllers/moviesController')
const authController = require('./../Controllers/authController')
/* ROUTE MOUNTING ( we can apply a middleware to a specific routes) using express Router() */
const router = express.Router();

// create a param middleware, this will run on route with parameters ie  api/movies/:id
// apply checkId middleware from '/Controllers/moviesController'
// router.param('id', apiActions.checkId);
router.route('/movies-stats').get(authController.AuthMiddleware, apiActions.movieStats);
router.route('/movies-by-genre/:genre').get(authController.AuthMiddleware, apiActions.getMovieByGenre);
router.route('/')
    .get(authController.AuthMiddleware, apiActions.getAllMovies)
    // .post(apiActions.validatePostBody, apiActions.createMovie) // middleware chaining( applying multiple middleware on the same routes)
    .post(authController.AuthMiddleware, apiActions.createMovie)

router.route('/:id/:name?')  // we name parameter as on option by adding ? mark
    .get(authController.AuthMiddleware, apiActions.getMovieById)
    .patch(authController.AuthMiddleware, apiActions.updateMovieById)
    .delete(authController.AuthMiddleware, apiActions.deleteMovieById)

//export modules
module.exports = router;
