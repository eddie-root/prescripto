import { createContext, useContext } from "react";


export const DoctorContext = createContext();

export const DoctorProvider = ({children}) => {




    const value = {}

   return (
    <DoctorContext.Provider value={value}>
        {children}
    </DoctorContext.Provider>
   ) 
}

export const useDoctor = () => useContext(DoctorContext);
