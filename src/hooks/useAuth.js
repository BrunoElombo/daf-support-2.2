import React, {useContext, useEffect} from 'react'
import { AUTHCONTEXT } from '../context/AuthProvider'

function useAuth() {
    const {setIsLoggedIn, isLoggedIn} = useContext(AUTHCONTEXT);
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token) {
            setIsLoggedIn(false);
            localStorage.clear();
        }
    }, []);
    
  return isLoggedIn;
}

export default useAuth