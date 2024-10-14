/* LECTURE 4 RECEIVING USER INPUTS FROM COMMAND LILE
    // import { createInterface } from 'readline'; // using ES module
    const readline = require('readline');  // using commonjs
    // create readline interface
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // prompy user by display message and call back function to process the user input
    readlineInterface.question("What is your any number: ", (number) => {
        var sum = parseInt(number) + 100;
        console.log("Total is " + sum)
        readlineInterface.close();
    });

    readlineInterface.on('close', () => {
        console.log('Interface cloed');
        process.exit(0);
    });
*/

/* LECTURE 5-7 READING ANF WRITTING FILES SYNCHRONOUS AND ASYNCHRONOUS
    // const filestystem = require('fs'); 
    // synchronously
    import { readFileSync, writeFileSync, readFile, writeFile } from "node:fs";
    // const fileContents = readFileSync('./notes.txt', 'utf-8'); // read file synchronously
    // let writeContent = `File Content From notes file. \n${fileContents} \nCreated at: ${new Date()}`
    // writeFileSync('./new_notes.txt', writeContent);
    // console.log(fileContents);

    // Asynchronously
    readFile('./notes.txt', 'utf-8', (err1, data1) => {
        if (err1) throw err1;
        console.log(data1);

        console.log('Writting File...');

        let writeContent = `File Content From notes file. \n${data1} \nCreated at: ${new Date()}`
        writeFile('./new_notes.txt', writeContent, () => {
            console.log('File wrote');
            console.log('Reading  new File ');
            readFile('./new_notes.txt', 'utf-8', (err2, data2) => {
                if (err2) throw err2;
                console.log(data2);
            });
        });

    }); // read file Asynchronously
    console.log('Reading File...');
*/

/* LECTURE 8 - 10 CREATING A WB SERVER & HTTP REQUEST AND RESPONSE HOW IT WORKS
    import { createServer } from 'node:http'

    // STEP 1: CREATE SERVER
    const server = createServer((request, response) => {
        response.writeHead(200, { 'Content-Type': 'text' , 'Data':'DAVID DANIEL'})
        response.write('This is NodeJS application');
        response.end(); 
        // close server optional
        server.close(() => {
            console.log('Server closed!!')
        });

    });
    // STEP 1: START SERVER ( specify port and host, callback function (optional))
    server.listen(8000, '127.0.0.1', () => {
        console.log('Server started and running!!');

    });
*/

/* LECTURE 11-19 SIMPLE NODE ROUTER, WORKING WITH JSON DATA, CREATING CUSTOM/USER-DEFINED MODULE 
    import { readFile, readFileSync } from 'node:fs';
    import { createServer } from 'node:http'
    import { parse } from 'node:url';
    import { myDate, replaceHtml } from './Modules/index.js'
    const json_products = readFileSync('./Data/products.json', 'utf-8');  // we read file once to avaoid multiple reading the same file for each requests
    const products = JSON.parse(json_products) // convert json data to javascript object
    const header = readFileSync('./Pages/header.html', 'utf-8');
    const productPage = readFileSync('./Pages/products.html', 'utf-8');

    // create a resuable function
    // function replaceHtml(page, product) {
    //     let productOutput = page.replace('{{%IMAGE_URL%}}', product.productImage)
    //     productOutput = productOutput.replace('{{%NAME%}}', product.name)
    //     productOutput = productOutput.replace('{{%ALT_NAME%}}', product.name)
    //     productOutput = productOutput.replace('{{%COLOR%}}', product.color)
    //     productOutput = productOutput.replace('{{%ROM%}}', product.ROM)
    //     productOutput = productOutput.replace('{{%SIZE%}}', product.size)
    //     productOutput = productOutput.replace('{{%CAMERA%}}', product.camera)
    //     productOutput = productOutput.replace('{{%PRICE%}}', product.price)
    //     productOutput = productOutput.replace('{{%ID%}}', product.id)
    //     productOutput = productOutput.replace('{{%DESCRIPTION%}}', product.description)
    //     productOutput = productOutput.replace('{{%MODE_NAME%}}', product.modelName)
    //     productOutput = productOutput.replace('{{%MODE_NUMBER%}}', product.modelNumber)
    //     return productOutput
    // }

    const server = createServer((request, response) => {
        let { pathname: path, query } = parse(request.url, true);
        if (path.toLocaleLowerCase() === '/' || path === '/home') {  // convert path url to lowercase
            readFile('./Pages/index.html', 'utf-8', (err, data) => {
                response.writeHead(200, { 'Content-Type': 'html' })
                response.end(header.replace('{{%CONTENT%}}', data).replace('{{%HEADER_PAGE%}}', 'Home'));
            });

        }
        else if (path.toLocaleLowerCase() === '/about') { // convert path url to lowercase
            readFile('./Pages/about.html', 'utf-8', (err, data) => {
                response.writeHead(200, { 'Content-Type': 'html' })
                response.end(header.replace('{{%CONTENT%}}', data).replace('{{%HEADER_PAGE%}}', 'About'));
            });

        }
        else if (path.toLocaleLowerCase() === '/contact') {
            readFile('./Pages/contact.html', 'utf-8', (err, data) => {
                response.writeHead(200, { 'Content-Type': 'html' })
                response.end(header.replace('{{%CONTENT%}}', data).replace('{{%HEADER_PAGE%}}', 'Contact'));
            });
        }
        else if (path.toLocaleLowerCase() === '/products') {
            if (!query.id) {
                response.writeHead(200, { 'Content-Type': 'html' });
                // loop through all products and set the value to html file
                let productHtml = products.map((product) => { // foreach products as product
                    let productPageHtml = replaceHtml(productPage, product);
                    return productPageHtml;
                });
                response.end(header.replace('{{%CONTENT%}}', productHtml).replace('{{%HEADER_PAGE%}}', 'Products'));
            } else {
                let product = products[(query.id - 1)];

                readFile('./Pages/product_detail.html', 'utf-8', (err, data) => {
                    let productPageHtml = replaceHtml(data, product);
                    response.end(header.replace('{{%CONTENT%}}', productPageHtml).replace('{{%ID%}}', query.id).replace('{{%HEADER_PAGE%}}', 'Product Detail'));
                });
            }

        } else {
            response.writeHead(404, { 'Content-Type': 'html' });
            response.end(header.replace('{{%CONTENT%}}', "<h4> Page Not Found</h4>").replace('{{%HEADER_PAGE%}}', '404'));
        }
    });
*/

/* LECTURE 20 CREATING  EVENT EMITER, LISTENER AND HANDLER

*/
// creating server using event driven artictecture
import { createServer } from 'node:http'
import { myDate } from './Modules/index.js'


const server = createServer();
server.on('request', (request, response) => {
    response.end("Event handling architecture");

});
server.listen(8000, '127.0.0.1', () => {
    console.log('Server started at: ' + myDate());

});
server.on('close', () => {
    console.log('Server stoped at: ' + myDate());

});


// server.listen(8000, '127.0.0.1', () => {
//     console.log('Server started at: ' + myDate());

// });





