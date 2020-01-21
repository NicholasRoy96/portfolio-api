const sinon = require('sinon')
const appRoot = require('app-root-path')
const deleteUser = require(`${appRoot}/controllers/users/delete`)
const { mockReq, mockRes } = require('sinon-express-mock')
const mongodb = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const app = require('express')()
const chai = require('chai')
chai.use(require('sinon-chai'))
const { expect } = chai

describe('delete user', () => {
  let client
  before(async () => {
    const connectionString = 'mongodb+srv://NicholasRoy:S36w05jxG1NT4m0K@cluster0-rtkdd.mongodb.net/test?retryWrites=true&w=majority'
    client = await mongodb.connect(connectionString, { useUnifiedTopology: true })
    await client.db().collection('users').insertOne(
      { _id: ObjectID('5dd869a30790d7085ca8f376'), email: 'nick@nick.com', givenName: 'nick', familyName: 'roy', created: new Date().toString() }
    )
    app.set('db', client.db())
  })

  describe('with a general error', () => {
    const res = mockRes()
    it('calls res.status with 500 error', async () => {
      await deleteUser({}, res)
      expect(res.status).to.have.been.calledWith('500')
    })
    it('calls res.send with the error', async () => {
      await deleteUser({}, res)
      expect(res.send).to.have.been.calledWith(sinon.match.has('message', "Cannot read property 'get' of undefined"))
    })
  })

  describe('if user does not exist', () => {
    const req = mockReq({
      app,
      params: { id: '507f1f77bcf86cd710439011' }
    })
    const res = mockRes()
    it('should return with a 404 status', async () => {
      await deleteUser(req, res)
      expect(res.status).to.have.been.calledWith('404')
    })
    it('should return a string saying cannot delete not-existent user', async () => {
      await deleteUser(req, res)
      expect(res.send).to.have.been.calledWith('Cannot delete a user that does not exist')
    })
  })

  describe('if user does exist', () => {
    const req = mockReq({
      app,
      params: { id: '5dd869a30790d7085ca8f376' }
    })
    const res = mockRes()
    it('should return with a 200 status and success message', async () => {
      await deleteUser(req, res)
      expect(res.status).to.have.been.calledWith('200')
      expect(res.send).to.have.been.calledWith('User deleted')
    })
  })
})
