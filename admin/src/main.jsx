// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { DoctorProvider } from './context/DoctorContext.jsx'



createRoot(document.getElementById('root')).render(
    <AppProvider>
      <AdminProvider>
        <DoctorProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DoctorProvider>
      </AdminProvider>
    </AppProvider>
)
