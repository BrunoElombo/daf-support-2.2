import React, { useEffect, useState } from 'react'
import { notification } from 'antd';
import useFetch from '../../hooks/useFetch';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { v4 as uuid } from 'uuid'

function ApproForm({onSubmit}) {
    let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
    let  CURRENCY = "XAF";
    // Hooks
     /**
      * Request hooks
      */
     const { fetchData, postData, requestError, requestLoading } = useFetch();

    // States
    const [typeApprove, setTypeAppro] = useState("");
    
    /**
     * Collection states
     */
    const [sites, setSites] = useState([]);
    const [displaySuggestions, setDisplaySuggestions] = useState(false);
    const [banks, setBanks] = useState([]);
    const [cashDesks, setCashDesks] = useState([]);
    const [operations, setOperations] = useState([]);

    /**
     * Form fields states
     */
    const [site, setSite] = useState("");
    const [bank, setBank] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [cashDesk, setCashDesk] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [selectedBank, setSelectedBank] = useState([]);
    const [selectedCashDesks, setSelectedCashDesks] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Side Effects
    useEffect(()=>{
        handleGetBank();
        handleGetCashDesk();
        handleGetSites();
    }, []);

    useEffect(()=>{
        let currentBank = banks.find(bank => bank?.bank?.id === selectedBank);
        if(currentBank?.bankAccounts){
            setAccounts(currentBank?.bankAccounts);
            return;
        }
        setDisplaySuggestions(false);
    }, [selectedBank]);

    useEffect(()=>{
        if(bankAccount === ""){
            setDisplaySuggestions(false);
            setSuggestions([]);
            return;
        }

        let corresponding = accounts.filter(account => account?.account_number?.toLowerCase()?.includes(bankAccount?.toLowerCase()));
        if(corresponding?.length > 0){
            setSuggestions(corresponding);
            // setDisplaySuggestions(true);
            return;
        }
        setSuggestions([]);
        setDisplaySuggestions(false);
    }, [bankAccount]);


    // Methods
    /**
     * Notifications
     */
    const openNotification = (title, message, duration) => {
        notification
        .open({
          message: title,
          description: message,
          duration: duration || 1,
        })
    };

    /**
     * Commas to numbers
     */
    const numberWithCommas=(x)=>{
        return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
    }

    // Handlers
    /**
     * Get all banks
     */
    const handleGetBank= async()=>{
        try {
            const response = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity_banks");
            setBanks(response);
            setSelectedBank(response[0]?.bank?.id);
            setAccounts(response[0]?.bankAccounts);
            // setSuggestions(response[0]?.bankAccounts);
        } catch (error) {
            console.error("Get banks:", error);
        }
    }

    /**
     * Get all the cash desk
     */
    const handleGetCashDesk= async()=>{
        const response = await fetchData(import.meta.env.VITE_USER_API+"/cash-desk");
        if(!requestError){
            setCashDesks(response);
            setCashDesk(response[0]?.id);
        }
    }

    /**
     * Handle operations validation
     */
    const operationFormIsValide=()=>{
        if(
            selectedBank.length < 1||
            bankAccount.length < 1 ||
            amount.length < 1 ||
            cashDesk.length < 1
        )return false
        return true;
    }
    /**
     * Handle clear operation Form
     */
    const handleClearOperationForm=()=>{
        setBankAccount("")
        setSelectedBank(banks[0]?.bank?.id);
        setCashDesk(cashDesks[0]?.id);
        setAmount("");
    }

    /**
     * Handle add operation
     */
    const handleAddOperation=(e)=>{
        e.preventDefault();
        let formIsValide = operationFormIsValide();
        if(formIsValide){
            let bank = banks.find(bank => bank?.bank?.id === selectedBank);
            let desk = cashDesks.find(desk => desk.id === cashDesk);
    
            let data = {
                id: uuid(),
                bank: bank?.bank?.Acronyme,
                bank_account: bankAccount,
                cash_desk: desk?.name,
                amount: amount
            }
    
            let newList = [data, ...operations];
            setOperations(newList);
            handleClearOperationForm();
            return true;
        }
        openNotification("ECHEC", "Remplire les champs requis(*)", 5);
    }

    /**
     * Delete an operation
     */
    const handleDeleteOperation=(id)=>{
        let updatedOperations = operations?.filter(operation=>operation.id != id);
        setOperations(updatedOperations);

    }


    /**
     * Handle get all sites
     */
    const handleGetSites=async()=>{
        try {
          let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
          setSite(response[0]?.id);
          setSites(response);
        } catch (error) {
          console.error(error)
        }
      }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        let cashDeskList = [];
        let bankList = [];
        let amountBreackDown = [];
        let totalAmount = operations.reduce((total, operation)=>{
            let amount = +(operation.amount);
            return total + amount
        }, 0);

        operations.forEach(operation=>{
            let cashDeskId = cashDesks.find(desk=> desk.name === operation.cash_desk)?.id;
            cashDeskList.push(cashDeskId);
            
            let bankId = banks.find(desk=> desk.bank.Acronyme === operation.bank)?.bank?.id;
            bankList.push(bankId);

            amountBreackDown.push(operation.amount);

        })

        let url = `${import.meta.env.VITE_DAF_API}/cash_desk_movement/?entity_id=${entityId}`
        let data = {
            bank_account_listing: bankList,
            cash_registers_listing: cashDeskList,
            amount_brakdown: amountBreackDown,
            description,
            total_amount: totalAmount,
            currency : CURRENCY,
            cash_desk_movement_type: "CASH SUPPLY",
            site: site
        }

        console.log(data);

        try{
            const response = await postData(url, data, true);
            console.log(response);
            onSubmit();
        }
        catch(error) {
            console.log(error)
            openNotification("ECHEC", "Echec de creation de l'appro.")
        }
    }
    
  return (
    <form className='flex flex-col space-y-3' onSubmit={handleSubmit}>
        {/* Choisir le site de l'employee */}
        <div className='w-full flex flex-col'>
            <label htmlFor="" className="text-xs">Site<span className='text-xs text-red-500'>*</span> :</label>
            <select>
                {
                    sites?.map(site=><option value={site?.id} key={site?.id}>{site?.name}</option>)
                }
            </select>
        </div>
        {/* Choisir la bank et le compte */}
        <div className='flex flex-col md:flex-row space-x-2 items-end'>
            <div className='w-1/2 flex flex-col'>
                <label htmlFor="" className='text-xs'>Choisir la bank<span className='text-xs text-red-500'>*</span> :</label>
                <select 
                    className='text-sm' 
                    value={selectedBank} 
                    onChange={e=>{
                        setBankAccount("");
                        setSuggestions([]);
                        setSelectedBank(e.target.value);
                    }}
                >
                    {
                        banks.map(bank=><option value={bank?.bank?.id} key={bank?.bank?.id}>{bank?.bank?.Acronyme}</option>)
                    }
                </select>
            </div>
            <div className='w-full md:w-1/2 relative'>
                <input 
                    type="text" 
                    className='text-sm w-full'
                    placeholder='Choisir le compte *' 
                    value={bankAccount} 
                    onChange={e=>{
                        setBankAccount(e.target.value)
                    }}
                />
                {
                 suggestions.length > 0 &&
                    <ul className='absolute w-full bg-white shadow-sm rounded-b-sm p-2'>
                        {
                            suggestions.map(suggestion =>
                                <li 
                                    className='text-xs text-gray-500 cursor-pointer'
                                    onClick={()=>{
                                        setBankAccount(suggestion?.account_number)
                                        setSuggestions([]);
                                    }}
                                >
                                    {suggestion?.account_number}
                                </li>
                            )
                        }
                    </ul>
                }
            </div>
        </div>

        {/* Choisir la caisse */}
        <div className='flex flex-col'>
            <label htmlFor="" className='text-xs'>Choisir la caisse<span className='text-xs text-red-500'>*</span> :</label>
            <select value={cashDesk} onChange={e=>setCashDesk(e.target.value)}>
                {
                    cashDesks.map(desk=><option value={desk?.id} key={desk?.id}>{desk?.name}</option>)
                }
            </select>
        </div>

        {/* Choisir le montant */}
        <div className='flex'>
            <input 
                type="text" 
                className='text-sm w-full' 
                placeholder='Montant *'
                value={amount}
                onChange={e=>{
                    if(!isNaN(e.target.value)){
                        setAmount(e.target.value);
                    }
                }}
            />
        </div>

        <div className='flex justify-end'>
            {!requestLoading &&
                <button 
                    className='flex items-center btn btn-primary text-xs'
                    onClick={handleAddOperation}
                >
                    <PlusIcon className='w-4 h-4 text-white'/>
                    Ajouter
                </button>
            }
        </div>
        <div className='bg-gray-500 h-[1px]'></div>
        <div className='w-full h-[50px] max-h-[100px] flex flex-col space-y-3 overflow-y-scroll p-2'>
            {
                operations.length > 0 ?
                operations.map(operation => 
                    <div className='flex justify-evenly items-center p-2 rounded-lg shadow-sm border-b-[1px]'>
                        <span className='text-xs italic w-1/4 max-w-1/4'>{operation.bank}</span>
                        <span className='text-xs italic w-1/4 max-w-1/4'>{operation.bank_account}</span>
                        <span className='text-xs italic w-1/4 max-w-1/4'>{numberWithCommas(operation.amount)} XAF</span>
                        <span className='text-xs italic w-1/4 max-w-1/4'>{operation.cash_desk}</span>
                        <button className='hover:bg-gray-200 rounded-lg p-2' onClick={()=>handleDeleteOperation(operation.id)}>
                            <TrashIcon className='w-3 h-3 text-red-500'/>
                        </button>
                    </div>
                ):
                <div className='flex justify-center items-center'>
                    <span className='text-xs italic'>Aucune operation</span>
                </div>
            }
        </div>
        <div className='bg-gray-500 h-[1px]'></div>
        <textarea className="" placeholder='Description' value={description} onChange={e=>setDescription(e.target.value)}></textarea>
        <div className='flex justify-end'>
            <button className={`${requestLoading?"bg-green-300":"bg-green-500"} flex items-center btn text-white text-sm`} disabled={requestLoading}>
                <PlusIcon /> {requestLoading?"En cours...":"Approvisioner"}
            </button>
        </div>
    </form>
  )
}

export default ApproForm