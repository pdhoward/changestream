
require('dotenv').config()
const fs =                      require('fs');
const Redis =                   require('ioredis')
const assert =                  require("assert")
const nlp =                     require("compromise")
const {diff} =                  require("deep-diff")
const ss =                      require('string-similarity');
const db =                      require('../db')
const interval =                require('../functions/interval')
const {queryLists, listen} =    require('../functions/listen')
const {cbm} =                   require('../data/cbm/bookstore')
const WithTime =                require('../functions/time')
const {plugin} =                require('../data/plugin')
const { g, b, gr, r, y } =      require('../console');

const channel = 'tasks';

////////////////////////////////////////////////////////////////
////////////////// streaming server & db server ///////////////
///////////////////////////////////////////////////////////////

const collection = db.collection(process.env.MONGO_TEST_COLLECTION);

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
//////////////////   register events being monitored    //////////////
//////////////////////////////////////////////////////////////////////
const register = () => {

    console.log("REGISTERING ALL THE EVENTS")

    redis.subscribe('news', 'music', 'chat', function (err, count) {       
        console.log(`Currently tracking ${count} channels`)
    });

    redis.on('message', function (channel, message) {
      console.log(`Received ${message} from ${channel}`);
      console.log(g("----------compromise test ---------"))    
      
      //let topic2 = nlp(message).topics().data()      
      //let name = nlp(message).people().out('array')      
      //let firstname = nlp(message).people().firstNames().out('array')      
      //let lastname = nlp(message).people().lastNames().out('array')      
      //let dates = nlp(message).dates().data()      
      console.log("-------nouns--------")
      let nouns = nlp(message).nouns().out('array')
      console.log(nouns)

      nlp.plugin(plugin);
      //now nlp will act properly-
      let doc = nlp(message);
      //return these new tagged-results.
      console.log(y('NLP Plugin Test'))
      console.log(doc.match('#Knowledge+').out('array'))
      console.log(y('---------'))
      console.log(doc.match('#Search').out('array'))

      collection.insertOne({ channel: channel, message: message }, function (err) {
        assert.ifError(err);
      });
    });


    db.on('error', console.error.bind(console, 'Connection Error:'))

    db.once('open', () => {
      const collection = db.collection('posts')
      console.log(`db connection is a success`)
     
    });

    /////////

    interval.once('ping', () => console.log(g('The Pinging Begins')))
    interval.on('ping', num => {
      console.log(gr(`ping #${num} from module}`))
      if (num > 1) interval.off('ping')
    })

    console.log(r(`COGNITIVE CONTENT - DATA IN MOTION`))
    //console.log(queryLists)
    
    Object.keys(queryLists).forEach(key => {
      setTimeout(() => {
        queryLists[key].emit(key, b(`I am ${key}`));
      }, 3000);
    })

    /////////

    redis.on('message', function (channel, message) {
      console.log(g(`Received ${message} from ${channel}`));
      Object.keys(queryLists).forEach(key => {
        if (message.includes(key)) {
          queryLists[key].emit(key, `I am ${key}`);
        }
        else {
          console.log(`Metadata ${key} not detected in ${message}`)
        }
        
      })

    })
    // COMPILE THE CBM AND EMPLOY
    // parse text based on matching algorithm
    redis.on('message', function (channel, message) {
      const obj = cbm.reduce((acc, component) => {
        const action = component.action
        let score = ss.findBestMatch(message, component.triggers )
        let arr = []
        let newObj = {}
        newObj['action'] = action
        newObj['message'] = message
        newObj['match'] = score.bestMatch.target
        newObj['score'] = score.bestMatch.rating
        arr.push(newObj)
        return acc.concat(arr)
        
      }, [])
       
      console.log(r(`CBM Test for ${message}`))
      console.log(obj)
    })

   // AN EXPERIMENT IN USING CLASSES TO BUILD COMPONENT BUSINESS MODELS
  const withTime = new WithTime();

  withTime.on('begin', () => console.log('About to execute'));
  withTime.on('end', () => console.log('Done with execute'));

  let filename = "package.json"
  withTime.execute(fs.readFile, filename);

  withTime.on('data', (data) => {
    // do something with data
  });

  withTime.on('error', (err) => {
    // do something with err, for example log it somewhere
    console.log(err)
  });



}


const events = (app) => {
  let server = require('http').Server(app);
  register()
  return server
}

const publish = (channel, message) => {
  pub.publish(channel, message);
}

module.exports = {
  events,  
  publish
}