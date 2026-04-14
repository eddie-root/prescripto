import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Toaster } from 'react-hot-toast';


const Layout = () => {
  return (
    <div>
      <Toaster />  
      <Navbar />
      <main>
        <Outlet />
      </main>
      
    </div>
  )
}

export default Layout
