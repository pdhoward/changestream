'use strict';
require('dotenv').config();
/////////////////////////////////////////////////////////////////////////
////////          classify the intent of a text message          ///////
///////////////////////////////////////////////////////////////////////
const bodyParser =  				   require('body-parser')
const path =                   require('path')
const csv =                    require('csvtojson')
const natural =                require('natural')
const sortby =                 require('sort-by')
const { g, b, gr, r, y } =     require('../console');
const category =               require('../training/category.json')

//const classifier = new natural.BayesClassifier();
const classifier = new natural.LogisticRegressionClassifier()

let intents = []

let compareresults = []

async function getNatural (compare) {
   let loadDocs = await loadit(compare)
   let intent = await trainit(loadDocs)
   return intent

}

const loadit = (compare) => {
  return new Promise((resolve, reject) => {
    for (const cmp of compare) {
      classifier.addDocument(cmp.text, cmp.intent)
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

const intent = (router) => {

  router.use(bodyParser.json());

  router.use(function(req, res, next) {
    console.log(g('\nReal Time Intent Analysis \n'))
    console.log(req.body)

    let resultsarray = []
    natural.LogisticRegressionClassifier.load('classifier.json', null, function(err, classifier) {

      let results = classifier.getClassifications(req.body.text)
      results[0].msg = req.body.text
      resultsarray.push(results[0])
      res.json(resultsarray)
      res.end()

    });
  })
}


module.exports = intent
