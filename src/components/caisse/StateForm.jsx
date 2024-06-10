import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch';
import { notification } from 'antd';
import CurrencyCuts from './CurrencyCuts';
import { v4 as uuid } from 'uuid'


function StateForm({onSubmit}) {

  // States
  const {fetchData, postData, requestError, requestLoading} = useFetch();
  const [cashDesks, setCashDesks] = useState([]);
  const [sites, setSites] = useState([]);
  const [entitySites, setEntitySites] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [currencyCuts, setCurrencyCuts] = useState([]);

  const [cashDeskId, setCashDeskId] = useState("");
  const [currency, setCurrency] = useState("");
  const [totalAmount, setTotalAmount] =useState(0);
  const [cashDeskState, setCashDeskState] = useState("OPENING");
  const [description, setDescription] = useState("");
  const [site, setSite] = useState("");
  const [shift, setShift] = useState("6h-15h");
  const [cashDeskCuts, setCashDeskCuts] = useState([]);
  const [cut, setCut] = useState("");
  const [qty, setQty] = useState(0);
  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

  // Methods
  const openNotification = (title, message, icon) => {
    notification.open({
      message: title,
      description: message,
      icon: icon
    });
  };

  function sumMontants(objects) {
    // Initialize a variable to store the sum
    let total = 0;

    console.log(objects)
    // Loop through each object in the list
    for (const obj of objects) {
      // Check if the object has a `montant` attribute
      if (obj.hasOwnProperty('total_amount')) {
        // Get the value of the `montant` attribute
        const montant = obj.total_amount;

        // Ensure montant is a number before adding
        if (typeof montant === 'number') {
          total += montant;
        } else {
          console.warn("Skipping object with non-numeric 'montant' attribute");
        }
      }
    }

    // Return the calculated sum
    return total;
  }

  const handleGetCashDesks= async ()=>{
    let url = import.meta.env.VITE_USER_API+"/cash-desk";
    try {
      const response = await fetchData(url);
      setCashDesks(response);
      setCashDeskId(response[0]?.id)
    } catch (error) {
      
    }
  }

  const handleGetEntitySite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
    if(!requestError){
      setEntitySites(response);
    }
  }

  const handleGetSites=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
    if(!requestError){
      setSite(response[0]?.id);
      setSites(response);
    }
  }
  
  const handleGetCurrencies=async()=>{
    try {
      let response = await fetchData(import.meta.env.VITE_USER_API+"/currencies");
      if(!requestError){
        setCurrency(response[0]?.id);
        setCurrencyCuts(response[0]?.currencyCuts)
        setCurrencies(response);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddCashDeskCut= async (e) =>{
    e.preventDefault();
    if(cut && qty != 0){
      let newData = {
          "id": uuid(),
          "currency": currencies?.find(obj=>obj?.id == currency)?.code,
          "value": cut,
          "quantity": qty,
          "total_amount": +cut*+qty
      }
      setCashDeskCuts([newData, ...cashDeskCuts]);
      handleClearCutsForm();
    }else{
      openNotification("Echec", "Choisir la coupure et la qté")
    }
  }

  const handleClearCutsForm =()=>{
    // setCut(currency?.currencyCuts[0]?.value);
    setQty(0);
  }

  const handleClearCaisseForm=()=>{
    setCashDeskId("")
    setCurrency("")
    setTotalAmount(0)
    setCashDeskState("OPENING")
    setDescription("")
    setSite("")
    setCashDeskCuts([])
    setQty(0)
  }

  const handleSubmitForm =async (e)=>{
    e.preventDefault();
    try {
      let url = import.meta.env.VITE_DAF_API+"/cash_desk_state/?entity_id="+entityId;
      const data ={
        "cash_register": cashDeskId,
        "currency": currency,
        "total_amount": totalAmount,
        "current_step_cash_state":cashDeskState,
        "description": description,
        "site": site,
        "shift":shift,
        "entity":entityId,
        "denomination_cash_cuts" : cashDeskCuts
      }

      if(!requestError){
        const response = await postData(url, data, true);
        onSubmit();
        openNotification("SUCCESS", "Enregistrement réussi");
        handleClearCaisseForm();
        handleClearCutsForm();
        return;
      }
      openNotification("ECHEC", "Echec d'enregistrement");
    } catch (error) {
      console.log(error);
      openNotification("ECHEC", "Une erreur est survenue");
    }
  }
  const numberWithCommas=(x)=>{
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }
  // UseEffects
  useEffect(()=>{
    handleGetCashDesks();
    handleGetEntitySite();
    handleGetSites();
    handleGetCurrencies();
  }, [])

  useEffect(()=>{
    const selectedCurrency = currencies.find(obj => obj?.id === currency);
    console.log(selectedCurrency)
    setCurrencyCuts(selectedCurrency?.currencyCuts);
    setCut(selectedCurrency?.currencyCuts[0]?.value);
  }, [currency]);
  
  return (
    <div>
      <form onSubmit={handleSubmitForm}>
        {/* Cash desk selection */}
        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-xs'>Choisir la caisse</label>
          <select className='w-full' name="" id="" value={cashDeskId} onChange={e=>setCashDeskId(e.target.value)}>
            {
              cashDesks?.map(cashDesk=><option value={cashDesk?.id}>{cashDesk?.name}</option>)
            }
          </select>
        </div>

        {/* Cashdesk state */}
        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-xs'>Choisir l'état de la caisse</label>
          <select className='w-full' name="" id="" value={cashDeskState} onChange={e=>setCashDeskState(e.target.value)}>
            <option value="OPENING">Ouverture</option>
            <option value="CLOSING">Fermeture</option>
          </select>
        </div>

        {/* Currency selection */}
        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-xs'>Choisir la monnaie</label>
          <select className='w-full' name="" id="" value={currency} onChange={e=>{
            setCurrency(e.target.value)
          }}>
            {
              currencies?.map(item=><option value={item?.code} key={item?.id}>{`${item?.name} (${item?.code})`}</option>)
            }
          </select>
        </div>
        
        {/* Total Amount */}
        <div className='w-full my-2'>
          <input type="number" placeholder='Montant total' className='w-full' value={totalAmount} onChange={e=>setTotalAmount(e.target.value)}/>
        </div>
        {/* Site */}
        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-xs'>Choisir le site</label>
          <select className='w-full' name="" id="" value={site} onChange={e=>setSite(e.target.value)}>
            {
              sites?.map(site =><option value={site.id} key={site.id}>{site.name}</option>)
            }
          </select>
        </div>

        {/* Shift */}
        <div className='flex flex-col'>
            <label htmlFor="" className='text-xs'>Choisir le shift</label>
            <select name="" id="" value={shift} onChange={e=>setShift(e.target.value)}>
                <option value="6h-15h">6h-15h</option>
                <option value="15h-22h">15h-22h</option>
                <option value="22h-6h">22h-6h</option>
            </select>
        </div>

        {/* Description */}
        <div className='w-full'>
          <textarea name="" id="" placeholder='Description' className='w-full mt-2' value={description} onChange={e=>setDescription(e.target.value)}></textarea>
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
                          currencyCuts?.map(cut=><option value={cut?.value}>{`${numberWithCommas(cut?.value)}`}</option>)
                      }
                  </select>
              </div>
              <div className='w-1/4'>
                  <input type="number" placeholder='Qté' className='w-full' value={qty} onChange={e=>setQty(e.target.value)}/>
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
          <CurrencyCuts 
            data={cashDeskCuts}
            setCashDeskCuts={setCashDeskCuts}
            // currencyCuts={currencyCuts}
            // currencies={currencies}
          />
        </div>
        <div className='flex justify-between '>
          <p><b className='text-black p-1 rounded-lg bg-yellow-500'>{numberWithCommas(sumMontants(cashDeskCuts))} XAF</b></p>
          <button className={`${requestLoading? "bg-green-300 ": "bg-green-500 "} btn shadow-lg text-white text-sm`} >{requestLoading?"En cours...":"Enregistrement"}</button>
        </div>
      </form>
    </div>
  )
}

export default StateForm