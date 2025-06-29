import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    
    const backendUrl = import.meta.env.VITE_BACKENDURL;
    const [isLogedIn, setIsLogedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const value = {
        backendUrl,
        isLogedIn,
        setIsLogedIn,
        userData,
        setUserData
    }
    
    return (
        <AppContext.Provider value={value}>
          {children}
        </AppContext.Provider>
    )
} 