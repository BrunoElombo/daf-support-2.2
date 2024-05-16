import React, {useEffect, useState, useContext} from 'react'
import logo from '../../assets/images/bfc.png'
import LoadingDots from '../../components/LoadingDots'
import EntityCard from '../../components/EntityCard';
import {NoSymbolIcon} from '@heroicons/react/24/outline'
import { AUTHCONTEXT } from '../../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

function Entity() {
    const { setIsLoggedIn, userInfo, setDefaultEntity, isLoggedIn, setAllEntities} = useContext(AUTHCONTEXT);
    const [isLoading, setIsLoading] = useState(true);
    const [entities, setEntities] = useState([]);
    const {requestLoading, fetchData, postData, requestError} = useFetch();
    const navigate = useNavigate();

    const handleFetchEntites=async ()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/entities");
        console.log(response);
        if(!requestError) {
            if((response?.entities) === undefined) {
                setEntities(response);
                localStorage.setItem("entities", JSON.stringify(response));
                setAllEntities(response);
                return;
            }
            let ent = response?.entities;
            setDefaultEntity(ent[0]);
            localStorage.setItem("entity", JSON.stringify(ent[0]));
            localStorage.setItem("entities", JSON.stringify(ent));
            setAllEntities(ent)
            setIsLoggedIn(true);
            navigate("/");
            return
        }else{

        }
    }

    const handleLogout = ()=>{
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
    };

    const handleSelectedEntity=(id)=>{
        const defaultEntity = entities.find(entity=>entity.id === id);
        setDefaultEntity(defaultEntity);
        localStorage.setItem("entity", JSON.stringify(defaultEntity));
        setIsLoggedIn(true);
        navigate("/");
    }

    useEffect(()=>{
        // setTimeout(()=>{
        //     setIsLoading(false);
        // }, 3000);
        handleFetchEntites();
    }, []);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
        {   requestLoading ?
            <div className='flex flex-col space-y-5'>
                <h3 className='text-5xl'>Welcome, <span className='text-green-600'>{userInfo?.username}</span></h3>
                <div>
                    <LoadingDots />
                </div>
            </div>:
            <div>
                <div className='text-center'>
                    <h3 className='text-3xl'>Choisir une entité</h3>
                </div>
                <div className='flex flex-wrap p-4 space-y-3 justify-center'>
                    {
                        entities?.length > 0?
                            entities.map(entity=><EntityCard key={entity.id} logo={entity.logo} name={entity.acronym} tagline={entity.name} onClick={()=>handleSelectedEntity(entity.id)}/>)
                        :
                        <div className='flex flex-col items-center justify-center w-full'>
                            <NoSymbolIcon />
                            <p className='text-center'>Aucune entité trouvée</p>
                        </div>
                    }
                    
                </div>
                <div className='text-center mt-8'>
                    <button className='text-sm text-green-600 underline' onClick={handleLogout}>page de connexion</button>
                </div>
            </div>
        }
    </div>
  )
}

export default Entity