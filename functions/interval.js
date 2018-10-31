import { EventEmitter } from 'eventemitter3';

export const interval = new EventEmitter();

let count = 0;
setInterval(() => {
  interval.emit('ping', count);
  count++;
}, 3000);