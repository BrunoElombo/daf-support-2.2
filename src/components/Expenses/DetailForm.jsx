import React, { useEffect, useState, useRef } from 'react'
import useFetch from '../../hooks/useFetch';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './DetailForm.css';


function DetailForm({selected, isUpdateMode}) {

    let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

    const benefType = {
        PERSONMORAL: "",
        PERSONPHYSIQUE: "",
    }

    // Hooks
    const { requestLoading, fetchData, postData, updateData } = useFetch();

    // States
    /**
     * Global states
     */
    const [formIsUpdate, setFormIsUpdate] = useState(false);
    const [details, setDetails] = useState({});
    const [entities, setEntities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [externalEntities, setExternalEntities] = useState([]);
    const [sites, setSites] = useState([]);
    const [departments, setDepartments] = useState([]);


    /**
     * Form states
     */
    const [initiationDate, setInitiationDate] = useState("")
    const  [department, setDepartment] = useState("");
    const  [initiator, setInitiator] = useState("");
    const  [site, setSite] = useState("");
    const  [isUrgent, setIsUrgent] = useState(false);
    const  [beneficiary, setBeneficiary] = useState("");
    const  [managerDepartment, setManagerDepartment] = useState("");
    const  [budegetaryDepartment, setBudgetaryDepartment] = useState("");
    const  [generalDirector, setGeneralDirector] = useState("");
    const  [president, setPresident] = useState("");
    const  [description, setDescription] = useState("");
    const  [amount, setAmount] = useState("");
    const  [paymentMethod, setPaymentMethod] = useState("");
    const  [fileNumber, setFileNumber] = useState("");
    const  [transactionNumber, setTransactionNumber] = useState("");
    const  [corporateName, setComporateName] = useState("");
    const  [uinBeneficiary, setUinBenefeiciary] = useState("");
    const  [departmentManagerObs, setDepartmentManagerObs] = useState("");
    const  [budgetaryDeptObs, setBudgetaryDeptObs] = useState("");
    const  [generalDirectorObs, setGeneralDirectorObs] = useState("");
    const  [paymasterGeneralObs, setPayMAsterGeneralObs] = useState("");
    const [budgetLines, setBudgetLines] = useState([]);
    const [budgetLine, setBudgetLine] = useState("");

    
    // Props

    // Handlers
    /**
     * Fetch Entities
     */
    const getAllEntities=async()=>{

    }

    const handleBenef = async()=>{
        try {
            const response = await fetchData(import.meta.env.VITE_USER_API+"/employees");
            if(response.error) return response.error;
            setEmployees(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleExternalEntity = async()=>{
        const external = await fetchData(import.meta.env.VITE_USER_API+"/external-entities");
        if(response.error) return response.error;
        let result = external;
        setExternalEntities(result);
    }

    /**
     * Fetch SItes
     */
    const handleGetDepartments=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/departments");
        if(response.error) return response.error;
        setDepartments(response);
      }
      
      
    /**
     * Fetch departments
     */
    const handleGetEntitySite=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
        if(response.error) return response.error;
        setSites(response); 
    }

    /**
     * Submit the form
     */
    const handleSubmit=async()=>{
        
    };

    /**
     * Handle clear form
     */
    const handleClearForm=async()=>{

    };

    /**
     * Handle set update form
     */
    const handleSetUpdateForm= async()=>{

    };

    const handleGetBudgetLines=async ()=>{
        let url =`${import.meta.env.VITE_BUDGET_API}/sub_lines/`;
        try{
          let response = await fetchData(url);
          setBudgetLines(response?.results);
        }catch(error){
          console.error("BUDGET_LINES_ERR", error)
        }
    }

    // SideEffects
    useEffect(()=>{
        setFormIsUpdate(isUpdateMode);
        handleGetDepartments();
        handleGetEntitySite();
        handleBenef();
        handleGetBudgetLines();
    }, []);

    useEffect(()=>{
        setFormIsUpdate(isUpdateMode);
    }, [isUpdateMode]);

    useEffect(()=>{
        const handleShowDetails=async()=>{
            try {
              let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+selected?.id+"/?entity_id="+entityId
              const response = await fetchData(url);
              setDetails(response);
              setInitiationDate(response.time_created);
              setDepartment(response.department);
              setBeneficiary(response.employee_beneficiary);
              setManagerDepartment(response.manager_department);
              setBudgetaryDepartment(response.budgetary_department);
              setGeneralDirector(response.general_director);
              setPresident(response.president);
              setDescription(response.description);
              setAmount(response.amount);
              setPaymentMethod(response.payment_method);
              setFileNumber(budgetLines.find(line=>line.id == response.file_number)?.name || "N/A");
              setTransactionNumber(response.transaction_number);
              setComporateName(response.corporate_name);
              setUinBenefeiciary(response.uin_benefeiciary);
              setDepartmentManagerObs(response.observation_department_manager);
              setSite(response.site);
              setBudgetaryDeptObs(response.observation_department_budgetary);
              setGeneralDirectorObs(response.observation_general_director);
              setPayMAsterGeneralObs(response.observation_paymaster);
              if(response.status === 200){
              }
            } catch (error) {
              openNotification("ECHEC", "Impossible de charger les détails");
            }
        }
        handleShowDetails();
    }, [selected]);

    // Methods
    return(
        <div className='w-full h-full'>
            {
                requestLoading ?
                <div className='h-full w-full flex items-center justify-center'>
                    <Spin
                        indicator={
                            <LoadingOutlined
                            style={{
                                fontSize: 48,
                            }}
                            spin
                            />
                        }
                    />
                </div>:
                <form className=' space-y-3 p-2 border-[1px] border-gray-100 w-full rounded-lg flex flex-col md:flex-row space-x-0 md:space-x-2 h-full max-h-full overflow-y-scroll'>
                    <div className='w-1/2'>
                        <h4 className='mb-4'>Information général :</h4>
                        <div className='flex items-center space-x-0 md:space-x-2'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Date initiation :</label>
                                <input type="text" className={`disbabled text-sm`} value={initiationDate?.split("T")[0]} />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="" className='text-xs'>Numéro de référence :</label>
                                <input type="text" className=" text-sm disbabled" value={details?.reference_number} disabled/>
                            </div>
                        </div>
                        <div className='flex items-center space-x-0 md:space-x-2'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Méthod de paiment :</label>
                                <select type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}  disabled={!formIsUpdate}>
                                    <option value="ESPECES">Espèces</option>
                                    <option value="CARTE">Carte</option>
                                    <option value="VIREMENT">Virement</option>
                                    <option value="CHEQUE">Cheque</option>
                                    <option value="PAIMENT MOBILE">Paiment mobile</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex items-center space-x-0 md:space-x-2'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Ligne budgétaire :</label>
                                <input type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={fileNumber}  disabled={!formIsUpdate}/>
                                {/* <select type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}  disabled={!formIsUpdate}>
                                    <option value="CARTE">Carte</option>
                                    <option value="VIREMENT">Virement</option>
                                    <option value="MOBILE">Mobile</option>
                                </select> */}
                            </div>
                        </div>
                        <div className='flex items-center space-x-0 md:space-x-2'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Montant :</label>
                                <input type="text" className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={amount} onChange={e=>setAmount(e.target.value)} disabled={!formIsUpdate} />
                            </div>
                        </div>
                        <div className='flex items-center space-x-0 md:space-x-2'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Site :</label>
                                <div className='flex flex-wrap w-full'>
                                <select type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={isUrgent}  onChange={e=>setIsUrgent(e.target.value)} disabled={!formIsUpdate}>
                                        {
                                            sites.map(site =><option key={site?.id} value={site?.id}>{site?.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center space-x-0 md:space-x-2 w-full'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Justif :</label>
                                <div className='flex flex-wrap w-full'>
                                    {
                                        details?.image_list ?
                                        details?.image_list[0]?.split(",")?.map((file, index)=>
                                            <a className='p-1 text-xs bg-gray-50 border-[1px] border-gray-100 rounded-xl' key={index} href={`${file?.replace("[", "")?.replace("]","")}`} target='_blank' download>
                                                <small>{file?.replace("[", "")?.replace("]","")}</small>
                                            </a>
                                        ):
                                        <small>Auccun fichier</small>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center space-x-0 md:space-x-2'>
                            <div className={'flex flex-col w-full'}>
                                <label htmlFor="" className='text-xs'>Description :</label>
                                <textarea type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={description}  onChange={e=>setDescription(e.target.value)} disabled={!formIsUpdate}>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className='w-[2px] bg-gray-200 border-[1px] border-gray-200'></div>
                    <div className='w-1/2 space-y-2'>
                            <div className='flex flex-col '>
                                    <label htmlFor="" className='text-xs'>Status de la fiche :</label>
                                    <input type="text" className={`disbabled text-sm`}  value={ details?.statut } disabled={!formIsUpdate} />
                            </div>
                            <div className='flex flex-col'>
                                    <label htmlFor="" className='text-xs'>Numéro de transaction :</label>
                                    <input type="text" className={`disbabled text-sm`}  value={ details?.transaction_number || 'N/A'} disabled={!formIsUpdate} />
                            </div>
                            <div className='flex flex-col'>
                                    <label htmlFor="" className='text-xs'>NIU bénéficiaire :</label>
                                    <input type="text" className={`disbabled text-sm`}  value={ details?.uin_benefeiciary || 'N/A' } disabled={!formIsUpdate} />
                            </div>
                            {
                                 details?.observation_manager_department &&
                                <div className='flex items-center'>
                                <div className={'flex flex-col w-full'}>
                                    <label htmlFor="" className='text-xs'>Observation chef de département :</label>
                                    <textarea type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={ details?.observation_manager_department || 'N/A' }  onChange={e=>setDescription(e.target.value)} disabled={!formIsUpdate}>
                                    </textarea>
                                </div>
                            </div>
                            }
                            {
                                details?.observation_budgetary_department &&
                                <div className='flex items-center space-x-0 md:space-x-2'>
                                <div className={'flex flex-col w-full'}>
                                    <label htmlFor="" className='text-xs'>Observation DAF :</label>
                                    <textarea type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={ details?.observation_budgetary_department || 'N/A' }  onChange={e=>setDescription(e.target.value)} disabled={!formIsUpdate}>
                                    </textarea>
                                </div>
                            </div>
                            }
                            {
                                details?.observation_general_director &&
                                <div className='flex items-center space-x-0 md:space-x-2'>
                                <div className={'flex flex-col w-full'}>
                                    <label htmlFor="" className='text-xs'>Observation Directeur general :</label>
                                    <textarea type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={ details?.observation_general_director || 'N/A' }  onChange={e=>setDescription(e.target.value)} disabled={!formIsUpdate}>
                                    </textarea>
                                </div>
                            </div>
                            }
                            {
                                details?.observation_president  &&
                                <div className='flex items-center space-x-0 md:space-x-2'>
                                    <div className={'flex flex-col w-full'}>
                                        <label htmlFor="" className='text-xs'>Observation président(e) :</label>
                                        <textarea type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={ details?.observation_president || 'N/A' }  onChange={e=>setDescription(e.target.value)} disabled={!formIsUpdate}>
                                        </textarea>
                                    </div>
                                </div>
                            }
                            {
                                details?.paymaster_general &&
                                <div className='flex items-center space-x-0 md:space-x-2'>
                                    <div className={'flex flex-col w-full'}>
                                        <label htmlFor="" className='text-xs'>Observation TPG :</label>
                                        <textarea type="text"  className={`${formIsUpdate ?"":"disbabled"} text-sm`}  value={ details?.paymaster_general || 'N/A' }  onChange={e=>setDescription(e.target.value)} disabled={!formIsUpdate}>
                                        </textarea>
                                    </div>
                                </div>
                            }
                    </div>
                </form>
            }
        </div>
    )
}

export default DetailForm