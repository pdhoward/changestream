

require('dotenv').config();
////////////////////////////////////////////////////////////////////
////    test of new cycle - content drives interactions        ////
//////////////////////////////////////////////////////////////////
const bodyParser =  				  require('body-parser')
const Discovery =             require('watson-developer-cloud/discovery/v1');
const contentful =            require('contentful');
const { g, b, gr, r, y } =    require('../console');
const Table =                 require('cli-table2')

const client = contentful.createClient({
  space: process.env.CONTENT_SPACEID,
  accessToken: process.env.CONTENT_DELIVERY_ID,
  environment: "master"
})


const twilio = {
  sid: process.env.TWILIO_SID,
  token: process.env.TWILIO_TOKEN,
  API_Secret: process.env.TWILIO_API_SECRET,
  chaotic: process.env.TWILIO_NUMBER
}

// VCAP_SERVICES or .env sourced for pwd and usname
const discovery = new Discovery({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version: 'v1',
  version_date: '2017-11-07'
});



let queryBuilder
let queryTrendBuilder

let count = 0

////////////////////////////////////
/// mainline async function     ///
//   fetch entries from cms    ///
////////////////////////////////

async function message(msg) {

  let metadata = await fetchMeta('metadata')
  console.log(g('1 -Fetch meta data '))
  console.log(metadata)

  let allAgents = ['faq', 'live', 'notify', 'sub']

  let agents = await Promise.all(allAgents.map(async e => {
    const added = await fetchMeta(e)
    return added
  }))
  console.log(g('2 - Fetch dialogue bundles for agents '))
  console.log(agents)

  // first test cycle - just do a notification
  let respond = await sendMessage(msg)
  console.log(g('3 - Send message '))
  console.log(respond)

  let post = await postMessage(msg)
  console.log(g('4 - Post message '))
  console.log(post)

  let elapse = {}
  elapse.time = 3

  return elapse
}

// async function which feteches all entries for specific content type

const fetchMeta = (contentType) => {

  return new Promise((resolve, reject) => {
    client.getEntries({
        content_type: contentType
      })
    .then((response) => {
      resolve( response.items )
    })
    .catch((error) => {
      console.log(r(`\nError occurred while fetching Entries for ${y(contentType.name)}:`))
      reject(error)
    })
  })
}


//  async function to post all docs
const sendMessage = (entry) => {
  return new Promise((resolve, reject) => {
      const table = []

      resolve('success')
    })
}

//  async function to post all docs
const postMessage = (entry) => {
  return new Promise((resolve, reject) => {
      const table = []

      resolve('success')
    })
}


/////////////////////////////////////////////////////

const cycle = (router) => {

  router.use(bodyParser.json());

  router.use(function(req, res, next) {
    console.log("Testing the new real time agent cycle")

    message([req.body]).then((response) => {
      res.json({msg: `Success - The cycle time was ${response.time} seconds`})
      res.end()
      return
    }). catch((err) => {
      console.log(`Error executing Ingest`)
      console.log(err)
    })
  })
}


module.exports = cycle
