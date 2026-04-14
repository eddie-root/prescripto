import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up')


  return (
    <form className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-90 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'Sign Up' : 'Login'} to book appointment</p>
          {state === 'Sign Up' && 
            <div className='w-full'>
              <p>Full Name</p>
              <input
                className='border border-zinc-400 rounded w-full p-2 mt-1' 
                type="text" 
              />
            </div>
          }
        <div className='w-full'>
          <p>Email</p>
          <input
            className='border-zinc-400 rounded w-full px-2 mt-1' 
            type="email" 
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input 
            className='border-zinc-400 rounded w-full px-2 mt-1' 
            type="password" 
          />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? 'Sign Up' : 'Login'}</button> 
      
      </div>
    </form>
  )
}

export default Login
