const mongo = require('mongodb')

module.exports = async (req, res) => {
  try {
    const db = req.app.get('db')
    const result = await db.collection('users').findOne({ _id: mongo.ObjectID(req.params.id) })
    if (!result) {
      return res.status('404').send('That user does not exist')
    }
    return res.status('200').send(result)
  } catch (err) {
    return res.status('500').send(err)
  }
}
