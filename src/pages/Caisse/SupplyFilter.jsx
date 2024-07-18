import React, { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch';


function SupplyFilter() {
    // Hooks
    const { requestError, requestLoading, fetchData, postData, updateData } = useFetch();

    // State

    /**
     * Global states
     */
    const [desks, setDesks] = useState([]);
    const [mandatories, setMandatories] = useState([]);
    const [entities, setEntities] = useState([]);
    const [sites, setSites] = useState([]);

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
            let url = `${import.meta.env.VITE_DAF_API}/expensesheet/multi_criteria_search/`;
            let data = {
                // "employee_initiator":initiator,
                // "employee_beneficiary":beneficiary,
                // "site":site,
                // "department":department,
                // "grt_total_amount":amountGreaterThan,
                // "lst_total_amount":amountLessThan,
                // "amount":amount,
                // "payment_method":paymentMethod,
                // "start_date":startDate,
                // "end_date":endDate,
                // "is_an_favorable_management_controller":isFavorable,
                // "statut":statut,
                // "entity_id":entityId
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
                  setExpenseDataSrc(formatedData);
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
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
        if(!requestError){
            setSites(response);
        }
    }

    /**
     * Get the cash desks
     */
    const handleGetCashDesks= async ()=>{
        let url = import.meta.env.VITE_USER_API+"/cash-desk";
        try {
          const response = await fetchData(url);
          setDesks(response);
        } catch (error) {
          console.log(error);
        }
    }

    /**
     * Get all mandatories
     */
    const handleGetMandatories = async()=>{
        try {
          const employees = await fetchData(import.meta.env.VITE_USER_API+"/employees/mandatory");
          setMandatories(employees);
        } catch (error) {
          console.log(error.message);
        }
    }
    
    /**
     * Get the entities
     */
    const handleGetEntities=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/entities/all");
        if(!requestError){
            setEntities(response);
        }
    }
    // 
  return (
    <div className='w-[300px] max-w-[300px] space-y-3'>
        <form onSubmit={handleSubmitFilter} className='flex flex-col'>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Caisse :</label>
                <select className='text-xs'>
                    <option value=""></option>
                    {
                        desks.map(desk=><option className='' value={desk?.id} key={desk?.id}>{desk?.name?.toUpperCase()}</option>)
                    }
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Mandataire :</label>
                <select className='text-xs'>
                    <option value=""></option>
                    {
                        mandatories.map(mandatory=><option value={mandatory?.User?.id} key={mandatory?.User?.id}>{mandatory?.User?.name?.toUpperCase()}</option>)
                    }
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Montant :</label>
                <select className='text-xs'>
                    <option value=""></option>
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='text-xs'>Site :</label>
                <select className='text-xs'>
                    <option value=""></option>
                    {
                        sites.map(site =><option value={site?.id} key={site?.id}>{site?.name}</option>)
                    }
                </select>
            </div>
            {/* Submit and clear button */}
            <div className='mt-3'>
                <div className='flex justify-end'>
                    <button type='submit' className="btn btn-primary text-xs">Filtrer</button>
                    <button type='reset' className="btn text-red-500 text-xs">Effacer</button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default SupplyFilter