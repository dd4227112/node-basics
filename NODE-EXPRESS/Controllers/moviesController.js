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
        //APPLYING WHERE CONDTIONS
        // select all movies and (or filter)
        // 1st approach (not recommended)
        //  const movies = await Movie.find(request.query) // will fitter movies if query string is passed to endpoint, otherwise will return all movies

        // 2nd approach
        // const movies = await Movie.find()
        //     .where('name')
        //     .equals(request.query.name)
        //     .where('price')
        //     .equals(request.query.price)

        // 3 rd approach
        // covert query parameter into string

        const queryObj = { ...request.query };
        const exludeQuery = ['page', 'sort', 'limit', 'fields'];

        exludeQuery.forEach((element) => {
            delete queryObj[element]
        });


        let stringParams = JSON.stringify(queryObj);

        // replace gte, gt, lt,lte with  $gte, $gt.....
        stringParams = stringParams.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`); // use \b to set exact match, replace all occurance by adding g
        // return back to json
        const queryParams = JSON.parse(stringParams)
        // console.log(queryParams)

        // const movies = await Movie.find(queryParams) // will fitter movies if query string is passed to endpoint, otherwise will return all movies

        // 2nd approach
        // const movies = await Movie.find()
        //     .where('name')
        //     .equals(request.query.name)
        //     .where('price')
        //     .gte(request.query.price) / greater then or equal
        //     .where('rating')
        //     .gt(request.query.price) // greater then

        // APPLYING SORT FUNCTIONALITY
        let query = Movie.find(queryParams); // create a query object by removing await keyword
        //check if sort is passed on query string otherwise let us sort by createdAt (optionally)
        if (request.query.sort) {

            //  query = query.sort(request.query.sort) //use - negetive for descending order ie sort(-name)
            // if we have multiple sort key, separate them by space i.e sort('name gender');
            // how to hanlde multiple sort key
            const sortKey = request.query.sort.split(',').join(' '); // convert to array then convert to string by seprating them with space
            query = query.sort(sortKey) //use - negetive for descending order ie sort(-name)
        } else {
            query = query.sort('-createdAt')
        }
        // LIMITING FIELDS (SELECT SOME COLUMN INSTEAD OF ALL COLUMNS)
        if (request.query.fields) {

            const selectFiels = request.query.fields.split(',').join(' ');
            // query = query.
            query = query.select(selectFiels);
        } else {
            query = query.select('-__v'); //exclude column by adding minus - before
        }

        // PAGINATIONS
        const page = request.query.page || 1;
        const limit = request.query.limit || 0;
        // calculate records to skip
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        // ensure that the document to skip does not exceed the number of document in the database
        const count = await Movie.countDocuments();
        if (skip >= count) {
            throw new Error('Page not Found');
        }
        const movies = await query; // Excute the query and assing the result to movies variable
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