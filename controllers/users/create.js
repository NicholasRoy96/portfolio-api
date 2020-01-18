module.exports = async (req, res) => {
    const { email, givenName, familyName } = req.body;
    if (!email || !givenName || !familyName) {
        res.status(400).send('You must provide an email, given name, and family name.')
    }

    try {
        const db = req.app.get('db')
        const result = await db.collection('users').insertOne({ email, givenName, familyName, created: new Date().toString() });
        if (result) res.status('201').send('User created');
    } catch (err) {
        res.status('500').send(err);
    }
}