const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },

    email : {
        type:String,
        required:true,
        unique:true
    },

    password : {
        type:String,
        required:true,
    },

    verifyotp : {
        type:String,
        default:''
    },

    verifyotpExpireAt : {
        type:Number,
        default:0
    },

    isVerify : {
        type: boolean,
        default:false
    },

    resetOtp : {
        type:String,
        default:''
    },

    resetOtpExpireAt : {
        type:Number,
        default:0
    },

});


//if model is present then taken otherwise it will create.

const userModel = mongoose.model.userModel ||  mongoose.model('user', userSchema);


module.exports = userModel;

