const mongoose = require('mongoose');
const fs = require('node:fs');
const validator = require('validator');

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
        type: [directorNameSchema],
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
        minlength: [4, 'Movie name must be atleast 4 characters. {VALUE} given'], // (minlength & maxlength are used on strings)
        validate: [validator.isAlpha , 'Movie name should be only alphabets (A-Za-z'], // using validator library for custom validation on mongodb
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
        //  max: [10, 'The rating maxmum value is 10'] // min/ max are used for numbers and date
        //Let us use a custom validator instead of built-in validator like min,max, enum ..
        validate: {
            validator: function (value) {
                return value >= 10 && value <= 100; //using this keyword in validation function will work only on creating movie but not on update, because this return the object on new document we want to create
            },
            message: `Ratings should range btn 10.0 and 100.0, ({VALUE} given )`
        }
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
        max: [new Date("2024-11-25"), 'No movies released after' + new Date("2024-11-25")]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false // exclude this column when selecting the fields
    },
    genres: {
        type: [String],
        required: [true, 'The genres value is mandatory'],
    },
    directors: {
        type: [String],
        required: [true, 'The Directors value is mandatory'],
        enum: { //enum ( is the mongodb validator which ensure that only specified values are accepted in the database)
            values: ['David', 'Daniel', 'Dani'],
            message: 'The Director name provided is not correct '
        }
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
    },
    createdBy: {
        type: String
    }
}, {
    toJSON: { virtuals: true }, // add virtual field on the results when returned as a json
    toObject: { virtuals: true }
});

//VIRTUAL FIELDS

// Define a virtual field, these are field that not stored in the database but return on the model object or json. Example are autocalculated values like age from dob field
//NOTE: CAN NOT be used on document query because they are the part of the database and they are not in the document properties
movieSchema.virtual('durationInHous').get(function () {
    return this.duration / 60; //convert duratio from minutes to hours
});
// To include virtual field in the query result, pass an option on Schem() on the second parameter and set virtual to true

//DOCUMENT MIDDLEWARE ()

// There are two method, pre before the action in the database or post after the action on the database
//pre('save')
// save, will be applied on .save() or .create() only
// insertMany(), findByIdAndUpdate(), will not work
movieSchema.pre('save', function (next) {
    // Here you can do anything on the current document (this)
    // as example add a createdBy value (curently hard-coded value)
    this.createdBy = 'David Daniel' // remember to add this column (createdBy in the schema structure)
    next();  // call next middleware
});

//
movieSchema.post('save', function (document, next) { // document is the currently created document, since post run after action on the database and return the created document
    // Here you can do anything on the current document (document)
    // as example log some content on the log file 
    const content = `New Movie with name ${document.name} has been created by ${document.createdBy} on ${document.createdAt};\n`
    fs.writeFileSync('./Logs/log.txt', content, { flag: 'a' }, (error) => { // flag: 'a' , append the content to the existing content of the file instead of clearing the curremt content
        if (error) {
            console.log(error);
            return;
        }

    });
    next();

});


//QUERY MIDDLEWARE
// Thease are excuted on find operations (select data) and return the query object of find method
// post('find') // will be excuted on .find()
// movieSchema.pre('find', function (next) {
//     // as example filter all movies where release is less that current date/time
//     this.find({
//         releaseDate: {
//             $lte: Date.now()
//         }
//     })
//     next();
// });
// movieSchema.pre('findOne', function (next) {
//     // as example filter all movies where release is less that current date/time
//     this.find({
//         releaseDate: {
//             $lte: Date.now()
//         }
//     })
//     next();
// });

// use regular expression to find all query that start with find and excute the same middleware
movieSchema.pre(/^find/, function (next) { // pre run before excution/fetching the document
    // as example filter all movies where release is less that current date/time
    this.find({
        releaseDate: {
            $lte: Date.now()
        }
    })
    this.startTime = Date.now();
    next();
});

movieSchema.post(/^find/, function (documents, next) { // post run after excution/fetching the document: post takes 2 parameters

    this.endTime = Date.now();
    const timeTaken = this.endTime - this.startTime
    const content = `The Query takes  ${timeTaken} milliseconds \n`
    fs.writeFileSync('./Logs/log.txt', content, { flag: 'a' }, (error) => { // flag: 'a' , append the content to the existing content of the file instead of clearing the curremt content
        if (error) {
            console.log(error);
            return;
        }

    });
    next();
});
// AGGREGATE MIDDLEWARE
movieSchema.pre('aggregate', function (next) { // post run befote any aggregate pipeline, It has pipeline() method which return the aggregate stages as array of objects 
    // as example filter all movies where release is less that current date/time on aggregate pipeline
    this.pipeline().unshift({ $match: { releaseDate: { $gte: new Date() } } }); //unshift() add new array at the begining of the current array
    next();
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