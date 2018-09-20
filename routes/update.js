'use strict';
require('dotenv').config();
////////////////////////////////////////////////////////
////////        respond to cms webhook          ///////
///////////////////////////////////////////////////////
const bodyParser =  		   require('body-parser')
const contentful =             require('contentful');
const Table =                  require('cli-table2')
const path =                   require('path')
const sortby =                 require('sort-by')
const { g, b, gr, r, y } =     require('../console');


const update = (router) => {

  router.use(bodyParser.json());

  router.use(function(req, res, next) {
    console.log(g("Webhook Tests with CMS"))
    console.log(req.body)
    
  })
}


module.exports = update