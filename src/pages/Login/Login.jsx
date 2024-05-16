import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/images/bg.jpg';
import useFetch from '../../hooks/useFetch'
import {AUTHCONTEXT} from '../../context/AuthProvider';

function Login() {

  const { setIsLoggedIn, setUserInfo } = useContext(AUTHCONTEXT);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [disbleLogin, setDisableLogin] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const {requestLoading, fetchData, postData, requestError} = useFetch();

    const handleGetUserInfo =async ()=>{
      try {
        let userData = await fetchData(import.meta.env.VITE_USER_API+"/users/account");
        console.log(userData);
        await localStorage.setItem("user", JSON.stringify(userData));
        await setUserInfo(userData);
        navigate("/entities");
        
      } catch (error) {
        alert("Failed to get user info");
        console.error(`Error: ${error.message}`);
      }
    }

    useEffect(()=>{
      localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
    }, []);

    useEffect(()=>{
      localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
    }, [rememberMe]);

    useEffect(()=>{
      if(!username || !password){
        setErrorMsg('Please enter a username and password');
        setDisableLogin(true);
      }else{
        setDisableLogin(false);
        setErrorMsg('');
      }
    }, [username, password])

    const handleLogin=async(e)=>{
      e.preventDefault();
      const data = {
        username: username,
        password: password
      }

      try {
        const response = await postData(import.meta.env.VITE_USER_API+"/api/token/", data, false);
        const {access, refresh} = await response;
        if(access && refresh){
          localStorage.setItem("token", access);
          handleGetUserInfo();
          return
        }
        setErrorMsg("Nom utilisateur ou mot de passe incorrect")
      } catch (error) {
        setErrorMsg("Echec d'authentification");
      }

        // navigate("/entities");
    }
  return (
    <div 
      className='w-full h-screen bg-gray-100 flex items-center justify-center backdrop-blur-sm bg-white/30'
    >
      <div className=' bg-white rounded-lg shadow-lg shadow-gray-400 max-h-[500px] h-[500px] max-w-[800px] w-[800px] flex '>
        <div 
          className='w-1/2 bg-green-500 flex items-center justify-center rounded-l-lg'
          style={{
            background: `url(${bgImg}) rgba(0,0,0,0.1)`,
            backgroundBlendMode: "overlay",
            backgroundRepeat: "no-repeat",
            backgroundPosition:"center center",
            backgroundSize: "cover",
          }}
        >
          
        </div>
        <div className='flex flex-col items-center justify-evenly w-1/2 py-8'>
          <div>
            <div className='space-y-2'>
              <h3 className='text-4xl bold'>DAF Support</h3>
              <p className='text-sm'>For a better management</p>
            </div>
          </div>
          <div>
          <form className='flex flex-col items-center justify-center space-y-6'>
            <input type="text" placeholder='Nom utilisateur ou Email' className='text-sm' value={username} onChange={e=>setUsername(e.target.value)}/>
            <input type="password" placeholder='Mot de passe' className='text-sm' value={password} onChange={e=>setPassword(e.target.value)}/>
            <p className="text-xs text-red-500">{errorMsg}</p>
            <div className='flex items-center space-x-2'>
              <input type="checkbox" name="" id="save_session" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}  />
              <label htmlFor="save_session" className='text-sm'>Me garder connecter</label>
            </div>
            <div className='w-full flex justify-end px-20'>
              <button 
                  onClick={handleLogin}
                  disabled={disbleLogin}
                  // className={`bg-green-500 cursor-pointer p-2 text-white rounded-lg shadow-sm shadow-green-600 text-sm`} 
                  className={`${disbleLogin || requestLoading?"bg-green-300 cursor-not-allowed":"bg-green-500 cursor-pointer"} p-2 text-white rounded-lg shadow-sm shadow-green-600 text-sm`} 
              >{requestLoading?"Connexion encours...":"Se connecter"}</button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login