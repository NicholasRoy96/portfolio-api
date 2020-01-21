const sinon = require('sinon')
const appRoot = require('app-root-path')
const create = require(`${appRoot}/controllers/users/create`)
const { mockReq, mockRes } = require('sinon-express-mock')
const mongodb = require('mongodb').MongoClient
const app = require('express')()
const chai = require('chai')
chai.use(require('sinon-chai'))
const { expect } = chai

describe('create user', () => {
  let client
  before(async () => {
    const connectionString = 'mongodb+srv://NicholasRoy:S36w05jxG1NT4m0K@cluster0-rtkdd.mongodb.net/test?retryWrites=true&w=majority'
    client = await mongodb.connect(connectionString, { useUnifiedTopology: true })
    await client.db().collection('users').insertOne({ email: 'nick@nick.com', givenName: 'nick', familyName: 'roy', created: new Date().toString() })
    app.set('db', client.db())
  })

  after(async () => {
    await client.db().collection('users').deleteMany({})
  })

  describe('with a general error', () => {
    const res = mockRes()
    it('calls res.status with 500 error', async () => {
      await create({}, res)
      expect(res.status).to.have.been.calledWith('500')
    })
    it('calls res.send with the error', async () => {
      await create({}, res)
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
        await create(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should return with a string saying must provide information to all the fields', async () => {
        await create(req, res)
        expect(res.send).to.have.been.calledWith('You must provide an email, given name, and family name.')
      })
    })

    describe('with missing given name', () => {
      const req = mockReq({
        app: { get: sinon.stub() },
        body: { email: 'nick@nick.com', givenName: '', familyName: 'roy' }
      })
      const res = mockRes()
      it('should return with a 400 status', async () => {
        await create(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should return with a string saying must provide information to all the fields', async () => {
        await create(req, res)
        expect(res.send).to.have.been.calledWith('You must provide an email, given name, and family name.')
      })
    })

    describe('with missing family name', () => {
      const req = mockReq({
        app: { get: sinon.stub() },
        body: { email: 'nick@nick.com', givenName: 'nick', familyName: '' }
      })
      const res = mockRes()
      it('should return with a 400 status', async () => {
        await create(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should return with a string saying must provide information to all the fields', async () => {
        await create(req, res)
        expect(res.send).to.have.been.calledWith('You must provide an email, given name, and family name.')
      })
    })
  })

  describe('if email is invalid or already exists', () => {
    describe('email is invalid', () => {
      const req = mockReq({
        app,
        body: { email: 'nicknick.com', givenName: 'nick', familyName: 'roy' }
      })
      const res = mockRes()
      it('should return a 400 status', async () => {
        await create(req, res)
        expect(res.status).to.have.been.calledWith('400')
      })
      it('should call res.send with the invalid email error', async () => {
        await create(req, res)
        expect(res.send).to.have.been.calledWith('You must provide a valid email')
      })
    })

    describe('user with same email already exists', () => {
      const req = mockReq({
        app,
        body: { email: 'nick@nick.com', givenName: 'nick', familyName: 'roy' }
      })
      const res = mockRes()
      it('should return a 409 status', async () => {
        await create(req, res)
        expect(res.status).to.have.been.calledWith('409')
      })
      it('should call res.send with the email already exists error', async () => {
        await create(req, res)
        expect(res.send).to.have.been.calledWith('A user already exists with this email.')
      })
    })
  })

  describe('if the user doesnt exist', async () => {
    const req = mockReq({
      app,
      body: { email: 'duncan@duncan.com', givenName: 'duncan', familyName: 'fenning' }
    })
    const res = mockRes()
    it('should insert user to database and return a 201 status', async () => {
      await create(req, res)
      expect(res.status).to.have.been.calledWith('201')
    })
    it('should call res.send with user created message', async () => {
      await create(req, res)
      expect(res.send).to.have.been.calledWith('User created')
    })
  })
})
