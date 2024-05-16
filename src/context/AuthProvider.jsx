import { useState, useEffect, createContext } from "react";
// import { useHistory } from 'react-router-dom'; // for redirection

const REFRESH_THRESHOLD = 2 * 60 * 60 * 1000;
import useFetch from "../hooks/useFetch";

export let AUTHCONTEXT = createContext();



const token = localStorage.getItem("token");

const AuthProvider = (props)=>{
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") || false);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user")));
    const [defaultEntity, setDefaultEntity] = useState(JSON.parse(localStorage.getItem("entity"))||{});
    const [allEntities, setAllEntities] = useState(JSON.parse(localStorage.getItem("entities")) || []);
    const {requestLoading, fetchData, postData, requestError} = useFetch();

    const handleGetUserInfo =async ()=>{
        let userData = await fetchData(import.meta.env.VITE_DAF_API+"/users/account");
        console.log(userData);
        if(userData){
          setUserInfo(userData.result);
        }
    }

    const handleGetEntities =async ()=>{
      let entities = await fetchData(import.meta.env.VITE_DAF_API+"/users/account");
        console.log(entities);
        if(entities){
          setUserInfo(entities.result);
        }
    }


    useEffect(()=>{
        const storedToken = localStorage.getItem('token');
        if(!userInfo){
            handleGetUserInfo();
        }

        if(!allEntities){
          handleGetEntities();
        }

        if(!storedToken){
          
        }
    }, []);

    const refreshToken = async () => {
        const response = await fetchData(import.meta.env.VITE_DAF_API+"/refresh");
        console.log(response);

        if(!requestError){
            const {access} = response;     
            console.log(access);
            localStorage.setItem('token', newToken);
            return;
        }

    };

    return (
        <AUTHCONTEXT.Provider value={{
            isLoggedIn, setIsLoggedIn, userInfo, setUserInfo, setDefaultEntity, defaultEntity,
            allEntities, setAllEntities
        }}>
            {props.children}
        </AUTHCONTEXT.Provider>
    )
}

export default AuthProvider;