

const { EventEmitter } =    require('eventemitter3')

const interval = new EventEmitter();



let count = 0;
setInterval(() => {
  interval.emit('ping', count);
  count++;
}, 3000);


module.exports = interval