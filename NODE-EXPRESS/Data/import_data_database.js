//import dotenv packege
const dotenv = require('dotenv');
// Registered our env to nodejs process. This should the fist before anything else
dotenv.config({ path: `${process.cwd()}/.env` });
//  import app module
const mongoose = require('mongoose');
const fs = require('fs')
const Movie = require('../Models/movieModel');

//connect to database
mongoose.connect(process.env.DB_CONNECTION_REMOTE_URL,  { useNewUrlParser: true })
    .then((connect) => {
        console.log('Database connected..');
    })
    .catch((error) => {
        console.log(error);
    });


//read file and convert json data to javascript object
const movies = JSON.parse(fs.readFileSync('./Data/movies_advanced.json', 'utf-8'));
// console.log(movies);


const deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('Movies Deleted Successfully');

    } catch (error) {
        console.log('Error: ' + error.message);
    }
    //exit process after operation
    process.exit();
}
const importMovies = async () => {
    try {
        await Movie.create(movies);
        console.log('Movies Imported Successfully');

    } catch (error) {
        console.log('Error occured: ' + error.message);
    }
    //exit process after operation
    process.exit();
}
// check arguments passed in the terminal then run a specific function
if (process.argv[2] == '--delete') {
    deleteMovies();
}
if (process.argv[2] == '--import') {
    importMovies();
}  // run script by typing node file_path/import_data_data.js --delete or node file_path/import_data_data.js --import
