import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch';
import $ from 'jquery';


function ExepenseSheetFilter({setExpenseDataSrc}) {
    const entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

    // Custom Hooks
    const {fetchData, requestError, requestLoading} = useFetch();

    // States
    const [statut, setStatut] = useState("");
    const [site, setSite] = useState("");
    const [initiator, setInitiator] = useState("");
    const [beneficiary, setBeneficiary] = useState("");
    const [department, setDepartment] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amountRange, setAmountRange] = useState("");
    const [amountLessThan, setAmountLessThan] = useState("");
    const [amountGreaterThan, setAmountGreaterThan] = useState("");
    const [amount, setAmount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [sites, setSites] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departements, setDepartements] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // Handlers

    // --Handle Submit filter
    const handleSubmitFilter = async(e)=>{
        e.preventDefault();
        try {
            setIsLoading(true);
            let url = `${import.meta.env.VITE_DAF_API}/expensesheet/multi_criteria_search/`;
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }
            let data = {
                "employee_initiator":initiator,
                "employee_beneficiary":beneficiary,
                "site":site,
                "department":department,
                "grt_total_amount":amountGreaterThan,
                "lst_total_amount":amountLessThan,
                "amount":amount,
                "payment_method":paymentMethod,
                "start_date":startDate,
                "end_date":endDate,
                "statut":statut,
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
                  setExpenseDataSrc(formatedData);
                setIsLoading(false);
            });

        } catch (error) {
            console.log("Error :", error);
            setIsLoading(false);
        }
    }
    // --Handle Cancel form
    const handleCancel=(e) =>{
        e.preventDefault();
        handleClearForm();
    }

    // --Handle Clear form
    const handleClearForm = () =>{
        setStatut("");
        setSite("");
        setInitiator("");
        setBeneficiary("");
        setDepartment("");
        setPaymentMethod("");
        setAmountRange("");
        setAmountLessThan("");
        setAmountGreaterThan("");
        setStartDate("");
        setEndDate("");
    }

    // --Handle Get Sites
    const handleGetEntitySite=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
        if(!requestError){
            setSites(response);
        }
    }

    // --Handle Get Employees
    const handleGetEmployees = async()=>{
        const controller = await fetchData(import.meta.env.VITE_USER_API+"/employees");
        try {
            let result = controller ;
            setEmployees(result);
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    }

    // --Handle Get Departments
    const handkeGetDepartments = async() => {
        let response = await fetchData(import.meta.env.VITE_USER_API+"/departments");
        if(!requestError){
        setDepartements(response);
        }
    }

    // UseEfffects
    useEffect(()=>{
        handleGetEntitySite();
        handleGetEmployees();
        handkeGetDepartments();
    }, []);

  return (
    <div className='w-[300px] max-w-[300px] space-y-3'>
        <form onSubmit={handleSubmitFilter}>
            <div className='flex flex-col w-full max-h-[200px] overflow-y-auto'>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Status :</label>
                    <select className='text-xs' value={statut} onChange={e=>setStatut(e.target.value)}>
                        <option value=""></option>
                        <option value="VALIDATION DEPARTMENT MANAGER">En attente validation chef de departement</option>
                        <option value="VALIDATION FINANCIAL MANAGEMENT ">En attente validation DAF</option>
                        <option value="VALIDATION GENERAL MANAGEMENT">En attente validation DG</option>
                        <option value="VALIDATION PRESIDENT">En attente validation Pre.</option>
                        <option value="IN DISBURSEMENT">EN Décaissement</option>
                        <option value="EXECUTED">Exécuté</option>
                        <option value="REJECT DEPARTMENT MANAGER">Rejeter par le chef department</option>
                        <option value="REJECT FINANCIAL MANAGEMENT">Rejeter par le DAF</option>
                        <option value="REJECT GENERAL MANAGEMENT">Rejeter par le DG</option>
                        <option value="REJECT PRESIDENT">Rejeter par le Pre.</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Site :</label>
                    <select className='text-xs' value={site} onChange={e=>setSite(e.target.value)}>
                        <option value=""></option>
                        {
                            sites.map(site => <option key={site?.id} value={site?.id}>{site?.name}</option>)
                        }
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Departement :</label>
                    <select className='text-xs' value={department} onChange={e=>setDepartment(e.target.value)}>
                        <option value=""></option>
                        {
                            departements.map(department => <option key={department?.id} value={department?.id}>{department?.displayName}</option>)
                        }
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Initiateur :</label>
                    <select className='text-xs' value={initiator} onChange={e=>setInitiator(e.target.value)}>
                        <option value=""></option>
                        {
                            employees.map(employee => <option key={employee?.User.id} value={employee?.User.id}>{employee?.User.name}</option>)
                        }
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Beneficiaire :</label>
                    <select className='text-xs' value={beneficiary} onChange={e=>setBeneficiary(e.target.value)}>
                        <option value=""></option>
                        {
                            employees.map(employee => <option key={employee?.User.id} value={employee?.User.id}>{employee?.User.name}</option>)
                        }
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs'>Method de paiment :</label>
                    <select className='text-xs' value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
                        <option value=""></option>
                        <option value="ESPECES">Espèces</option>
                        <option value="CARTE">Carte</option>
                        <option value="VIREMENT">Virement</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="PAIMENT MOBILE">Paiment mobile</option>
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
            <div className='mt-2 flex items-center justify-end space-x-2'>
                <button className={`${isLoading?"bg-green-300 cursor-not-allowed":"bg-green-500"} btn text-xs text-white`} disabled={isLoading}>{isLoading?"Encours...":"filtrer"}</button>
                <button className={`btn text-xs text-red-500`} disabled={isLoading} onClick={handleCancel}>Effacer</button>
            </div>
        </form>
    </div>
  )
}

export default ExepenseSheetFilter