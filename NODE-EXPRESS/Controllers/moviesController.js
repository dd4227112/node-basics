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

module.exports.getAllMovies = async (request, response) => {
    try {
        const movies = (await Movie.find())
        // select all movies
        response.status(200).json({ //201- created
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        });

    } catch (error) {
        response.status(500).json({ // server error
            status: 'fail',
            message: error.message
        });
    }

};

module.exports.createMovie = async (request, response) => {

    //   both approachhes return a promise, we can handle resolved and rejected promise
    //    1st Approach
    //    const newMovie = new Movie(request.body);
    //    newMovie.save();
    //    2nd Approach
    //Movie.create(request.body).then(doc => console.log(doc)).catch(error => console.log(error));
    // 3rd Approach using async method
    try {
        const movie = await Movie.create(request.body);
        response.status(201).json({ //201- created
            status: 'success',
            data: {
                movie
            }
        });
    } catch (error) {
        response.status(500).json({ // server error
            status: 'fail',
            message: error.message
        });
    }

};

module.exports.getMovieById = async (request, response) => {
    try {
        //  const movies = await Movie.find({_id:request.params.id});
        const movie = await Movie.findById(request.params.id); //both are same with the commented above
        // select all movies
        response.status(200).json({ //201- created
            status: 'success',
            data: {
                movie
            }
        });

    } catch (error) {
        response.status(500).json({ // server error
            status: 'fail',
            message: error.message
        });
    }


};
module.exports.updateMovieById = async (request, response) => {
    try {

        const movie = await Movie.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, upsert: true }); //this will find model by id and update it using the value object passed on the second paramter
        // third paramter is optional, new - if true, return the  updated object after update, runValidators - if true, run validation using the schema validation rules, upsert , if true, when no document found based on supplied id, it create a new document
        // select all movies
        response.status(200).json({ //200- OK
            status: 'success',
            data: {
                movie
            }
        });

    } catch (error) {
        response.status(500).json({ // server error
            status: 'fail',
            message: error.message
        });
    }

};

module.exports.deleteMovieById = async (request, response) => {
    try {
        await Movie.findByIdAndDelete(request.params.id);
        response.status(204).json({ //204- no content
            status: 'success',
            data: null
        });

    } catch (error) {
        response.status(500).json({ // server error
            status: 'fail',
            message: error.message
        });
    }
};