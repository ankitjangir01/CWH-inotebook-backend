require('dotenv').config();
const mongoose = require('mongoose');

const connectToMongo = () => {
    const uri = 'mongodb+srv://AnkitJangir:mzTtfJ8TV@inotebook.4ykgo.mongodb.net/iNotebook?retryWrites=true&w=majority';
    mongoose.connect(uri, () => {
        console.log("connected to mongo successfully");
    })
}

module.exports = connectToMongo;