import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  
  const navigate = useNavigate();
  const {backendUrl,setIsLogedIn} = useContext(AppContext)
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e)=>{

    try{
     
      e.preventDefault();
      
      if(state === 'sign up'){

        const {data} =  await axios(backendUrl + 'api/auth/register',{
          name,
          email,
          password
        });

        



      }

    

    }catch(error){
     
    }
     
  }

  return (
    <div className='w-full flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>{navigate('/')}} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' src={assets.logo} alt="logo" />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg xl:w-[460px] sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-2'>{state === 'sign up' ? 'create account' : 'Login account'}</h2>
        <p className='text-sm text-center mb-6'>{state === 'sign up' ? 'create your account' : 'Login your account'}</p>
        <form onSubmit={onSubmitHandler}>
          {state === 'sign up' && (
            <div className='mb-4 flex items-center gap-3 px-6 py-3 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="person-icon" />
              <input onChange={() => { setName(email.target.value) }} value={name}
                className='bg-transparent outline-none text-white'
                type="text"
                placeholder='Full Name'
                required />
            </div>
          )}
          <div className='mb-4 flex items-center gap-3 px-6 py-3 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="person-icon" />
            <input onChange={() => { setEmail(email.target.value) }} value={email}
              className='bg-transparent outline-none text-white'
              type="email"
              placeholder='Email Id'
              required />
          </div>
          <div className='mb-4 flex items-center gap-3 px-6 py-3 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="person-icon" />
            <input onChange={() => { setPassword(email.target.value) }}
              value={password}
              className='bg-transparent outline-none text-white'
              type="password"
              placeholder='Password'
              required />
          </div>
          <p onClick={()=>{navigate('/reset-password')}} className='mb-4 text-indigo-500 cursor-pointer px-2 py-1'>Forgot Password?</p>
          <button className='w-full rounded-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900
          text-white font-medium'>{state}</button>
        </form>
        {state === 'sign up' ? (
          <p className='text-gray-400 text-center text-sx mt-4'>Already have an Account?&nbsp;&nbsp;
            <span onClick={() => { setState('Login') }} className='text-blue-400 cursor-pointer underline'>Login here</span>
          </p>) : (
          <p className='text-gray-400 text-center text-sx mt-4'>Don't have an Account?&nbsp;&nbsp;
            <span onClick={() => { setState('sign up') }} className='text-blue-400 cursor-pointer underline'>Sign up</span>
          </p>)}
      </div>
    </div>
  )
}

export default Login
