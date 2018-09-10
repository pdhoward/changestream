
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./routes/api');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  encrypted: true,
});
const channel = 'tasks';

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);

mongoose.connect('mongodb://localhost/tasksdb?replicaSet=rs0');

// mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=mongo-repl

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {
  app.listen(9000, () => {
    console.log('Node server running on port 9000');
  });

  const taskCollection = db.collection('tasks');
  const changeStream = taskCollection.watch();
    
  changeStream.on('change', (change) => {
    console.log(change);
      
    if(change.operationType === 'insert') {
      const task = change.fullDocument;
      pusher.trigger(
        channel,
        'inserted', 
        {
          id: task._id,
          task: task.task,
        }
      ); 
    } else if(change.operationType === 'delete') {
      pusher.trigger(
        channel,
        'deleted', 
        change.documentKey._id
      );
    }
  });
});

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


