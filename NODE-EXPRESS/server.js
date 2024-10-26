// handle reject promises global, which does not occur in express app
process.on('uncaughtException', (error) => {
    console.log(error.name, error.message);
    console.log('uncaughtException Rejection occured. Application is shutting down');
    // exit the application
    process.exit(1);
});
//import dotenv packege
const dotenv = require('dotenv');
// Registered our env to nodejs process. This should the fist before anything else
dotenv.config({ path: `${process.cwd()}/.env` });
//  import app module
const mongoose = require('mongoose');
const app = require('./app');

// database  connection

mongoose.connect(process.env.DB_CONNECTION_LOCAL_URL, { useNewUrlParser: true })
    .then((connect) => {
        console.log('Database connected..');
    })
    .catch((error) => {
        console.log(error);
    });




// start server
// const port = 8003;
// use the value from env file 
const port = process.env.PORT

const server = app.listen(port, () => {
    // console.log(app.get('env')); // express environment variable  
    // console.log(process.env); // node environment variable
    console.log('Server has started and running at http://127.0.0.1:' + port);
});

// handle reject promises global, which does not occur in express app
process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message);
    console.log('Unhandled Rejection occured. Application is shutting down');
    server.close(() => {

        // exit the application
        process.exit(1);
    });

});

