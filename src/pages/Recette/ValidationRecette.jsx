import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch';
import Popup from '../../components/Popup/Popup';
import { notification } from 'antd';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

function ValidationRecette({
    onSubmit, recipeId
}) {
    const [confirmModalText, setConfirmModalText] = useState("");
    const [confirmModalIcon, setConfirmModalIcon] = useState(undefined);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const handleOpenModal=(confirmModalText, confirmModalIcon)=>{

        setOpenConfirmModal(true);
        setConfirmModalIcon(confirmModalIcon);
        setConfirmModalText(confirmModalText);

        setTimeout(()=>{
          setOpenConfirmModal(false);
        }, 5000);

    }

    const openNotification = (title, message) => {
        notification.open({
          message: title,
          description: message,
          duration: 1
        });
      };

    const ENTITY_ID = JSON.parse(localStorage.getItem('user'))?.entity.id;
    const {requestError, requestLoading, fetchData, postData, updateData} = useFetch();
    const [observation, setObservation] = useState("");
    const handleSubmitValidation= async (evt)=>{
        evt.preventDefault();
        try {
            console.log(ENTITY_ID)
            const url = import.meta.env.VITE_DAF_API+"/recipesheet/"+recipeId+"/?entity_id="+ENTITY_ID;
            const data = {
                "description": observation,
                "it_is_a_cash_desk_movement": false
            };

            const response = await updateData(url, data, true)
            // handleOpenModal("Validé avec success",(<CheckCircleIcon className='text-green-500 h-8 w-8'/>))
            openNotification("SUCCESS", "Validé avec success");
            onSubmit();
            
        } catch (error) {
            // handleOpenModal("Echec de validation",(<XMarkIcon className='text-red-500 h-8 w-8'/>))
            openNotification("ECHEC", "Echec de validation");
            console.error(error);
        }finally{
          setObservation("");
        }
    }
  return (
    <>
        <form className='flex flex-col w-full space-y-3' onSubmit={handleSubmitValidation}>
            <textarea name="" id="" placeholder='Observation' value={observation} onChange={e=>setObservation(e.target.value)}></textarea>
            <button className={`${requestLoading? 'bg-green-300' :'bg-green-500'} btn text-white`}>
                {requestLoading ? "En cours de validation" :"Valider"}
            </button>
        </form>
        <Popup message={confirmModalText} icons={confirmModalIcon} isOpen={openConfirmModal}/>
    </>
  )
}

export default ValidationRecette