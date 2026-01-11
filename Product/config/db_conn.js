const mongoose = require('mongoose');
require('dotenv').config();

const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_cluster = process.env.MONGO_CLUSTER;
const mongo_database = process.env.MONGO_DBNAME;

if (!mongo_username || !mongo_password || !mongo_cluster || !mongo_database) {
    console.error('Missing MongoDB environment variables. Please check your .env file.');
    process.exit(1);
}

mongoose.connect(`mongodb+srv://${mongo_username}:${mongo_password}@${mongo_cluster}/${mongo_database}?retryWrites=true&w=majority`, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to MongoDB: ${mongoose.connection.name}`))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = mongoose;