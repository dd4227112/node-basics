const express = require('express');
const app = express();

// routes = url + method
// GET REQUESTS/ROUTES
app.get('/', (request, response) => { //make a get route
    response.status(200)
    response.send('<h4>Running nodejs - express application'); // send() used to response in text/html data format. content-type is automatically set to text/html when use send() function 
});

app.get('/data', (request, response) => { //make a get route
    const data = {
        name: "David Daniel",
        proffesion: "Software Developer",
        experience: "3 years"
    }
    response.status(200)
    response.json(data); // json() used to response in json data format. content-type is automatically set to application/json when use json() function 
});

// start server
const port = 5500;

app.listen(port, () => {
    console.log('Server has started');
});