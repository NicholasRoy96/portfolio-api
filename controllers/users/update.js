const mongo = require('mongodb')
const validator = require('email-validator')

module.exports = async (req, res) => {
  try {
    const db = req.app.get('db')
    const { email, givenName, familyName, dob } = req.body

    // existence checking required params
    if (!email || !givenName || !familyName || !dob) {
      return res.status('400').send('You must provide information in all the fields')
    }

    // email checks
    if (!validator.validate(email)) {
      return res.status('400').send('You must provide a valid email')
    }

    // checking if user exists
    const existingUser = await db.collection('users').findOne({ _id: mongo.ObjectID(req.params.id) })
    if (!existingUser) {
      return res.status('404').send("Cannot update a user that doesn't exist")
    }

    // updating user, keeping original created date
    const updatedUser = {
      email: email.toLowerCase(),
      givenName,
      familyName,
      created: existingUser.created
    }
    await db.collection('users').findOneAndReplace({ _id: mongo.ObjectID(req.params.id) }, updatedUser)
    return res.status('200').send('User updated')
  } catch (err) {
    return res.status('500').send(err)
  }
}
