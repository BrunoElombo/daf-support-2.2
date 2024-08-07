import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTHCONTEXT } from '../../context/AuthProvider';
import useFetch from '../../hooks/useFetch';
function UpdateUserForm() {
    const {userInfo, setIsLoggedIn, defaultEntity, setDefaultEntity, allEntities, setUserInfo, setAllEntities} = useContext(AUTHCONTEXT);
    const {updateData, requestLoading} = useFetch()
    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        setName(userInfo?.User?.name || "");
        setDisplayName(userInfo?.User?.displayName || "");
    }, []);

    const handleUpdateInfo=async(e)=>{
        e.preventDefault();
        let url = import.meta.env.VITE_USER_API+"/users/update/"+userInfo?.User?.id
        if(name == ""){
            alert("Nom utilisateur requis");
            return;
        }

        if(password != confPassword){
            alert("Les mots de passe ne corresponde pas")
            return
        }

        let data = {
            name, displayName
        }

        if(password){
            data.password = password
        }

        try {
            let response = await updateData(url, data, true);
            if(response.status === 200){
                localStorage.clear();
                setIsLoggedIn(false);
                navigate("/");
            }
        } catch (error) {
            alert("Echec de la modification");
            console.log(error)
        }
    }
  return (
    <form onSubmit={handleUpdateInfo} className='flex flex-col mx-2 space-y-2'>
        <input value={name} onChange={e=>setName(e.target.value)} type="text" className='text-sm' placeholder="Nom d'utilisateur"/>
        <input value={displayName} onChange={e=>setDisplayName(e.target.value)} type="text" className='text-sm' placeholder="Nom d'affichage"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className='text-sm' placeholder='Nouveau mot de passe'/>
        <input value={confPassword} onChange={e=>setConfPassword(e.target.value)} type="password" className='text-sm' placeholder='Confirmer le mot de passe'/>
        <button className={`${requestLoading ? "bg-green-300" :'btn-primary'} btn`}>{requestLoading ? "Encours...":"Changer le mot de passe"}</button>
    </form>
  )
}

export default UpdateUserForm