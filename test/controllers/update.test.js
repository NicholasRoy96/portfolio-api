const sinon = require('sinon')
const appRoot = require('app-root-path')
const update = require(`${appRoot}/controllers/users/update`)
const { mockReq, mockRes } = require('sinon-express-mock')
const mongodb = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const app = require('express')()
const chai = require('chai')
chai.use(require('sinon-chai'))
const { expect } = chai

describe('update a user', () => {
  let client
  before(async () => {
    const connectionString = 'mongodb+srv://NicholasRoy:S36w05jxG1NT4m0K@cluster0-rtkdd.mongodb.net/test?retryWrites=true&w=majority'
    client = await mongodb.connect(connectionString, { useUnifiedTopology: true })
    await client.db().collection('users').insertOne(
      { _id: ObjectID('5dd869a30790d7085ca8f376'), email: 'nick@nick.com', givenName: 'nick', familyName: 'roy', created: new Date().toString() }
    )
    app.set('db', client.db())
  })

  after(async () => {
    await client.db().collection('users').deleteMany({})
  })

  describe('with a general error', () => {
    const res = mockRes()
    it('calls res.status with 500 error', async () => {
      await update({}, res)
      expect(res.status).to.have.been.calledWith('500')
    })
    it('calls res.send with the error', async () => {
      await update({}, res)
      expect(res.send).to.have.been.calledWith(sinon.match.has('message', "Cannot read property 'get' of undefined"))
    })
  })

  describe('with invalid user input', () => {
    describe('with missing email', () => {
      const req = mockReq({
        app: { get: sinon.stub() },
        body: { email: '', givenName: 'nick', familyName: 'roy' }
      })
      const res = mockRes()
      it('should return with a 400 status', async () => {
        await update(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should return with a string saying must provide information to all the fields', async () => {
        await update(req, res)
        expect(res.send).to.have.been.calledWith('You must provide an email, given name, and family name to update the user.')
      })
    })

    describe('with missing given name', () => {
      const req = mockReq({
        app: { get: sinon.stub() },
        body: { email: 'nick@nick.com', givenName: '', familyName: 'roy' }
      })
      const res = mockRes()
      it('should return with a 400 status', async () => {
        await update(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should return with a string saying must provide information to all the fields', async () => {
        await update(req, res)
        expect(res.send).to.have.been.calledWith('You must provide an email, given name, and family name to update the user.')
      })
    })

    describe('with missing family name', () => {
      const req = mockReq({
        app: { get: sinon.stub() },
        body: { email: 'nick@nick.com', givenName: 'nick', familyName: '' }
      })
      const res = mockRes()
      it('should return with a 400 status', async () => {
        await update(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should return with a string saying must provide information to all the fields', async () => {
        await update(req, res)
        expect(res.send).to.have.been.calledWith('You must provide an email, given name, and family name to update the user.')
      })
    })
  })
  describe('if email is invalid or user does not exist', () => {
    describe('email is invalid', () => {
      const req = mockReq({
        app,
        body: { email: 'nicknick.com', givenName: 'nick', familyName: 'roy' }
      })
      const res = mockRes()
      it('should return a 400 status', async () => {
        await update(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should call res.send with the invalid email error', async () => {
        await update(req, res)
        expect(res.send).to.have.been.calledWith('You must provide a valid email')
      })
    })

    describe('user does not exist', () => {
      const req = mockReq({
        app,
        params: { id: '507f1f77bcf86cd710439011' },
        body: { email: 'duncan@duncan.com', givenName: 'duncan', familyName: 'fenning' }
      })
      const res = mockRes()
      it('should return with a 404 status', async () => {
        await update(req, res)
        expect(res.status).to.have.been.calledWith('404')
      })
      it('should return a message saying cannot update non-existent user', async () => {
        await update(req, res)
        expect(res.send).to.have.been.calledWith("Cannot update a user that doesn't exist")
      })
    })
  })

  describe('if user does exist and user input is complete', async () => {
    const req = mockReq({
      app,
      params: { id: '5dd869a30790d7085ca8f376' },
      body: { email: 'nicholas@nicholas.com', givenName: 'nicholas', familyName: 'roy' }
    })
    const res = mockRes()
    describe('should update the specified user', () => {
      it('should return a 200 status', async () => {
        await update(req, res)
        expect(res.status).to.have.been.calledWith('200')
      })
      it('should return a user updated message', async () => {
        await update(req, res)
        expect(res.send).to.have.been.calledWith('User updated')
      })
    })
  })
})
