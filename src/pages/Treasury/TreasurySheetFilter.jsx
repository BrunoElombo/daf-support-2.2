import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import $ from 'jquery';


const filterOptions = [
    'employee_initiator', 'employee_controller', 'provenance', 'start_date', 
    'end_date', 'date', 'shift', 'employee_checkout', 'payment_method', 
    'grt_total_amount', 'lst_total_amount', 'total_amount', 
    'manager_department', 'statut', 'site', 'department'
];



function TreasurySheetFilter({setRecetteDataSrc, onSubmit}) {

    const {fetchData, requestError, requestLoading} = useFetch();
    const entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
    const [filters, setFilters] = useState([{ attribute: '', value: '' }]);
    const [availableOptions, setAvailableOptions] = useState(filterOptions);

    
  const  [employees, setEmployees] = useState([]);
  const  [entitySites, setEntitySites] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

//   Filter form fields
    const [initiator, setInitiator] = useState("");
    const [controller, setController] = useState("");
    const [site, setSite] = useState("");
    const [provenance, setProvenance] = useState("");
    const [shift, setShift] = useState("");
    const [amountRange, setAmountRange] = useState("");
    const [amountLessThan, setAmountLessThan] = useState("");
    const [amountGreaterThan, setAmountGreaterThan] = useState("");
    const [amount, setAmount] = useState("");
    const [isFavorable, setIsFavorable] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Handle Filter submits
    const handleSubmitFilter= async(e)=>{
        e.preventDefault();
        try {
            setIsLoading(true);
            let url = `${import.meta.env.VITE_DAF_API}/recipesheet/multi_criteria_search/`;
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json",
                'Authorization':'Bearer '+localStorage.getItem('token')
            }
            let data = {
                "employee_initiator":initiator,
                "employee_controller":controller,
                "site":site,
                "shift":shift,
                "grt_total_amount":amountGreaterThan,
                "lst_total_amount":amountLessThan,
                "total_amount":amount,
                "is_an_favorable_management_controller":isFavorable,
                "provenance":provenance,
                "start_date":startDate,
                "end_date":endDate,
                "entity_id":entityId
            };
            $.ajax({
                method: "GET",
                url: url,
                data: data,
                headers: headersList,
                contentType: "application/json",
              })
            .done(function( data ) {
                const formatedData = data?.map(obj => {
                    return { ...obj, key: obj.id };
                  });
                setRecetteDataSrc(formatedData);
                onSubmit();
                setIsLoading(false);
            });

        } catch (error) {
            console.log("Error :", error);
            setIsLoading(false);
        }
    }


    // Handle Cancel submit
    const handleCancelFilter=async(e)=>{
        e.preventDefault();
        handleClearForm();
    }

    // CLear form
    const handleClearForm=()=>{
        setInitiator("");
        setController("");
        setSite("");
        setAmountLessThan("");
        setAmountLessThan("");
        setProvenance("");
        setShift("");
        setIsFavorable("");
        setAmountRange("");
        setAmount("");
        setStartDate("");
        setEndDate("");
    }
    
    const handleGetEmployees = async()=>{
        const controller = await fetchData(import.meta.env.VITE_USER_API+"/employees");
        try {
            let result = controller ;
            setEmployees(result);
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    }

    const handleGetEntitySite=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
        if(response.error) return response.error;
        setEntitySites(response);
      }

    useEffect(()=>{
        handleGetEmployees();
        handleGetEntitySite();
    }, []);

    return (
        <div>
            <form className='space-y-2' onSubmit={handleSubmitFilter}>
                <div className='flex flex-col w-full max-h-[200px] overflow-y-auto'>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Favorable :</label>
                        <select className='text-xs' value={isFavorable} onChange={e=>setIsFavorable(e.target.value)}>
                            <option value=""></option>
                            <option value={"True"}>Oui</option>
                            <option value={"False"}>Non</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Initiateur :</label>
                        <select className='text-xs' value={initiator} onChange={e=>setInitiator(e.target.value)}>
                            <option value=""></option>
                            {
                                employees.map((employee)=><option key={employee?.User?.id} value={employee?.User.id}>{employee?.User?.name?.toUpperCase()}</option>)
                            }
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Controlleur :</label>
                        <select className='text-xs' value={controller} onChange={e=>setController(e.target.value)}>
                            <option value=""></option>
                            {
                                employees.map((employee)=><option key={employee?.User?.id} value={employee?.User.id}>{employee?.User?.name?.toUpperCase()}</option>)
                            }
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Site :</label>
                        <select className='text-xs' value={site} onChange={e=>setSite(e.target.value)}>
                            <option value=""></option>
                            {
                                entitySites.map((site)=><option key={site?.id} value={site?.id}>{site?.name}</option>)
                            }
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Provenance :</label>
                        <select className='text-xs' value={provenance} onChange={e=>setProvenance(e.target.value)}>
                            <option value=""></option>
                            <option value="INVOICE PAYMENT">INVOICE PAYMENT</option>
                            <option value="WEIGHBRIDGE PAYMENT">WEIGHBRIDGE PAYMENT</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Shift :</label>
                        <select className='text-xs' value={shift} onChange={e=>setShift(e.target.value)}>
                            <option value=""></option>
                            <option value="6h-15h">6h-15h</option>
                            <option value="15h-22h">15h-22h</option>
                            <option value="22h-15h">22h-15h</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Montant :</label>
                        <div className='space-x-2'>
                            <select className='text-xs' value={amountRange} onChange={e=>{
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
                            <input type="number" placeholder='Montant' className='text-sm' min={0}
                                value={
                                    amountRange === "lst_total_amount" ? amountLessThan:
                                    amountRange === "grt_total_amount" ? amountGreaterThan:
                                    amount
                                }

                                onChange={e =>
                                    e.target.value !=0 &&
                                    amountRange === "lst_total_amount" ? setAmountLessThan(e.target.value):
                                    amountRange === "grt_total_amount" ? setAmountGreaterThan(e.target.value):
                                    setAmount(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Début :</label>
                        <input type="date" placeholder='Montant' className='text-xs' value={startDate} onChange={e=>setStartDate(e.target.value)}/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>fin :</label>
                        <input type="date" placeholder='Montant' className='text-xs' value={endDate} onChange={e=>setEndDate(e.target.value)}/>
                    </div>
                </div>
                <div className='space-x-2 flex justify-end'>
                    <button className={`${isLoading?"bg-green-300":"bg-green-500"} btn p-2 rounded-lg shadow-sm text-white text-xs`} type='submit'>{isLoading?"Encours...":"Filtrer"}</button>
                    <button className='text-red-500 text-xs' onClick={handleCancelFilter}>Annuler</button>
                </div>
            </form>
        </div>
    );
}

export default TreasurySheetFilter