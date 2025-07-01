import React, { useContext, useEffect, useRef } from 'react'
import { data, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerify = () => {

    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const { backendUrl, userData, getUserData } = useContext(AppContext);

    useEffect(()=>{
        getUserData();
    },[]);

    // const handelInput = (e,index)=>{
    //     if(e.target.value.length > 0){
    //       inputRefs.current[index + 1].focus();
    //     }else if(e.target.value.length == 0){  // new logic
    //       inputRefs.current[index -1].focus();
    //     }
    //   }


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

    const clearInputValues = () => {
        for (let i = 0; i < inputRefs.current.length; i++) {
          if (inputRefs.current[i]) { 
            inputRefs.current[i].value = "";
          }
        }
      };

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');

            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendUrl + '/api/auth/verify-otp', {otp});

            if(data.success){
                toast.success(data.message);
                navigate('/');

            }else{
                clearInputValues();
                toast.error(data.message);
            }

        } catch (e) {
            toast.error(e.message);
        }
    }


    if(!userData || userData?.isverified){
        navigate("/");
    }

    return (
        <div className='w-full flex justify-center items-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => { navigate('/') }} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' src={assets.logo} alt="logo" />
            <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h2 className='text-white text-2xl font-semibold text-center mb-4'>Email verify otp</h2>
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
                <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Verify Email</button>
            </form>
        </div>
    )
}

export default EmailVerify
