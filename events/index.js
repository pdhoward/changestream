
require('dotenv').config()
const bodyParser =              require('body-parser');
const mongoose =                require('mongoose');
const Redis =                   require('ioredis')
const api =                     require('../routes/api');
const assert =                  require("assert");

const channel = 'tasks';

const pipeline = [
  {
    $project: { documentKey: false }
  }
];

let options = {
  upsert: true, 
  useNewUrlParser: true 
}

mongoose.connect('mongodb://localhost/streamdatabase', options);

const db = mongoose.connection;

const collection = db.collection("messagetest");


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
//////////////////   register events being monitored    //////////////
//////////////////////////////////////////////////////////////////////
const register = () => {

    console.log("REGISTERING ALL THE EVENTS")

    redis.subscribe('news', 'music', 'chat', function (err, count) {       
        console.log(`Currently tracking ${count} channels`)
    });

    redis.on('message', function (channel, message) {     
      console.log('Receive message %s from channel %s', message, channel);
      collection.insertOne({ channel: channel, message: message }, function (err) {
        assert.ifError(err);
      });
    });


    db.on('error', console.error.bind(console, 'Connection Error:'))

    db.once('open', () => {
      const collection = db.collection('posts')
      console.log(`db connection is a success`)
     
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

// under construction
const isChange = (obj) => {
      if (obj.sys.revision == 1) {
        console.log(`This is new - revision is ${obj.sys.revision}`)
        return true
      }
      const posts = db.collection('posts');
      /*
      posts.findOneAndUpdate({ id: obj.sys.id }, { $set: { obj: obj } }, options, function (err, doc) {
        if (err) {
          console.log("Something wrong when updating data!");
        }
        console.log(doc);
        return true
  });
  */
      return new Promise ((resolve, reject) => {
        posts.findOneAndUpdate({ id: obj.sys.id }, { $set: { obj: obj } }, options)
              .then((doc) => {
                console.log(doc);
                resolve(true)
              })
              .catch((err) => {
                console.log("Something wrong when updating data!");
                rject(false)
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

