module.exports = async (req, res) => {
  try {
    const { email, givenName, familyName } = req.body
    if (!email || !givenName || !familyName) {
      return res.status(400).send('You must provide an email, given name, and family name.')
    }
    const db = req.app.get('db')
    const result = await db.collection('users').insertOne({ email, givenName, familyName, created: new Date().toString() })
    if (result) return res.status('201').send('User created')
  } catch (err) {
    return res.status('500').send(err)
  }
}
