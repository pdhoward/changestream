
require('dotenv').config()
const bodyParser =              require('body-parser');
const mongoose =                require('mongoose');
const Redis =                   require('ioredis')
const api =                     require('../routes/api');
const assert =                  require("assert");

const channel = 'tasks';

/*
Modify Change Stream Output using Aggregation Pipelines
You can control change stream output by providing an array of one or more of the following pipeline stages when configuring the change stream:
$match, $project, $addFields, $replaceRoot, $redact
See Change Events for more information on the change stream response document format.
https://docs.mongodb.com/manual/reference/change-events/#change-stream-output
*/
const pipeline = [
  {
    $project: { documentKey: false }
  }
];

mongoose.connect('mongodb://localhost/tasksdb?replicaSet=rs0', { useNewUrlParser: true });

// mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=mongo-repl

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


    db.on('error', console.error.bind(console, 'Connection Error:'));

    db.once('open', () => {
      const taskCollection = db.collection('messagetest');
      const changeStream = taskCollection.watch();
        
      changeStream.on('change', (change) => {
        console.log("CHANGE DB DECTECTED")
        console.log(change);
          
        if(change.operationType === 'insert') {
          const task = change.fullDocument;
          console.log("------INSERT-----") 
          console.log(task)
        } else if(change.operationType === 'delete') {
            console.log("-----DELETE------")      
            console.log(change.documentKey._id)     
        }
      });
    });

}


const events = (app) => {

    let server = require('http').Server(app);

    register()

    return server

   
}

module.exports = events
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

