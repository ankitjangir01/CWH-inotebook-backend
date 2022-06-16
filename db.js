require('dotenv').config();
const mongoose = require('mongoose');

const connectToMongo = () => {
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri, () => {
        console.log("connected to mongo successfully");
    })
}

module.exports = connectToMongo;