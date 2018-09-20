

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
    console.log(req.url)
    console.log(req.method)
    console.log(req.headers)
    console.log(r('-----------------------------'))
    console.log(req.body)
    console.log(r('-----------------------------'))
    console.log(req)
    res.end()

    next()
    
  })
}


module.exports = update
