import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch';
import { TrashIcon } from '@heroicons/react/24/outline';

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
        <div className='flex flex-col w-full p-1 space-y-2 overflow-y-auto max-h-[100px]'>
        {
            data?.map(item=><div className='flex justify-between p-2 rounded-lg bg-white shadow-md'>
                <p className='text-xs text-black'>{item.currency}</p>
                <p className='text-xs text-black'>{numberWithCommas(item.value)}</p>
                <p className='text-xs text-black'>{item.quantity}</p>
                <p className='text-xs text-black'>{numberWithCommas(item.total_amount)}</p>
                <button className='text-red-500 p-1 hover:bg-gray-100 rounded-lg' onClick={(e)=>handleRemoveCuts(e, item?.id)}>
                    <TrashIcon className='w-3'/>
                </button>
            </div>)
        }
        </div>
    </div>
  )
}

export default CurrencyCuts