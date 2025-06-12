const jwt = require('jsonwebtoken');


const AuthMiddleware = async (req,res,next) =>{

    const token = req.cookies.token;

    if(!token){
        return res.json({success:false,message:'unauthrized user'});
    }

   try{

    const decode = await jwt.verify(token,process.env.JWT_SECRET);

    if(decode.id){
        req.userId = decode.id;
    }else{
        return res.json({success:true,message:'unauthrized user'});
    }

    next();

   }catch(error){
     return res.json({success:false,message:error.message})
   }

}

module.exports = AuthMiddleware;