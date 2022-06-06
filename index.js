const connectToMongo = require('./db');
const express = require('express');
const app = express();
const port = 5000;
connectToMongo();

//middleware to read json data
app.use(express.json());

//availbale routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})