
/////////////////////////////////
/////      dark sky  ///////////
///////////////////////////////

const { EventEmitter } = require('eventemitter3')
const fetch =            require('node-fetch')

const dark = new EventEmitter();
let secret = process.env.DARKSKY_SECRET
const api = "https://api.darksky.net/forecast/" + secret + "/43.7695,11.2558"

const getDarkWeather = async () => {
  try {
    const res = await fetch( api )
    const json = await res.json()     
    dark.emit("darkWeather", json.daily.summary)
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

module.exports = {getDarkWeather, dark}
