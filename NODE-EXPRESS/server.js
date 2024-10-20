//import dotenv packege
const dotenv = require('dotenv');
// Registered our env to nodejs process. This should the fist before anything else
dotenv.config({ path: `${process.cwd()}/.env` });
//  import app module
const mongoose = require('mongoose');
const app = require('./app');

// database  connection

mongoose.connect(process.env.DB_CONNECTION_REMOTE_URL, { useNewUrlParser: true })
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

app.listen(port, () => {
    // console.log(app.get('env')); // express environment variable  
    // console.log(process.env); // node environment variable
    console.log('Server has started and running at http://127.0.0.1:' + port);
});
