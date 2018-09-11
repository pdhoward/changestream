'use strict';

//////////////////////////////////////////////////////
////////      process start                   ///////
////////////////////////////////////////////////////
const utils =                 require('../lib/utils');
const { g, b, gr, r, y } =    require('../console');

const home = (router) => {

  router.use(function(req, res, next) {

        console.log(g("--------------home route ----------------"))

        if (res.headersSent) return next()   // exit if headers had been sent

        const {discovery, queryBuilder, queryTrendBuilder} = req;
        const params = queryBuilder.search({
          natural_language_query: '',
          count: 1000,
          passages: false
        });

        return new Promise((resolve, reject) => {
          discovery.query(params)
            .then(results =>  {

              // get all the results data in right format
              var matches = utils.parseData(results);
              matches = utils.formatData(matches, []);
              var totals = utils.getTotals(matches);

              // const util = require('util');
              // console.log('++++++++++++ DISCO RESULTS ++++++++++++++++++++');
              // console.log(util.inspect(results, false, null));

              res.render('index', {
                data: matches,
                entities: results,
                categories: results,
                concepts: results,
                keywords: results,
                entityTypes: results,
                numMatches: matches.results.length,
                numPositive: totals.numPositive,
                numNeutral: totals.numNeutral,
                numNegative: totals.numNegative
              });

              resolve(results);
            })
            .catch(error => {
              console.error(error);
              reject(error);
            })
            .finally(() => {
              return next()
            });
        });
    })
}

module.exports = home
