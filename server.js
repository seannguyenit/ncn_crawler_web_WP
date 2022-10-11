const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
var server = require('http').createServer(app);

var cors_proxy = require('./lib/cors-anywhere').createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: []
});

require('dotenv').config
const port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));
let routes = require('./api/routes') //importing route
let p_routes = require('./public/routes') //importing route
routes(app)
p_routes(app)

app.use(express.static(path.join(__dirname, 'static')));

app.all('/proxy/:proxyUrl*', (req, res) => {
    if(req.url.indexOf('http') > -1){
        req.url = req.url.replace('/proxy/https:/', '/https://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
        req.url = req.url.replace('/proxy/http:/', '/http://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
    }else{
        req.url = req.url.replace('/proxy/', '/http://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
    }
    // console.log('proxy get url : ', req.url);
    cors_proxy.emit('request', req, res);
})
server.listen(port, () => {
    console.log('listening on *:4000');
});
console.log('RESTful API server started on: ' + port);

