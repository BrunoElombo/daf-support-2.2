import React, { useState, useEffect, useRef } from 'react';
import { notification } from 'antd';
import useFetch from '../../hooks/useFetch';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function ManagementControllerForm({selected}) {

    // States
  const [] = useState("");
  const [] = useState("");

    // Hooks
    const  { fetchData, postData, requestError, requestLoading } = useFetch();

    // SideEffects

    // Handlers
    const handleSubmit=async(e)=>{
        e.preventDefault();
        let url = `${ïmport.meta.env.VITE_DAF_API}/`;
        let data={}
        try {
           const response = await postData(url, data, true);
           if(requestError != ""){
            openNotification("ECHEC", "Echec de la validation", 3, <ExclamationTriangleIcon className="text-yellow-500 h-8 w-8"/>);
            return;
           }
           openNotification("SUCCESS", "Valider avec success", 2, <CheckCircleIcon className="text-green-500 h-8 w-8"/>);
        } catch (error) {
          console.log(error.message);
          openNotification("ECHEC", "Une erreur est survenue", 5, <XCircleIcon className="text-red-500 h-8 w-8"/>);
        }
    }

    // Methods
    const openNotification = (title, message, duration, icon) => {
      notification.open({
        icon: icon,
        message: title,
        description: message,
        duration: duration || 1,
      });
    }

  return (
    <form onChange={handleSubmit} className="flex flex-col">
      <textarea name="" id="" placeholder='Observation'></textarea>
      <button>Soumettre l'observation</button>
    </form>
  )
}

export default ManagementControllerForm