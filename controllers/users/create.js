const validator = require('email-validator')

module.exports = async (req, res) => {
  try {
    const db = req.app.get('db')
    const { email, givenName, familyName, dob } = req.body

    // existence checking required params
    if (!email || !givenName || !familyName || !dob) {
      return res.status('400').send('You must provide information in all the fields')
    }

    // email checks & inserting user
    if (!validator.validate(email)) {
      return res.status('400').send('You must provide a valid email')
    }
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status('409').send('A user already exists with this email.')
    }
    const newUser = {
      email: email.toLowerCase(),
      givenName: givenName.trim(),
      familyName: familyName.trim(),
      dob,
      created: new Date().toString()
    }
    await db.collection('users').insertOne(newUser)
    return res.status('201').send('User created')
  } catch (err) {
    return res.status('500').send(err)
  }
}
