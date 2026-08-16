import { useContext } from "react"
import { AdminContext } from './context/AdminContext'
import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"

import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Dashboard from './pages/Dashboard'


const App = () => {

  const {aToken} = useContext(AdminContext)

  return aToken ? (
    <div className="bg-[#f8f9fd]">
      <Toaster />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navbar/>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
    </>
  )
}

export default App
