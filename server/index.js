const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Attendify backend server!');
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{
  console.log(`server is running on port http://localhost:${port}`)
});