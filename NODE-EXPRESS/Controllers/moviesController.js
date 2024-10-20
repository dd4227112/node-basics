const Movie = require('../Models/movieModel');


// middleware to validate requst body
exports.validatePostBody = ((request, response, next) => {

    if (!request.body.name || !request.body.releaseYear || !request.body.duration) { //movieToUpdate === undefined or !movieToUpdate
        return response.status(400).json( // 400 bad request
            {
                //format data with Jsend Json response
                status: 'fail',
                message: 'Invalid Request ',
                data: {
                    movie: ''
                }
            }
        );

    }
    next();

});

module.exports.getAllMovies = (request, response) => {
   
};

module.exports.createMovie = (request, response) => {
   

};

module.exports.getMovieById = (request, response) => {

};
module.exports.updateMovieById = (request, response) => {

};

module.exports.deleteMovieById = (request, response) => {
  
};