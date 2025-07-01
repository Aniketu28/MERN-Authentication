import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

  const navigate = useNavigate();

  const onSubmitHandler = ()=>{

  }
  return (
    <div className='w-full flex justify-center items-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400'>
                <img onClick={() => { navigate('/') }} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' src={assets.logo} alt="logo" />
                <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h2 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h2>
                    <p className='text-center mb-6 text-indigo-300'>Enter your register email</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-6 py-3 rounded-full bg-[#333A5C]'>
                       <img className='w-3 h-3' src={assets.mail_icon} alt="email" />
                       <input className='outline-none bg-transparent text-white' type="email" placeholder='Email' required />
                    </div>
                    <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Reset Password</button>
                </form>
            </div>
  )
}

export default ResetPassword
