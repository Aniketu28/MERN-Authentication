const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const register = async (req,res)=>{
 
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false, message:'missing Details'});
    }

    try{
      const user = await userModel.findOne({email});

      if(user){
        return res.json({success:false,message:'user Alrady exists'});
      }

      const hashPassword = await bcrypt.hash(password,10);

      const newUser = await userModel.create({
        name,
        email,
        password:hashPassword
      });

      await newUser.save();

      const token = await jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

      res.cookie('token', token, {
        httpOnly:true, // only http request 
        secure: process.env.NODE_ENV == 'production', //if https then true otherwise false
        sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',  // frontend and backend site is same or not e.g localhost
        maxAge : 7 * 24 * 60 * 60 * 1000   // 7 days 24 hrs 60 min 60 sec 1000 milsec
      });

    return res.json({success:true})

    }catch(error){
      res.json({uccess:false, message: error.message});
    }
}


const login = async (req, res)=>{

   const {email,password} = req.body;

   if(!email || !password){
     return res.json({success:false,message:'Email and Password is required'});
   }

   try{

    const user = await userModel.findOne({email});

    if(!user){
      return res.json({success:false,message:'Invlid Email and Password'});
    }

    const decode = await bcrypt.compare(password,user.password);

    if(!decode){
        return res.json({success:false,message:'Invlid Email and Password'});
    }

    const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

    res.cookie('token', token, {
      httpOnly:true, 
      secure: process.env.NODE_ENV == 'production', 
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',  
      maxAge : 7 * 24 * 60 * 60 * 1000
    });
    
   return res.json({success:true})

   }catch(error){
    return res.json({success:false,message:error.message});
   }

}

const logout = async (req,res)=>{

    try{

        res.ClearCookie('token', {
            httpOnly:true, 
            secure: process.env.NODE_ENV == 'production', 
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',  
          });

        return res.json({success:true,message:'logged out'});

    }catch(error){
       return res.json({success:false,message:error.message}); 
    }
}

module.exports = {register,login,logout}