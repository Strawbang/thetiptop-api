const app = require('./app');
const http = require('http');
let https
let privateKey;
let certificate;
let credentials;
let httpsServer;
let fs;
if (process.env.ENV === 'development') {
    fs = require ('fs');
    https = require('https');
    privateKey  = fs.readFileSync('./localhost-key.pem', 'utf8');
    certificate = fs.readFileSync('./localhost.pem', 'utf8');
    credentials = {key: privateKey, cert: certificate};
}

const port = process.env.PORT || 8080;


//http server
const httpServer = http.createServer(app);

if (process.env.ENV === 'development') {
    httpsServer = https.createServer(credentials, app);
}

httpServer.listen(port, () => {
    console.log(`Server http is running on port ${port}.`)
})

if (process.env.ENV === 'development') {
    //https server
    httpsServer.listen(8081, () => {
        console.log(`Server https is running on port ${8081}.`)
    })

}

// if(process.env.ENV === 'development'){
//     module.exports = httpsServer
// }
// else{
//     module.exports= httpServer
// }

module.exports = {
    httpServer,
    httpsServer,
};