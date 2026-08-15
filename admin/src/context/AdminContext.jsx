import { createContext, useContext, useState } from "react";
import { toast } from 'react-toastify'
import axios from 'axios'

export const AdminContext = createContext();

export const AdminContextProvider = ({children}) => {

    const [admin, setAdmin] = useState(()=> {
        const savedAdmin = localStorage.getItem('admin');
        return savedAdmin ? JSON.parse(savedAdmin) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const [ aToken, setAToken ] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const getAllDoctors = async () => {
        try {

            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers:{aToken}})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error){
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try{

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers:{aToken}});
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()                
            } else {
                toast.error(data.message)
            }

        } catch (error){
            toast.error(error.message)
        }
    }    

    const value = {
        admin, setAdmin, 
        token, setToken,
        backendUrl, doctors,
        aToken, setAToken,        
        getAllDoctors,
        changeAvailability        
    }

   return (
    <AdminContext.Provider value={value}>
        {children}
    </AdminContext.Provider>
   ) 
}

export const useAdmin = () => useContext(AdminContext);
