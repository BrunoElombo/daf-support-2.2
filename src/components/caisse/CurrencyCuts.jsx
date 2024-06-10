import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch';

function CurrencyCuts({data, setCashDeskCuts}) {

    // Hooks
    const {fetchData, postData, updateData, requestError, requestLoading} = useFetch()

    // States


    // Methods
    const numberWithCommas=(x)=>{
        return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
    }

    const handleRemoveCuts= async (e, id) =>{
        e.preventDefault();
        const selectedCut = data.filter(item => item.id != id);
        setCashDeskCuts([...selectedCut])

    }

    // Events triggers
    useEffect(()=>{
    }, []);

  return (
    <div>
        <div className='flex flex-col w-full p-2 space-y-2 overflow-y-auto h-[100px]'>
        {
            data?.map(item=><div className='flex justify-between p-2 rounded-lg bg-white shadow-md'>
                <p>{item.currency}</p>
                <p>{numberWithCommas(item.value)}</p>
                <p>{item.quantity}</p>
                <p>{numberWithCommas(item.total_amount)}</p>
                <button className='text-red-500' onClick={(e)=>handleRemoveCuts(e, item?.id)}>remove</button>
            </div>)
        }
        </div>
    </div>
  )
}

export default CurrencyCuts