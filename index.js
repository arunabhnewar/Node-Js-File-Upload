const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require('formidable');
const port = 3000;


// Create a server
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method.toLowerCase();

    // Form read and write on synchronous way
    if (url === '/' && method === 'get') {

        const indexFile = fs.readFileSync('./index.html');
        res.writeHead(200, { "content-type": "text/html" })
        res.write(indexFile);
        res.end();
    }
    else if (url === '/process' && method === 'post') {

        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {

            // Error handle
            if (err) {
                res.end("Error while parsing the form!!")
            }

            // Form data write in a json file
            else {
                fs.writeFileSync(`./resources/${fields.name}.json`, JSON.stringify(fields));
                const fileName = files?.pic?.originalFilename;
                const filePath = files?.pic?.filepath;
                fs.renameSync(filePath, `${__dirname}/resources/${fileName}`);

                res.end('Thank you for submit');
            }
        })

        // req.on('data', (chunk) => {
        //     console.log(chunk);
        // })

        // req.on('end', () => {
        //     res.end('Thank you for submit');
        // })

    }
})



// Server listening
server.listen(port, () => {
    console.log("Sever is running successfully!!");
})