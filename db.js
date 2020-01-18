const {MongoClient} = require('mongodb');

const main = async () => {
    const uri = 'mongodb+srv://NicholasRoy:GTEKqgcyUcLCn7nM@cluster0-rtkdd.mongodb.net/test?retryWrites=true&w=majority';
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to database');
    } catch (e) {
        console.error(e);
    }
}

module.exports = main;