
const { EventEmitter } = require('eventemitter3')

class WithTime extends EventEmitter {
    async execute(asyncFunc, args) {
        this.emit('begin');
        try {
            console.time('execute');
            const data = await asyncFunc(args, "utf8");
            this.emit('data', data);
            console.timeEnd('execute');
            this.emit('end');
        } catch (err) {
            this.emit('error', err);
        }
    }
}

module.exports = WithTime


// for system level error .. executes once
process.once('uncaughtException', (err) => {
    // something went unhandled.
    // Do any cleanup and exit anyway!

    console.error(err); // don't do just that.

    // FORCE exit the process too.
    process.exit(1);
});
