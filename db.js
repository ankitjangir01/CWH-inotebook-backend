require('dotenv').config();
const mongoose = require('mongoose');

const connectToMongo = () => {
    const uri = process.env.MONGO_URI;
    console.log(uri);
    mongoose.connect(uri, () => {
        console.log("connected to mongo successfully");
    })
}

module.exports = connectToMongo;