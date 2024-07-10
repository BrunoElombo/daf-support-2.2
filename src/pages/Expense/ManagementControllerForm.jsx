import React, { useState, useEffect, useRef } from 'react';
import { notification } from 'antd';
import useFetch from '../../hooks/useFetch';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function ManagementControllerForm({selected, onsubmit}) {

  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
    // States
  const [observation, setObservation] = useState("");
  const [isFavorable, setIsFavorable] = useState(true);
  const [requestIsLoading, setRequestIsLoading] = useState(false);

    // Hooks
    const  { fetchData, postData, requestError, requestLoading, updateData } = useFetch();

    // SideEffects

    // Handlers
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setRequestIsLoading(true)
        let url = `${import.meta.env.VITE_DAF_API}/expensesheet/validation_management_controller/${selected.id}/?entity_id=${entityId}`;
        let data={
          observation_comments_controller: observation,
          is_an_favorable_management_controller: isFavorable
        }
        try {
           const response = await updateData(url, data, true);
           console.log(response)
           if(requestError != ""){
            openNotification("ECHEC", "Echec de la validation", 3, <ExclamationTriangleIcon className="text-yellow-500 h-8 w-8"/>);
            return;
           }
           openNotification("SUCCESS", "Valider avec success", 2, <CheckCircleIcon className="text-green-500 h-8 w-8"/>);
           handleClearForm();
           onsubmit();
        } catch (error) {
          console.log(error.message);
          openNotification("ECHEC", "Une erreur est survenue", 5, <XCircleIcon className="text-red-500 h-8 w-8"/>);
        }finally{
          setRequestIsLoading(false)
        }
    }

    /**
     * Clear the validation form
     */
    const handleClearForm = async ()=>{
      setIsFavorable(true);
      setObservation("");
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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div className='flex flex-col'>
        <label htmlFor="" className='text-xs'>Dépense favorable :</label>
        <select className='w-full' value={isFavorable} onChange={e=>setIsFavorable(e.target.value)}>
          <option value={true}>Oui</option>
          <option value={false}>Non</option>
        </select>
      </div>
      <textarea name="" id="" placeholder='Observation' value={observation} onChange={e=>setObservation(e.target.value)}></textarea>
      <button className={`btn text-white ${requestIsLoading ? "bg-green-300 cursor-not-allowed" :"btn-primary"}`}>{requestIsLoading ?"Encours...":"Soumettre l'observation"}</button>
    </form>
  )
}

export default ManagementControllerForm