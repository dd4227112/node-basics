const fileSystem = require('fs');
// read movies file
const moviesJson = fileSystem.readFileSync('./Data/movies.json'); // read file synchronously and once
const moviesData = JSON.parse(moviesJson) // convert json data into javascript object

module.exports.getAllMovies = (request, response) => {
    //format data with Jsend Json response
    response.status(200).json(
        {
            status: 'success',
            count: moviesData.length,
            data: {
                movies: moviesData
            }
        }
    );
};

module.exports.createMovie = (request, response) => {
    // create id for new object
    const newId = moviesData[moviesData.length - 1].id + 1 // get the id of the last index of our json data , then add 1 to get new id
    // create new object by concatenating the newId with request.body
    const newMovie = Object.assign({ id: newId }, request.body)
    console.log(newMovie);
    // push newView object to  moviesData object
    moviesData.push(newMovie);
    // convert javascript object to json data
    const moviesJsonData = JSON.stringify(moviesData);
    // write moviesData to the file (movies.json), use asynchronous to prevent blocking the main thread
    fileSystem.writeFile('./Data/movies.json', moviesJsonData, (err) => {
        if (err) {
            response.status(500).json(
                {
                    //format data with Jsend Json response
                    status: 'error',
                    message: err.message,
                    data: {
                        movie: ''
                    }
                }
            );
            return;
        } else {
            //format data with Jsend Json response
            response.status(200).json(
                {
                    status: 'success',
                    data: {
                        movie: newMovie
                    }
                }
            );
        }
    });

};

module.exports.getMovieById = (request, response) => {

    const id = parseInt(request.params.id) // since params object are the string, we  convert to number, where we want to use the value as a number

    //   let movie = moviesData[id-1]; // find the movies with id = id; alternative 1
    let movie = moviesData.find((element) => {  // find the movies with id = id it iterate though all moviesData assign the object to element ; alternative 2
        if (element.id === id) {
            return element
        }
    })
    //format data with Jsend Json response
    if (!movie) { //movie === undefined or !movie
        return response.status(404).json(
            {

                status: 'fail',
                requestedAt:request.createdAt,
                message: 'Movie with id: ' + id + ' does not exists',
                data: {
                    movie: ''
                }
            }
        );
    }
    //format data with Jsend Json response
    response.status(201).json(
        {
            status: 'success',
            requestedAt:request.createdAt,
            data: {
                movies: movie
            }
        }
    );
};
module.exports.updateMovieById = (request, response) => {

    const id = parseInt(request.params.id);
    // find the movies using id
    let movieToUpdate = moviesData.find((element) => {
        if (element.id === id) {
            return element
        }
    })

    if (!movieToUpdate) { //movieToUpdate === undefined or !movieToUpdate
        response.status(404).json(
            {
                //format data with Jsend Json response
                status: 'fail',
                requestedAt:request.createdAt,
                message: 'Movie with id: ' + id + ' does not exists',
                data: {
                    movie: ''
                }
            }
        );
        return;
    }
    // find the index of our movieToUpdate
    let index = moviesData.indexOf(movieToUpdate);
    // merge the movieToUpdate with request body
    Object.assign(movieToUpdate, request.body)
    // update moviesData object by refering to the specific index
    moviesData[index] = movieToUpdate;
    // write the json file
    fileSystem.writeFile('./Data/movies.json', JSON.stringify(moviesData), (err) => { // don't forget to convert javascript object to json string
        if (err) {
            response.status(500).json(
                {
                    //format data with Jsend Json response
                    status: 'error',
                    requestedAt:request.createdAt,
                    message: err.message,
                    data: {
                        movie: ''
                    }
                }
            );
            return;
        } else {
            //format data with Jsend Json response
            response.status(200).json(
                {
                    status: 'success',
                    requestedAt:request.createdAt,
                    data: {
                        movie: movieToUpdate
                    }
                }
            );
        }
    });
};

module.exports.deleteMovieById = (request, response) => {
    const id = parseInt(request.params.id);
    // find the movies using id
    let movieToDelete = moviesData.find((element) => {
        if (element.id === id) {
            return element
        }
    })

    if (!movieToDelete) {  // Not found
        response.status(404).json(
            {
                //format data with Jsend Json response
                status: 'fail',
                message: 'Movie with id: ' + id + ' does not exists',
                data: {
                    movie: ''
                }
            }
        );
        return;
    }
    // find the index of our movieToUpdate
    let index = moviesData.indexOf(movieToDelete);

    // remove/delete movieToDelete  obejct from moviesData object  by refering to the its index
    moviesData.splice(index, 1)  //  1- is count of numbers we need to delete

    // write the json file
    fileSystem.writeFile('./Data/movies.json', JSON.stringify(moviesData), (err) => { // don't forget to convert javascript object to json string
        if (err) {
            response.status(500).json(
                {
                    //format data with Jsend Json response
                    status: 'error',
                    message: err.message,
                    data: {
                        movie: ''
                    }
                }
            );
            return;
        } else {
            //format data with Jsend Json response
            response.status(204).json( //no content
                {
                    status: 'success',
                    data: {
                        movie: null
                    }
                }
            );
        }
    });
};