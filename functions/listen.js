

const { EventEmitter } = require('eventemitter3')
const metadata =         require('../data/meta.json')

const listen = new EventEmitter();

let metaKeys = metadata.fields.map(m => m.id)

const queryLists = metaKeys.reduce((queryLists, key) => {    
    queryLists[key] = listen.on(key, () => {console.log(`heard from ${key}`)});    
    return queryLists;
  }, {});

module.exports = {queryLists, listen}