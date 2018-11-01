

const { EventEmitter } = require('eventemitter3')
const metadata =         require('../data/meta.json')

console.log(metadata)

const listen = new EventEmitter();


const metaKeys = Object.keys(metadata);
  console.log("---------------meta keys-------------")
  console.log(metaKeys)

const queryLists = metaKeys.reduce((queryLists, key) => {    
    queryLists[key] = listen.on(key, () => {console.log(`heard from ${key}`)});    
    return queryLists;
  }, {});

module.exports = queryLists