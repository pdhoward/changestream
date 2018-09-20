

////////////////////////////////////////////////////////
////////        respond to cms webhook          ///////
///////////////////////////////////////////////////////
const bodyParser =  		   require('body-parser')
const contentful =             require('contentful');
const Table =                  require('cli-table2')
const path =                   require('path')
const sortby =                 require('sort-by')
const moment =                 require('moment')
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
    console.log(g("Explore Payload"))
    console.log(req.body.sys.type)
    console.log(req.body.sys.id)
    console.log(JSON.stringify(req.body.sys.space))
    console.log(JSON.stringify(req.body.sys.environment))
    console.log(JSON.stringify(req.body.sys.contentType))
    console.log(req.body.sys.revision)
    let createdAt = moment(req.body.sys.createdAt)
    let updatedAt = moment(req.body.sys.updatedAt)
    console.log(createdAt)
    console.log(updatedAt)
    console.log(req.body.fields.name)
    console.log(req.body.fields.message)
    res.end()

    next()
    
  })
}


module.exports = update
