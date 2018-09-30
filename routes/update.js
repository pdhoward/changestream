
require('dotenv').config()
////////////////////////////////////////////////////////
////////        respond to cms webhook          ///////
///////////////////////////////////////////////////////
const bodyParser =  		       require('body-parser')
const contentful =             require('contentful');
const mongoose =               require('mongoose');
const assert =                 require("assert");
const sortby =                 require('sort-by')
const moment =                 require('moment')
const events =                 require('../events')
const { g, b, gr, r, y } =     require('../console');

let m = "MMMM, DD, YYYY, h:mm:ss a"

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
    let createdAt = moment(req.body.sys.createdAt).format(m)
    let updatedAt = moment(req.body.sys.updatedAt).format(m)
    console.log(createdAt)
    console.log(updatedAt)
    console.log(req.body.fields.name)
    console.log(req.body.fields.message)
   
      const db = mongoose.connection;
      let group = req.body.sys.contentType.sys.id
      let channel = req.body.fields.name
      let msg = req.body.fields.message
      let count = req.body.sys.revision     

      let msgObject = {
        "group": group,
        "channel": channel,
        "msg": msg,
        "count": count,
        "updatedAt": updatedAt
      }
   
    events.publish('watch', msgObject.msg['en-US'])
    
    events.isChange(req.body).then((result) => {
      if (result) {
        console.log(`Database Updated With New Change - ${result}`)
      } else {
        console.log(`No Change in DB Detected - ${result}`)
      }
      res.end()
      next()
    })
  })
}

module.exports = update
