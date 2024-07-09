import React, {useState, useEffect, useRef} from 'react';
import useFetch from '../../hooks/useFetch';
import { notification } from 'antd';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';



function MandatoryForm({onSubmit, onCancel, onClose, selected}) {

  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
  // Functions
  const openNotification = ( title, message, duration, icon ) => {
    notification.open({
      icon:icon,
      message: title,
      description: message,
      duration: duration || 1,
    });
  }
  // Hooks
  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();
  
  //States
  const [observation, setObservation] = useState("");
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  
  // Side effects
  useEffect(()=>{
  
  }, []);
  
  // Handlers
  const handleSubmit=async (e)=>{
      e.preventDefault();
      setSubmitIsLoading(true);
      let id = selected.id;
      let url = `${import.meta.env.VITE_DAF_API}/cash_desk_movement/${id}/?entity_id=${entityId}`;
      let data ={
        body: observation
      }

      try {
        const response = await updateData(url, data, true);
        console.log(response);
        if(requestError != ""){
          openNotification("ECHEC", "Echec lors de la soumission", 3, <ExclamationTriangleIcon className="text-yellow-500 h-8 w-8"/>)
          return;
        }
        openNotification("SUCCESS", "Valider avec success", 2, <CheckCircleIcon className="text-green-500 h-8 w-8"/>)
        setObservation("");
        onSubmit();
      } catch (error) {
        openNotification("ECHEC", "Une erreur est survenu", 5, <XCircleIcon className="text-red-500 h-8 w-8"/>)
      }finally{
        setSubmitIsLoading(false);
      }
  }

  return (
    <div>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-2'>
            <textarea value={observation} onChange={e=>setObservation(e.target.value)} placeholder='Votre observation' className=''></textarea>
            <button className={`${requestLoading ?"bg-green-300":"bg-green-500"} btn text-white rounded-lg`}>{requestLoading ? "En cours..." : "Soumettre l'observation"}</button>
        </form>
    </div>
  )
}

export default MandatoryForm;