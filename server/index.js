require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

connectDB();

const corsOptions = {
  origin: [
    "https://attendifyattendkarle.vercel.app", // Vercel default
    "https://attendifyattendkarley.me",        // Custom domain (non-www)
    "https://www.attendifyattendkarley.me"     // Custom domain (www)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/attendance', attendanceRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () =>{
  console.log(`server is running on port http://localhost:${port}`)
});
