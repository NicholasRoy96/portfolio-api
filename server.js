require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')
const mongodb = require('mongodb').MongoClient
const cors = require('cors')
const config = require('./config')

mongodb.connect(config.mongodb.connection, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) throw new Error(err)
  app.set('db', client.db())
})

app.use(cors())
app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes)

app.listen(process.env.PORT, () => console.log('API running on port 3000'))

module.exports = app
