'use strict';

require('dotenv').config({
  silent: true
});
require('isomorphic-fetch');

////////////////////////////////////////////////////////////////
////////     prototype content-driven agents           ////////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const expressBrowserify =     require('express-browserify');
const bodyParser =  				  require('body-parser')
const path =                  require('path');
const cors =                  require('cors')
const Redis =                 require('ioredis')
const favicon =               require('serve-favicon');
const transport =             require('../config/gmail')
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '..', 'src'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());
app.use('/css', express.static(path.resolve(__dirname, '..', 'public/css')));
app.use('/images', express.static(path.resolve(__dirname, '..', 'public/images')));
app.use(express.static(path.join(__dirname, '..', 'node_modules/semantic-ui/dist')));
app.use(favicon(path.join(__dirname, '..', '/public/assets/favicon.ico')));
app.use(cors())

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

const browserifier = expressBrowserify(path.resolve(__dirname, '..', 'public/js/bundle.js'), {
  watch: isDev,
  debug: isDev,
  extension: ['js'],
  transform: ['babelify'],
});

if (!isDev) {
  browserifier.browserify.transform('uglifyify', { global: true });
}


///////////////////////////////////////////////////////////////////////
////////////////// streaming server set up via redislab///////////////
//////////////////////////////////////////////////////////////////////


let redisport = process.env.REDISPORT;
let redishost = process.env.REDISHOST;
let redispassword = process.env.REDISPASSWORD;

var redis = new Redis({
  port: redisport,
  host: redishost,
  password: redispassword

});
var pub = new Redis({
  port: redisport,
  host: redishost,
  password: redispassword
})


///////////////////////////////////////////////////////////////////////
/////////////////// messaging alert for platform errors ///////////////
//////////////////////////////////////////////////////////////////////


const mailObject = {
  from: process.env.TRANSPORT_LABEL,
  to: process.env.TRANSPORT_RECEIVER,
  subject: 'Platform Error',
  text: ''
}
process.on('uncaughtException', function (er) {
    console.error(er.stack)
    mailObject.text = er.stack;
    transport.sendMail(mailObject, function (er) {
       if (er) console.error(er)
       process.exit(1)
    })
  })


 //////////////////////////////////////////////////////
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////

const config =              express.Router()
const home =                express.Router()
const search =              express.Router()
const trend =               express.Router()
const content =             express.Router()
const intent =              express.Router()
const classify =            express.Router()
const ingest =              express.Router()
const cycle =               express.Router()

//require('../routes/config')(config)
require('../routes/home')(home)
//require('../routes/search')(search)
//require('../routes/trend')(trend)
//require('../routes/content')(content)
require('../routes/intent')(intent)
require('../routes/classify')(classify)
//require('../routes/ingest')(ingest)
require('../routes/cycle')(cycle)

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(config)

 // serve client
app.get('/js/bundle.js', browserifier);

// search request from search bar
app.get('/api/trending', trend)

// search request from search bar
app.get('/api/search', search)

// retrieve content from cms
app.get('/api/content', content)

// determine intent of a text message
app.post('/api/intent', intent)

// build and train a classifer based on submitted parameter
app.post('/api/classify', classify)

// ingest content from CMS into Discovery
app.post('/api/ingest', ingest)

// test cycle - content-driven agent
app.post('/api/cycle', cycle)

// home page
app.get('/', home)

const port = process.env.VCAP_APP_PORT || process.env.PORT

redis.subscribe('news', 'music', 'chat', function (err, count) {
  // Now we are subscribed to both the 'news' and 'music' channels.
  // `count` represents the number of channels we are currently subscribed to.
  console.log(`Currently tracking ${count} channels`) 
});

redis.on('message', function (channel, message) {  
  console.log('Receive message %s from channel %s', message, channel);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })


