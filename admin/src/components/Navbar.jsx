import React from 'react'
import {assets} from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Navbar = () => {

    const { token, setToken } = useApp()

  return (
      <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex items-center gap-2 text-xs'>
            <img className='x-36 sm:x-40 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{token ? 'Admin' : 'Doctor' }</p>
        </div>

        <button className='bg-primary text-white text-sm px-10 py-2 rounded-full cursor-pointer'>Logout</button>
           
      </div>

  )
}

export default Navbar
