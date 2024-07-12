import React, { useState } from 'react'

function RecipeDetail({data}) {

    // Variables

    // States
    const [isInUpdate, setIsInUpdate] = useState(false);

    /**
     * Form States
     */
    const  [recipeType, setRecipeType] = useState(data.recipe_type);
    const  [department, setDepartment] = useState(data.department);
    const  [controller, setController] = useState(data.employee_controller);
    const  [totalAmount, setTotalAmount] = useState(data.total_amount);
    const  [provenance, setProvenance] = useState(data.provenance);
    const  [description, setDescription] = useState(data.description);
    const  [shift, setShift] = useState(data.shift);
    const  [fileNumber, setFileNumber] = useState(data.file_number);
    const  [corporateName, setCorporateName] = useState(data.corporate_name);
    const  [recordIdModule, setRecordIdModule] = useState(data.record_id_module);
    const  [UINClient, setUINClient] = useState(data.uin_client);
    const  [transactionNumber, setTransactionNumber] = useState(data.transaction_number);
    const  [cashDeskNumber, setCashDeskNumber] = useState(data.cash_desk_number);
    const  [bankAccountNumber, setBankAccountNumber] = useState(data.bank_account_number);
    const  [paymentMethod, setPaymentMethod] = useState(data.payment_method);
    const  [site, setSite] = useState(data.site);
    const  [entity, setEntity] = useState(data.entity);
    // Hooks

    // Hanlders
    /**
     * @param {}
     */
    const handleSubmitUpdate= async () =>{

    }
    
    const HandleClearForm = async () =>{

    }

    // Methods
  return (
    <form className='flex flex-col space-y-2' onSubmit={handleSubmitUpdate}>
        <div className='flex items-center space-y-2 md:space-y-0 md:space-x-2 w-full '>
            {/* Date initiation */}
            <div className=''>
                <label htmlFor="" className='text-xs'>Date initiation :</label>
                <input type="text" value={data?.time_created?.split("T")[0]} disabled={true} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300'/>
            </div>
            <div className=''>
                <label htmlFor="" className='text-xs'>Numéro de référence :</label>
                <input type="text" value={data?.reference_number} disabled={true} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300'/>
            </div>
        </div>

        {/* Controlleur */}
        <div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Controlleur :</label>
                <select type="text" disabled={true} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300 w-full'>
                    <option value=""></option>
                </select>
            </div>
        </div>
        
        {/* Total Amount */}
        <div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Montant total :</label>
                <input type="text" disabled={true} value={totalAmount} onChange={e=>setTotalAmount(e.target.value)} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300 w-full' />
            </div>
        </div>

        <div className='flex items-center space-y-2 md:space-y-0 md:space-x-2 w-full'>
            {/* Date initiation */}
            <div className='flex flex-col w-full md:w-1/2'>
                <label htmlFor="" className='text-xs'>Entité :</label>
                <select type="text" value={data?.time_created?.split("T")[0]} disabled={true} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300'>
                </select>
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
                <label htmlFor="" className='text-xs'>Site :</label>
                <select type="text" value={site} disabled={true} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300'>

                </select>
            </div>
        </div>


        {/* Provenance */}
        <div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Provenance :</label>
                <select type="text" disabled={true} value={provenance} onChange={e=>setProvenance(e.target.value)} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300 w-full'>
                </select>
            </div>
        </div>

        {/* Shift */}
        <div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Shift :</label>
                <select type="text" disabled={true} value={shift} className='bg-gray-200 rounded-lg cursor-not-allowed border-[1px] border-gray-300 w-full'>
                    <option value="6h-15h">6h-15h</option>
                    <option value="15h-22h">15h-22h</option>
                    <option value="22h-6h">22h-6h</option>
                </select>
            </div>
        </div>
    </form>
  )
}

export default RecipeDetail