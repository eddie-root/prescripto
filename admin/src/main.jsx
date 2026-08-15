// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AdminContext } from './context/AdminContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'



createRoot(document.getElementById('root')).render(
    <AppProvider>
      <AdminContext>
        <DoctorContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DoctorContext>
      </AdminContext>
    </AppProvider>
)
