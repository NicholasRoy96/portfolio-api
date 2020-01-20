const mongo = require('mongodb')

module.exports = async (req, res) => {
  try {
    const db = req.app.get('db')
    const result = await db.collection('users').deleteOne({ _id: mongo.ObjectID(req.params.id) })
    if (!result.deletedCount) {
      return res.status('404').send('Cannot delete a user that does not exist')
    }
    return res.status('200').send('User deleted')
  } catch (err) {
    return res.status('500').send(err)
  }
}
