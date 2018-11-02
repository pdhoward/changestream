
require('dotenv').config()
const Redis =                   require('ioredis')
const assert =                  require("assert")
const nlp =                     require("compromise")
const {diff} =                  require("deep-diff")
const ss =                      require('string-similarity');
const db =                      require('../db')
const interval =                require('../functions/interval')
const {queryLists, listen} =    require('../functions/listen')
const {cbm} =                   require('../data/cbm/bookstore.js')
const { g, b, gr, r, y } =      require('../console');

const channel = 'tasks';

////////////////////////////////////////////////////////////////
////////////////// streaming server & db server ///////////////
///////////////////////////////////////////////////////////////

const collection = db.collection(MONGO_TEST_COLLECTION);

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
      
      //console.log(JSON.stringify(topics))
      console.log(nlp('Hey everybody, I’m lookin’ for Amanda Huggink…').topics().data())
      let topics = nlp('Hey everybody, I’m lookin’ for Amanda Huggink…').topics().data()
      console.log(typeof message)
      console.log(message)
      console.log(topics)
      let topic2 = nlp(message).topics().data()
      console.log(topic2)
      console.log("-------name---------")
      let name = nlp(message).people().out('array')
      console.log(name)
      console.log("-------firstname----------")
      let firstname = nlp(message).people().firstNames().out('array')
      console.log(firstname)
      console.log("-------lastname----------")
      let lastname = nlp(message).people().lastNames().out('array')
      console.log(lastname)
      console.log("-------dates---------")
      let dates = nlp(message).dates().data()
      console.log(dates)
      console.log("-------nouns--------")
      let nouns = nlp(message).nouns().out('array')
      console.log(nouns)
/*
      const plugin = {
        words: {
          't rex': 'Dinosaur',
          'pangaea': 'Noun',
          'tethys sea': 'Noun'
        },
        tags: {
          Dinosaur: {
            isA: 'Animal'
          },
          Animal: {
            isA: 'Noun'
          }
        },
        patterns: {
          "the #TitleCase (era|epoch)": "TimePeriod", //'the Jurassic era'
          "#Noun rex": "Dinosaur", //
        },
        regex: {
          '^paleo[a-z]{4}': 'Noun',
          '[a-z]iraptor$': 'Dinosaur',
        },
        plurals: {
          brontosaurus: 'brontosauri',
          stegosaurus: 'stegosauruses'
        }
      };
      //okay! 
      nlp.plugin(plugin);
      //now nlp will act properly-
      let doc = nlp('i saw a huge T-Rex and a velociraptor');
      //return these new tagged-results.
      return doc.match('#Animal+').out('array')
    }
*/

      collection.insertOne({ channel: channel, message: message }, function (err) {
        assert.ifError(err);
      });
    });


    db.on('error', console.error.bind(console, 'Connection Error:'))

    db.once('open', () => {
      const collection = db.collection('posts')
      console.log(`db connection is a success`)
     
    });
/*
    interval.once('ping', () => console.log(g('The Pinging Begins')))
    interval.on('ping', num => {
      console.log(gr(`ping #${num} from module}`))
      if (num > 4) interval.off('ping')
    })
    console.log(r(`NEW INVENTION FOR CONVERSATIONAL COMMERCE`))
    //console.log(queryLists)
    Object.keys(queryLists).forEach(key => {
      setInterval(() => {
        queryLists[key].emit(key, `I am ${key}`);
      }, 3000);
    })
*/
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
        /*
        return {
          ...acc,
          [action]: arr
        }
      }, {})
      */
      console.log(r(`CBM Test for ${message}`))
      console.log(obj)
      //var merge = (a, b, p) => a.filter( aa => ! b.find ( bb => aa[p] === bb[p]) ).concat(b);
      // a and b are 2 arrays, p is a property value submitted for merge/match between
      // 2 arrays


    })


}

const events = (app) => {
  let server = require('http').Server(app);
  register()
  return server
}

const publish = (channel, message) => {
  pub.publish(channel, message);
}

// updates existing db record 
// for first time posts -- REFACTOR --- ADD CODE TO update db

const isChange = (obj) => {
      
      const posts = db.collection('posts');
      
      return new Promise ((resolve, reject) => {

        if (obj.sys.revision == 1) {
          console.log(`This is new - revision is ${obj.sys.revision}`)
          resolve(false)
          return
        }

        // EXPERIMENTAL -- diff of 2 objects

        posts.findOne({id: obj.sys.id})
          .then((doc) => {
            let differences = diff(obj, doc)
            console.log(b(`-----------${obj.sys.id}-----------`))
            console.log(differences)
          })

        posts.findOneAndUpdate({ id: obj.sys.id }, { $set: { obj: obj } }, options)
              .then((doc) => {
                console.log(doc);
                resolve(true)
              })
              .catch((err) => {
                console.log("Something wrong when updating data!");
                reject(false)
              })
            })
      }

module.exports = {
  events,
  isChange,
  publish
}
   
/*

db.on('open', ()  => {
      console.log("Connected correctly to server");
      // specify db and collections
      //const db = client.db("superheroesdb");
      const collection = db.collection("superheroes");

      const changeStream = collection.watch(pipeline);
      // start listen to changes
      changeStream.on("change", function (change) {
        console.log("Super Hero Change Log")
        console.log(change);
      });

      // insert few data with timeout so that we can watch it happening
      setTimeout(function () {
        collection.insertOne({ "batman": "bruce wayne" }, function (err) {
          assert.ifError(err);
        });
      }, 1000);

      setTimeout(function () {
        collection.insertOne({ "superman": "clark kent" }, function (err) {
          assert.ifError(err);
        });
      }, 2000);

      setTimeout(function () {
        collection.insertOne({ "wonder-woman": "diana prince" }, function (err) {
          assert.ifError(err);
        });
      }, 3000);

      setTimeout(function () {
        collection.insertOne({ "ironman": "tony stark" }, function (err) {
          assert.ifError(err);
        });
      }, 4000);

      setTimeout(function () {
        collection.insertOne({ "spiderman": "peter parker" }, function (err) {
          assert.ifError(err);
        });
      }, 5000);

      // update existing document
      setTimeout(function () {
        collection.updateOne({ "ironman": "tony stark" }, { $set: { "ironman": "elon musk" } }, function (err) {
          assert.ifError(err);
        });
      }, 6000);

      // delete existing document
      setTimeout(function () {
        collection.deleteOne({ "spiderman": "peter parker" }, function (err) {
          assert.ifError(err);
        });
      }, 7000);

})
  .catch(err => {
    console.error(err);
  });
*/

