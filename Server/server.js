const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongodb');
const AuthRouter = require('./routes/Auth.routes');
const userRouter = require("./routes/user.route");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true}));
app.use(cookieParser());

// MongoDB connection
connectDB();

//Api Endpoints 
app.get('/',(req,res)=>{
  res.send("hello");
});

app.use('/api/auth', AuthRouter);
app.use('/api/user', userRouter);

app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`));

