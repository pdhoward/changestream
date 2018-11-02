
const { EventEmitter } = require('eventemitter3')

class WithTime extends EventEmitter {
    async execute(asyncFunc, ...args) {
        this.emit('begin');
        try {
            console.time('execute');
            const data = await asyncFunc(...args);
            this.emit('data', data);
            console.timeEnd('execute');
            this.emit('end');
        } catch (err) {
            this.emit('error', err);
        }
    }
}

module.exports = WithTime
const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

withTime.execute(fs.readFile, __filename);

withTime.on('data', (data) => {
    // do something with data
});

withTime.on('error', (err) => {
    // do something with err, for example log it somewhere
    console.log(err)
});

// for system level error .. executes once
process.once('uncaughtException', (err) => {
    // something went unhandled.
    // Do any cleanup and exit anyway!

    console.error(err); // don't do just that.

    // FORCE exit the process too.
    process.exit(1);
});

/////////////////////////////////
///// 3rd example //////////////
///////////////////////////////

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/PUT_YOUR_API_KEY_HERE/43.7695,11.2558"
    );
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};