import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {

  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);


  const handelInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handelkeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handelPaste = (e) => {
    const paste = e.clipboardData.getData("Text").split('');
    paste.forEach((char, index) => {
      if (index < inputRefs.current.length) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onemailSubmitHandler = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });

      if (data.success) {
        toast.success(data.message);
        setSendOtp(true);
      } else if(!data.success && data.message == "otp Already send"){
        toast.success(data.message);
        setSendOtp(true);
      }else {
        toast.error(data.message);
        setSendOtp(false);
      }

    } catch (e) {
      toast.error(e.message);
    }

  }

  const onOtpSubmitHandler = (e) => {

    e.preventDefault();

    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true);

  }

  const newPasswordHandler = async (e) => {

    e.preventDefault();

    console.log(email,otp,newPassword);

    try {

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });

      console.log(data);

      if (data.success) {
        toast.success(data.message);
        navigate('/login');

      } else {
        toast.error(data.message);
      }

    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className='w-full flex justify-center items-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => { navigate('/') }} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' src={assets.logo} alt="logo" />
      {/* reset password */}
      {!sendOtp && (
      <form onSubmit={onemailSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h2 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h2>
        <p className='text-center mb-6 text-indigo-300'>Enter your register email</p>
        <div className='mb-4 flex items-center gap-3 w-full px-6 py-3 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.mail_icon} alt="email" />
          <input className='outline-none bg-transparent text-white'
            type="email"
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required />
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Reset Password</button>
      </form>
      )}
      {/* change password */}
      {!isOtpSubmited && sendOtp && (
      < form onSubmit={onOtpSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h2 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password otp</h2>
        <p className='text-center mb-6 text-indigo-300'>Enter 6-digit code send to your email.</p>
        <div className='flex justify-between mb-8' onPaste={handelPaste}>
          {Array(6).fill(0).map((_, index) => (
            <input ref={(e) => { inputRefs.current[index] = e }}
              className='w-12 h-12 bg-[#333A5C] text-center
                        text-white text-xl rounded-md'
              type="text"
              maxLength="1"
              onInput={(e) => { handelInput(e, index) }}
              onKeyDown={(e) => { handelkeyDown(e, index) }}
              key={index}
              required />
          ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Change Password</button>
      </form>
      )}
      {/* new Password */}
      {isOtpSubmited && sendOtp &&  (
      <form onSubmit={newPasswordHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h2 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h2>
        <p className='text-center mb-6 text-indigo-300'>Enter your new password</p>
        <div className='mb-4 flex items-center gap-3 w-full px-6 py-3 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.lock_icon} alt="email" />
          <input className='outline-none bg-transparent text-white'
            type="password"
            placeholder='New Password'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required />
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Submit</button>
      </form>
      )}

    </div >
  )
}

export default ResetPassword
