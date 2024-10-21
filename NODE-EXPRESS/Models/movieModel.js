const mongoose = require('mongoose');
// create collection/moddel schema ( collection blueprint)
const directorNameSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

});
const directorSchema = new mongoose.Schema({
    name: {
        type: [directorNameSchema ],
        required: true
    },
    numberOfMovies: {
        type: Number,
        required: [true, 'The number of movies for the Directors required'],
    }
});

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name value is mandatory'],
        unique: [true, 'Duplicate movie name is not allowed'],
        trim: true // remove white spaces before and after
    },
    description: {
        type: String,
        required: [true, 'The desciption field is required'],
        trim: true // remove white spaces before and after
    },
    duration: {
        type: String,
        required: [true, 'The duration value is mandatory'],
        trim: true // remove white spaces before and after
    },
    ratings: {
        type: Number,
        default: 1.0,
        max: [10, 'The rating maxmum value is 10']
    },
    totalRatings: {
        type: Number,
    },
    releaseYear: {
        type: Number,
        required: [true, 'The releaseYear value is mandatory'],
        max: [new Date().getFullYear(), 'No movies released after' + new Date().getFullYear()]
    },
    releaseDate: {
        type: Date,
        required: [true, 'The releaseDate value is mandatory'],
        max: [new Date(), 'No movies released after' + new Date()]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genres: {
        type: [String],
        required: [true, 'The genres value is mandatory'],
    },
    directors: {
        type: [String],
        required: [true, 'The Directors value is mandatory'],
    },
    coverImage: {
        type: String,
        required: [true, 'The coverImage value is mandatory'],
    },
    actors: {
        type: [String],
        required: [true, 'The actors value is mandatory'],
    },
    price: {
        type: Number,
        required: [true, 'The releaseYear value is mandatory'],
        min: 10
    }
});

//create movie model 
const Movie = mongoose.model('Movie', movieSchema); // create and acces a movies collection from database

// // create a   model/collection object
// const movieTest = new Movie({
//     name: "Interstellar New",
//     description: "The best movie ever released in 2023",
//     duration: 169
// });

// // excute query and insert data
// movieTest.save().then((document) => {
//     console.log(document)
// }).catch((error) => {
//     console.log('Error Occured ' + error);
// });


module.exports = Movie;