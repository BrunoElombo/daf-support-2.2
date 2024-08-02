import React, { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch';
import $ from 'jquery';


function SupplyFilter({setSupplyData}) {
    // Hooks
    const { requestError, requestLoading, fetchData, postData, updateData } = useFetch();
    const entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

    // State

    /**
     * Global states
     */
    const [desks, setDesks] = useState([]);
    const [mandatories, setMandatories] = useState([]);
    const [entities, setEntities] = useState([]);
    const [sites, setSites] = useState([]);
    const [amountGreaterThan, setAmountGreaterThan] = useState("")
    const [amountLessThan, setAmountLessThan] = useState("")
    const [amountRange, setAmountRange] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Form states
     */
    const [desk, setDesk] = useState("");
    const [mandatory, setMandatory] = useState("");
    const [entity, setEntity] = useState("");
    const [site, setSite] = useState("");
    const [amount, setAmount] = useState("");
    const [comparator, setComparator] = useState("");

    // Props

    // SideEffects
    useEffect(()=>{
        handleGetSite();
        handleGetCashDesks();
        handleGetMandatories();
        handleGetEntities();
    }, []);

    // Handlers
    const handleSubmitFilter = async(e)=>{
        e.preventDefault();
        try {
            setIsLoading(true);
            let url = `${import.meta.env.VITE_DAF_API}/cash_desk_movement/multi_criteria_search/?entity_id=${entityId}`;
            let data = {
                "grt_total_amount":amountGreaterThan,
                "lst_total_amount":amountLessThan,
                "cash_register":desk,
                "bank_mandate":mandatory,
                "amount":amount,
                "site":site,
                "entity_id":entityId
            };
            $.ajax({
                method: "GET",
                url: url,
                data: data,
                headers: {
                    'Authorization':'Bearer '+localStorage.getItem('token')
                },
                contentType: "application/json",
              })
            .done(function( data ) {
                const formatedData = data?.map(obj => {
                    return { ...obj, key: obj.id };
                  });
                  setSupplyData(data);
                setIsLoading(false);
            });

        } catch (error) {
            console.log("Error :", error);
            setIsLoading(false);
        }
    }
    /**
     * Get the sites
     */
    const handleGetSite=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
        if(response.error) return response.error;
        setSites(response);
    }

    /**
     * Get all the cash desk
     * @param null
     * @return {null}
    */
    const handleGetCashDesks= async()=>{
        const response = await fetchData(import.meta.env.VITE_USER_API+"/cash-desk");
        if(response.error) return response.error;
        setDesks(response);
        // setCashDesk(response[0]?.id);
      }

    /**
     * Get all mandatories
     */
    const handleGetMandatories = async()=>{
        try {
          const employees = await fetchData(import.meta.env.VITE_USER_API+"/employees/mandatory");
          if(employees.error) return employees.error;
          setMandatories(employees);
        } catch (error) {
          console.log(error.message);
        }
    }
    
    /**
     * Get the entities
     */
    const handleGetEntities=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/entities");
        if(response.error) return response.error;
        setEntities(response);
    }

    /**
     * Handle clear form
     */
    const handleClearForm=async(e)=>{
        e.preventDefault();
        setDesk("");
        setMandatory("");
        setAmount("");
        setSite("");
    }

    // 
  return (
    <div className='w-[300px] max-w-[300px] space-y-3'>
        <form onSubmit={handleSubmitFilter} className='flex flex-col'>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Caisse :</label>
                <select className='text-xs' value={desk} onChange={e=>setDesk(e.target.value)}>
                    <option value=""></option>
                    {
                        desks.length > 0 &&
                        desks.map(desk=><option value={desk?.id} key={desk?.id}>{desk?.name?.toUpperCase()}</option>)
                    }
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Mandataire :</label>
                <select className='text-xs' value={mandatory} onChange={e=>setMandatory(e.target.value)}>
                    <option value=""></option>
                    {
                        mandatories.length > 0 &&
                        mandatories.map(mandatory=><option value={mandatory?.User?.id} key={mandatory?.User?.id}>{mandatory?.User?.name?.toUpperCase()}</option>)
                    }
                </select>
            </div>
            <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Montant :</label>
                    <div className='w-full flex space-x-2'>
                        <select className='text-xs w-1/2' value={amountRange} onChange={e=>{
                            setAmount("");
                            setAmountGreaterThan("");
                            setAmountLessThan("");
                            setAmountRange(e.target.value)
                            }}>
                            <option value=""></option>
                            <option value="total_amount">Égale</option>
                            <option value="grt_total_amount">Superieur</option>
                            <option value="lst_total_amount">Inférieur</option>
                        </select>
                        <input type="number" placeholder='Montant' className='text-sm z-1/2' min={0}
                            value={
                                amountRange === "lst_total_amount" ? amountLessThan:
                                amountRange === "grt_total_amount" ? amountGreaterThan:
                                amount
                            }

                            onChange={e =>
                                e.target.value !=0 &&
                                amountRange === "lst_total_amount" ? setAmountLessThan(e.target.value):
                                amountRange === "grt_total_amount" ? setAmountGreaterThan(e.target.value):
                                (!isNaN(e.target.value) || e.target.value >0) && setAmount(e.target.value)
                            }
                        />
                    </div>
                </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Site :</label>
                <select className='text-xs' value={site} onChange={e=>setSite(e.target.value)}>
                    <option value=""></option>
                    {
                        sites.length > 0 &&
                        sites.map(site =><option value={site?.id} key={site?.id}>{site?.name}</option>)
                    }
                </select>
            </div>
            {/* Submit and clear button */}
            <div className='mt-3'>
                <div className='flex justify-end'>
                    <button type='submit' className="btn btn-primary text-xs">Filtrer</button>
                    <button className="btn text-red-500 text-xs" type='reset' onClick={handleClearForm}>Effacer</button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default SupplyFilter