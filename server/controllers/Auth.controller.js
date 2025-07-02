const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const transporter = require('../config/nodemailer')

const register = async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'missing Details' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      return res.json({ success: false, message: 'user Alrady exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword
    });

    await newUser.save();

    const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true, // only http request 
      secure: process.env.NODE_ENV == 'production', //if https then true otherwise false
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',  // frontend and backend site is same or not e.g localhost
      maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days 24 hrs 60 min 60 sec 1000 milsec
    });

    // Email options
    let mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: 'Welcome to Mern Authentication',
      text: `Mern Authentication project. Your Account has beend created successfully! with ${email} Email`
    };
    
    //send Email
    await transporter.sendMail(mailOptions);

    return res.json({ success: true })

  } catch (error) {
    res.json({ uccess: false, message: error.message });
  }
}

const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and Password is required' });
  }

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Invlid Email and Password' });
    }

    const decode = await bcrypt.compare(password, user.password);

    if (!decode) {
      return res.json({ success: false, message: 'Invlid Email and Password' });
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true })

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }

}

const logout = async (req, res) => {

  try {

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: 'logged out' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

const sendEmailVerificationOtp = async (req,res) =>{
  try {

    const userId = req.userId;

    const user = await userModel.findById(userId);

    if(user.isVerified){
      
      return res.json({success:false,message:"Email Already verified"})
 
     } 

    if (Date.now() > user.verifyotpExpireAt && user.verifyotpExpireAt != 0) {

      user.verifyotp = "";

      user.verifyotpExpireAt = 0;

      await user.save();

      return res.json({ success: false, message: "OTP expired send Again" });
    }

    if(user.verifyotp != ''){
      return res.json({success:false,message:'Otp is Already send'});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
 
    user.verifyotp = otp;

    user.verifyotpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();

      let mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject: 'Email Verification',
        text: `Your otp is ${otp}.verifty your Account using this otp.`
      };

      await transporter.sendMail(mailOptions,(error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.messageId);
        }
      })
   
    return res.json({ success: true, message: 'verification otp send to Email'});

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

const verifyEmailOtp = async (req,res)=>{

  const {otp} = req.body;
  const userId = req.userId;

  if(!userId || !otp){
    return res.json({success:false,message:'otp required'});
  }

  try{
    const user = await userModel.findById(userId);

    if(user.verifyotp == '' || user.verifyotp != otp){
      return res.json({success:false,message:'Invalid otp'});
    }

    if(Date.now() > user.verifyotpExpireAt){

      user.verifyotp = '';

      user.verifyotpExpireAt = 0;

      await user.save();

      return res.json({success:false,message:'otp Expired'});
    }

    user.isVerified = true;
    user.verifyotp = '';
    user.verifyotpExpireAt = 0;

    await user.save(); 

    return res.json({ success: true, message: 'Email verified successfully'});

  }catch(error){
    return res.json({ success: false, message: error.message });
  }
}

const isAuthenticated = async (req,res)=>{
   try{
    return res.json({ success: true});
   }catch(error){
    return res.json({ success: false, message: error.message });
   }
}

const sendResetOtp = async (req,res)=>{

   const {email} = req.body;

   if(!email){
    return res.json({ success: false, message:'Email is required'});
   }

   try{

    const user = await userModel.findOne({email});

    if(!user){
      return res.json({ success: false, message: 'User Not found'});
    }

    if(Date.now() > user.resetOtpExpireAt && user.resetOtpExpireAt != 0){

      user.resetOtp = "";

      user.resetOtpExpireAt = 0;

      await user.save();

      return res.json({success:false,message:'otp expired send Again'})
    }

    if(user.resetOtp != ''){
      return res.json({ success: false, message: 'otp Already send'});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    let mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Password Reset',
      text: `Your password reset otp is ${otp}.`
    };

    await transporter.sendMail(mailOptions,(error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.messageId);
      }
    })
 
  return res.json({ success: true, message: 'Reset otp send to Email'});

   }catch(error){
    return res.json({ success: false, message: error.message });
  }

}

const resetPassword = async (req,res)=>{
   
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword ){
      return res.json({success:false,message:'field email, otp, newPassword are required'})
    }

    const user = await userModel.findOne({email});

    if(!user){
      return res.json({success:false,message:'user not found'});
    }

    if(user.resetOtp == '' || user.resetOtp != otp){
      return res.json({success:false,message:'Invalid Otp'});
    }

    if(user.resetOtpExpireAt > Date.now()){
      return res.json({success:false,message:'Otp is Expired resend otp'});
    }

    const hashNewPassword = await bcrypt.hash(newPassword,10);

    user.password = hashNewPassword;

    user.resetOtp = '';

    user.resetOtpExpireAt = 0;

    user.save();

    return res.json({success:true,message:'password change successfully'});
}


module.exports = { register, login, logout, sendEmailVerificationOtp, verifyEmailOtp, isAuthenticated, sendResetOtp,resetPassword}