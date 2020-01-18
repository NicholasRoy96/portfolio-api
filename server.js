const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')
const mongodb = require('mongodb').MongoClient
const mongoUri = 'mongodb+srv://NicholasRoy:S36w05jxG1NT4m0K@cluster0-rtkdd.mongodb.net/api?retryWrites=true&w=majority'

mongodb.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) throw new Error(err)
  app.set('db', client.db())
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes)

app.listen(3000, () => console.log('API running on port 3000'))

module.exports = app
