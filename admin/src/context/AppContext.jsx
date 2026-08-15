import { createContext, useContext, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [admin, setAdmin] = useState(()=> {
        const savedAdmin = localStorage.getItem('admin');
        return savedAdmin ? JSON.parse(savedAdmin) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);


    const value = {admin, setAdmin, token, setToken}

   return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
   ) 
}

export const useAdmin = () => useContext(AppContext);
