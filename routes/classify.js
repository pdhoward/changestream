'use strict';
require('dotenv').config();
/////////////////////////////////////////////////////////////////////////
////////         sweep contenful and build a classifier          ///////
///////////////////////////////////////////////////////////////////////
const bodyParser =  				   require('body-parser')
const contentful =             require('contentful');
const Table =                  require('cli-table2')
const path =                   require('path')
const natural =                require('natural')
const sortby =                 require('sort-by')
const { g, b, gr, r, y } =     require('../console');


const client = contentful.createClient({
  space: process.env.CONTENT_SPACEID,
  accessToken: process.env.CONTENT_DELIVERY_ID,
  environment: "master"
})
//const classifier = new natural.BayesClassifier();
const classifier = new natural.LogisticRegressionClassifier()

let intents = []

let concatarray = []

let compareresults = []


function conductTraining (contentTypes, cb) {

  console.log(g('\nStrategic Machines\n'))
  console.log('Dynamically Build a Classifier\n')
  console.log('Based on Content Retrieved from CMS\n')

  return Promise.all(contentTypes.map((contentType) => {
    return fetchEntriesForContentType(contentType)

        .then((entries) => {
          console.log(`\Processing Entries for Content Type ${y(contentType)}:\n`)

          intents = entries.map ((e) => {

            let obj = {}
            obj.intent = e.fields.intent
            let combine = e.fields.message.map((m) => {
              obj.message = m.fields.message
              return {...obj}
            })
            return combine

          })
          //console.log(intents)
          concatarray = intents.reduce((a, b) => a.concat(b), []);
        //  console.log(concatarray)

          let startTime = new Date().getTime()

          getNatural(concatarray)
            .then(() => {
              console.log(b("Training Completed"))
              classifier.save('classifier.json', function(err, classifier) {
                  // the classifier is saved to the classifier.json file!
                  let endTime = new Date().getTime()
                  let elapseTime = ((endTime - startTime) / 1000)
                  cb({msg: `Training was a success. It took ${elapseTime} seconds to complete`})
                });
            })
            .catch((error) => {
              console.log(error)
              cb(error)
            })

      })
      .catch((error) => {
        console.log(r(`\nError occurred with Contentful Access ${y(contentType)}:`))
        cb({msg: `Error - Unable to access classifier data file ${contentType}`})
      })
    }))
  }

// Load all entries for a given Content Type from Contentful
function fetchEntriesForContentType (contentType) {
  return client.getEntries({
      content_type: contentType
    })
      .then((response) => {
        return response.items
      })
      .catch((error) => {
        console.log(r(`\nError occurred while fetching Entries for ${y(contentType)}:`))
      })
}


async function getNatural (compare) {
   let loadDocs = await loadit(compare)
   let intent = await trainit(loadDocs)
   return intent

}

const loadit = (compare) => {
  return new Promise((resolve, reject) => {
    for (const cmp of compare) {
      classifier.addDocument(cmp.message, cmp.intent)
    }
    resolve(true)
  })
}
const trainit = (loadDocs) => {
  return new Promise((resolve, reject) => {
    classifier.train()
    resolve()

  })

}

// execute the build classifer function
//fetchEntries(['classifer'])


const classify = (router) => {

  router.use(bodyParser.json());

  router.use(function(req, res, next) {
    console.log("Testing the Classifier")
    console.log(req.body.text)

    conductTraining([req.body.text], (result) => {
      res.json(result)
      res.end()
    })
  })
}


module.exports = classify
