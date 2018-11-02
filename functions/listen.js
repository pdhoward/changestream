

const { EventEmitter } =    require('eventemitter3')
const metadata =            require('../data/meta.json')
const { g, b, gr, r, y } =  require('../console');

const listen = new EventEmitter();

let metaKeys = metadata.fields.map(m => m.id)

const queryLists = metaKeys.reduce((queryLists, key) => {    
    queryLists[key] = listen.on(key, (msg) => {console.log(msg)});    
    return queryLists;
  }, {});

module.exports = {queryLists, listen}