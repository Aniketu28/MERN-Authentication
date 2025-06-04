const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true}));
app.use(cookieParser());

// MongoDB connection
connectDB();

app.get('/',(req,res)=>{
  res.send("hello");
})

app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`));

