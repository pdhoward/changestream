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

        return new Promise((resolve, reject) => {   

          res.render('index', {
            data: null,
            entities: {},
            categories: {},
            concepts: {},
            keywords: {},
            entityTypes: {},
            numMatches: 0,
            numPositive: 0,
            numNeutral: 0,
            numNegative: 0
          });

          resolve();
          return next()         
        });
      })
}

module.exports = home
