import { createContext, useContext, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [user, setUser] = useState(()=> {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);


    const value = {user, setUser, token, setToken}

   return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
   ) 
}

export const useApp = () => useContext(AppContext);
