const path = require('path');
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
connectToMongo();

//middleware to read json data
app.use(cors());
app.use(express.json());

//availbale routes
app.get('/', (req,res)=>{
  res.sendFile('./inotebook/build/index.html');
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

//------------------for hosting on heroku--------------
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('inotebook/build'));
  app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/inotebook/build/index.html'));
  });
 }
 //------------------for hosting-------------

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})