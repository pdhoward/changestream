

const { EventEmitter } = require('eventemitter3')
const metadata =         require('../data/meta.json')

console.log(metadata)

const listen = new EventEmitter();


const metaKeys = Object.keys(metadata);
  console.log("---------------meta keys-------------")
  console.log(metaKeys)

const queryLists = metaKeys.reduce((queryLists, key) => {
    console.log("------reduce function on keys ---------------")
    console.log(queryLists)
    console.log(key)
    queryLists[key] = listen.on(media[key]);
    console.log(meta[key])
    return queryLists;
  }, {});