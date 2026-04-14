import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      
      <Routes >
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='doctors' element={<Doctors />} />
          <Route path='doctors/:speciality' element={<Doctors />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='login' element={<Login />} />
          <Route path='my-profile' element={<MyProfile />} />
        </Route>

      </Routes>
      
    </div>
  )
}

export default App
