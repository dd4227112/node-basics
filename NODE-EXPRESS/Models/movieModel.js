const mongoose = require('mongoose');
// create collection/moddel schema ( collection blueprint)
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name value is mandatory'],
        unique: [true, 'Duplicate movie name is not allowed']
    },
    description: String,
    duration: {
        type: String,
        required: [true, 'The duration value is mandatory'],
    },
    ratings: {
        type: Number,
        default: 1.0
    }
});

//create movie model 
const Movie = mongoose.model('Movie', movieSchema); // create and acces a movies collection from database

// create a   model/collection object
const movieTest = new Movie({
    name: "Interstellar New",
    description: "The best movie ever released in 2023",
    duration: 169
});

// excute query and insert data
movieTest.save().then((document) => {
    console.log(document)
}).catch((error) => {
    console.log('Error Occured ' + error);
});


module.exports = Movie;