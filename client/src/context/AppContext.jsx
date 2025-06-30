import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKENDURL;
    const [isLogedIn, setIsLogedIn] = useState(false);
    const [userData, setUserData] = useState();

    const getUserData = async () => {

        try {

            axios.defaults.withCredentials = true;

            const { data } = await axios.get(backendUrl + '/api/user/profile');

            if (data.success) {
                setIsLogedIn(true);
                setUserData(data);
            }

        } catch (error) {

            toast.error(error.message)
        }
    }

    const value = {
        backendUrl,
        isLogedIn,
        setIsLogedIn,
        userData,
        getUserData,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
} 