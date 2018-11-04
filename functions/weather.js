


/////////////////////////////////
/////      dark sky  ///////////
///////////////////////////////

const { EventEmitter } = require('eventemitter3')
const fetch =            require('node-fetch')

const dark = new EventEmitter();

const getDarkWeather = async () => {
  try {
    const obj = await fetch(
      "https://api.darksky.net/forecast/process.env.DARKSKY_SECRET/43.7695,11.2558"
    )
    dark.emit("darkWeather", obj.data.currently.temperature)
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

module.exports = {getDarkWeather, dark}
