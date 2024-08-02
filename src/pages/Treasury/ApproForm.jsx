import React, { useEffect, useState } from 'react'
import { notification } from 'antd';
import useFetch from '../../hooks/useFetch';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { v4 as uuid } from 'uuid'
import CurrencyCuts from '../../components/caisse/CurrencyCuts';

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
    const [cut, setCut] = useState("");
    const [qty, setQty] = useState(0);
    const [currency, setCurrency] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const [currencyCuts, setCurrencyCuts] = useState([]);
    const [cashDeskCuts, setCashDeskCuts] = useState([]);
    const [operations, setOperations] = useState([]);

    /**
     * Form fields states
     */
    const [site, setSite] = useState("");
    const [bank, setBank] = useState("");
    const [employee, setEmployee] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [cashDesk, setCashDesk] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [selectedBank, setSelectedBank] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedCashDesks, setSelectedCashDesks] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Side Effects
    useEffect(()=>{
        handleGetBank();
        handleGetCashDesk();
        handleGetSites();
        handleGetEmployees();
        handleGetCashDesks();
        handleGetCurrencies();
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


    /**
     * Detect cashdesk cuts
     */
    useEffect(()=>{
        let newAmount = cashDeskCuts.reduce((total, item)=>total + item?.total_amount, 0);
        setAmount(newAmount);
        setQty(0);      
    }, [cashDeskCuts]);

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
            const response = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity-banks");
            if(response.error) return response.error;
            setBanks(response);
            console.log(response);
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
        if(response.error) return response.error;
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
     * Handle get employees
     */
    const handleGetEmployees = async()=>{
        try {
          const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees/mandatory");
          if(benef.error) return benef.error;
          setEmployees(benef);
          setEmployee(benef[0]?.User.id);
        } catch (error) {
          console.log(error.message);
        }
    }

    /**
     * Handle get all sites
     */
    const handleGetSites=async()=>{
        try {
          let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
          if(response.error) return response.error;
          setSite(response[0]?.id);
          setSites(response);
        } catch (error) {
          console.error(error)
        }
    }


    const handleGetCashDesks= async ()=>{
        let url = import.meta.env.VITE_USER_API+"/cash-desk";
        try {
          const response = await fetchData(url);
          if(response.error) return response.error;
          setCashDesks(response);
          setCashDesk(response[0]?.id);
        } catch (error) {
          
        }
      }
    const handleGetCurrencies=async()=>{
        try {
          let response = await fetchData(import.meta.env.VITE_USER_API+"/currencies");
          if(response.error) return response.error;
          setCurrency(response[0]?.code);
          setCut(response[0]?.currencyCuts[0]?.value)
          setCurrencyCuts(response[0]?.currencyCuts)
          setCurrencies(response);
        } catch (error) {
          console.log(error)
        }
      }
    
      
      const handleClearCutsForm =()=>{
        setCut(currency?.currencyCuts[0]?.value);
        setQty(0);
      }
    
    const handleAddCashDeskCut= async (e) =>{
        e.preventDefault();
        if(cut && qty != 0){

            // New cut
            let newData = {
                "id": uuid(),
                "currency": currencies?.find(obj=>obj?.code == currency)?.code,
                "value": cut,
                "quantity": qty,
                "total_amount": +cut*+qty
            }

            // Update the cuts list
            let updatedValues = [newData, ...cashDeskCuts];
            setCashDeskCuts(updatedValues);
            
            // 
            let cutsTotal = updatedValues?.reduce((accumulator, item)=>{
                return accumulator + item?.total_amount;
            }, 0);

            // Set the total amount
            setAmount(cutsTotal);
            
            handleClearCutsForm();
        }else{
            // openNotification("Echec", "Choisir la coupure et la qté");
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();

        let url = `${import.meta.env.VITE_DAF_API}/cash_desk_movement/?entity_id=${entityId}`
        // let formatedCuts = cashDeskCuts.map(desk=> )
        let data = {
            bank_account: bankAccount,
            cash_register: cashDesk,
            // amount_brakdown: amount,
            description,
            bank_mandate: employee,
            amount: amount,
            currency : currency,
            cash_desk_movement_type: "CASH SUPPLY",
            site: site,
            denomination_cash_cut_cash_desk_movements: cashDeskCuts
        }
        try{
            const response = await postData(url, data, true);
            onSubmit();
        }
        catch(error) {
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
                        let actualBank = banks?.find(bank => bank?.bank?.id === e.target.value)?.bankAccounts;
                        console.log(actualBank);
                        setBankAccount("");
                        setSuggestions(actualBank || []);
                        setSelectedBank(e.target.value);
                    }}
                >
                    {
                        // bank?.length > 0 &&
                        banks.map(bank=><option value={bank?.bank?.id} key={bank?.bank?.id}>{bank?.bank?.name}</option>)
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
                            suggestions?.length > 0 &&
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
                    cashDesk?.length > 0 &&
                    cashDesks.map(desk=><option value={desk?.id} key={desk?.id}>{desk?.name}</option>)
                }
            </select>
        </div>

        {/* Choisir le mandataire */}
        <div className={`flex flex-col`}>
            <label htmlFor="" className="text-xs">Choisir le mandataire <span className='text-xs text-red-500'>*</span> :</label>
            <select className='capitalize' value={employee} onChange={e=>setEmployee(e.target.value)}>
                {
                    employees?.length > 0 &&
                    employees.map(benef=><option value={benef?.User.id} key={benef?.User.id}>{benef?.User.displayName}</option>)
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
                disabled={true}
                onChange={e=>{
                    if(!isNaN(e.target.value)){
                        setAmount(e.target.value);
                    }
                }}
            />
        </div>
        <div className=''>
            {/* Currency selection */}
            <div className='flex flex-col w-full'>
                <label htmlFor="" className='text-xs'>Choisir la monnaie</label>
                <select 
                className='w-full' 
                name="" 
                id="" 
                value={currency} 
                onChange={e=>{
                    setCurrency(e.target.value);
                    let selectedCurrency = currencies?.find(obj=>obj?.code == e.target.value);
                    setCurrencyCuts(selectedCurrency?.currencyCuts)
                }}
                >
                {
                    currencies?.length > 0 &&
                    currencies?.map(item=><option value={item?.code} key={item?.id}>{`${item?.name} (${item?.code})`}</option>)
                }
                </select>
            </div>
            {/* Cash desk cuts */}
            <div>
                <div className='flex flex-col md:flex-col w-full'>
                <div className='flex flex-col md:flex-row space-x-2 items-end'>
                    <div className='flex flex-col w-full md:w-1/4'>
                        <label htmlFor="" className='text-xs'>Coupure :</label>
                        <select value={cut} onChange={e=>setCut(e.target.value)}>
                            {
                                // currencyCuts?.map(cut=><option value={cut?.value}>{`${cut?.value}`}</option>)
                                currencyCuts?.length > 0 &&
                                currencyCuts?.map(cut=><option value={cut?.value}>{`${numberWithCommas(cut?.value)}`}</option>)
                            }
                        </select>
                    </div>
                    <div className='w-1/4'>
                        <input type="number" placeholder='Qté' className='w-full' value={qty} onChange={e=>{
                            if(e.target.value >= 0){
                                setQty(e.target.value);
                            }
                        }}/>
                    </div>
                    <div className='py-2 px-1 border-b-2 border-b-green-500 bg-gray-50 w-full md:w-1/5 md:max-w-1/2 overflow-x-auto'>
                    {
                        numberWithCommas(+cut * +qty)
                    }
                    </div>
                    <div className='space-x-2 w-1/4'>
                        <button className='btn bg-green-500 text-xs text-white shadow-md w-full' onClick={handleAddCashDeskCut}>Ajouter</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
        {/* <div className='flex justify-end'>
            {!requestLoading &&
                <button 
                    className='flex items-center btn btn-primary text-xs'
                    onClick={handleAddOperation}
                >
                    <PlusIcon className='w-4 h-4 text-white'/>
                    Ajouter
                </button>
            }
        </div> */}
        <div className='bg-gray-500 h-[1px]'></div>
            <CurrencyCuts 
                data={cashDeskCuts}
                setCashDeskCuts={setCashDeskCuts}
            />
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