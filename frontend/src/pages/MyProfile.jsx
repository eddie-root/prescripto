import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {

  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: 'richardjames@gmail.com',
    phone: '+1 213 456 7890',
    address: {
      line1: '57th Cross, Richmond ',
      line2: 'Circle, Church Road, London'
    },
    gender: 'Male',
    dob: '2000-01-01'
  })

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <img src={userData.image} alt="" />
      {
        isEdit 
        ? <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
        : <p>{userData.name}</p>
      }
      
      <hr/>
      <div>
        <p>CONTACT INFORMATION</p>
        <div>
          <p>Email id:</p>
          <p>{userData.email}</p>
          <p>Phone Number:</p>
            {
              isEdit 
              ? <input type="text" value={userData.phone} onChange={(e) => setUserData({...userData, name: e.target.value})} />
              : <p>{userData.phone}</p>
            }
            <p>Address:</p>
            {
              isEdit 
              ?  <p>
                    <input onChange={(e)=> setUserData(prev => ({...prev, address: { ...prev.address, line1: e.target.value}}))} value={userData.address.line1} type="text" />
                    <br/>
                    <input onChange={(e)=> setUserData(prev => ({...prev, address: { ...prev.address, line2: e.target.value}}))} value={userData.address.line2} type="text" />
                </p>
              : <p>
                    {userData.address.line1}
                  <br />
                    {userData.address.line2}
                </p>
            }
        </div>
      </div>
      <div>
        <p>BASIC INFORMATION</p>
        <div>
          <p>Gender:</p>
            {
              isEdit 
              ? <select onChange={(e)=> setUserData(prev => ({...prev, gender: e.target.value }))} value={userData.gender} >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p>{userData.gender}</p>
            }
          <p>Date of Birth:</p>
            {
              isEdit
              ? <input type="date"  onChange={(e)=> setUserData(prev => ({...prev, dob: e.target.value }))} value={userData.dob} />
              : <p>{userData.dob}</p>
            }
        </div>
      </div>

      <div>
        {
          isEdit
          ? <button onClick={()=> setIsEdit(false)}>Save Information</button>
          : <button onClick={()=> setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile
