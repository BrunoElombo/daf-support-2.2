import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch';

function ValidationRecette({
    onSubmit, recipeId
}) {
    const ENTITY_ID = JSON.parse(localStorage.getItem('entity'))?.entity.id;
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
            onSubmit();
            
        } catch (error) {
            
        }
    }
  return (
    <form className='flex flex-col w-full space-y-3' onSubmit={handleSubmitValidation}>
        <textarea name="" id="" placeholder='Observation' value={observation} onChange={e=>setObservation(e.target.value)}></textarea>
        <button className='btn bg-green-500 text-white'>
            Valider
        </button>
    </form>
  )
}

export default ValidationRecette