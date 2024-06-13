import React, { useContext, useEffect, useRef, useState } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import ExepenseSheetFilter from './ExepenseSheetFilter';
import { InboxOutlined } from '@ant-design/icons';
import { Table, Modal, Upload, Drawer, Space, Select, notification, Popover } from 'antd';
import { v4 as uuidV4 } from 'uuid';
import useFetch from '../../hooks/useFetch';
const { Dragger } = Upload;
import { FunnelIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, TrashIcon, EllipsisHorizontalIcon, PaperClipIcon, PlusIcon, EyeIcon, PencilIcon, CheckIcon, XMarkIcon, BanknotesIcon, CalculatorIcon, ArrowUpRightIcon, ArrowTopRightOnSquareIcon  } from '@heroicons/react/24/outline';
import { AUTHCONTEXT } from '../../context/AuthProvider';
import Collapsible from '../../components/Collapsible/Collapsible';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import SuggestInput from '../../components/SuggestInput/SuggestInput';
import $ from 'jquery';
import axios from 'axios';


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

function ExpensePage() {
  
  const MAX_ALLOWED_AMOUNT = 100000;
  const MAX_ALLOWED_AMOUNT_OTHERS = 250000;
  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
  let userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;
  let userFunction = JSON.parse(localStorage.getItem("user"))?.Function?.name;
  let userDepartment = JSON.parse(localStorage.getItem("user"))?.Departement;
  
  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [expenseDataSrc, setExpenseDataSrc] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { userInfo } = useContext(AUTHCONTEXT);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddingOperation, setIsAddingOperation] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [openValidationModal, setOpenValidationModal] = useState(false);


  const [site, setSite] = useState('');
  const [beneficiaire, setBeneficiaire] = useState("");
  const [montant, setMontant] = useState("");
  const [paymentMode, setPaymentMode] = useState("ESPECES");
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const[recipientType, setRecipientType] = useState("PERSONNEPHYSIQUE");
  const[recipient, setRecipient] = useState("");

  const handleBeneficiaryBankAccount= async (id)=>{
    let url = import.meta.env.VITE_USER_API+`${recipientType === "PERSONNEPHYSIQUE" ?"/employees/" :"/external_entities/"}${id}/banks`;
    try {
        const response = await fetchData(url);
        setBeneficiaryBankAccount(response[0]?.bank.id);
        setBeneficiairyBanks(response);
        console.log(url);
        console.log(response[0]?.bankAccounts[0].account_number);
        setBeneficiaryBankAccountNumber(response[0]?.bankAccounts[0].account_number);
        setBeneficiaryBankAccountNumbers(response[0]?.bankAccounts);    
    } catch (error) {
        openNotification("ECHEC", "Impossible dóbtenir les informations des bank\n du bénéficiaire");
        console.log(error)
        return;
      }
}

  useEffect(()=>{
    if(recipientType === "PERSONNEPHYSIQUE"){
      setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User.id);
      handleBeneficiaryBankAccount(JSON.parse(localStorage.getItem("user"))?.User.id);
    }else if(recipientType === "PERSONNEMORALE"){
      setRecipient(externalEntities[0]?.external_entity.id);
      handleBeneficiaryBankAccount(externalEntities[0]?.external_entity.id);
    }
  }, [recipientType]);



  const [selectedRecipe, setSelectedRecipe] = useState("");

  const [sites, setSites] = useState([]);
  const [departments, setDepartements] = useState([]);
  const [entitySites, setEntitySites] = useState([]);
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const [bankEntity, setBankEntity] = useState([]);
  const [bankExternalEntity, setBankExternalEntity] = useState([]);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountNumbers, setBankAccountNumbers] = useState([]);
  const [beneficiaryBankAccountNumber, setBeneficiaryBankAccountNumber] = useState("");
  const [beneficiaryBankAccountNumbers, setBeneficiaryBankAccountNumbers] = useState([]);
  const [beneficiaryBankAccount, setBeneficiaryBankAccount] = useState("");

  const [beneficiairyBanks, setBeneficiairyBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const recipientRef= useRef();

  const [selectedExpense, setSelectedExpense] = useState({})
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  const [multipleAction, setMultipleAction] = useState("VALIDER");
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
  };

  // Validation fields
  const [openValidateModal, setOpenValidateModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [typeValidation, setTypeValidation] = useState(false);
  const [validationDescription, setValidationDescription] = useState("");
  const [rejectionDescription, setRejectionDescription] = useState("");
  const [originAccount, setOriginAccount ] = useState("");
  const [destinationAccount, setDestinationAccount ] = useState("");

  // Validation TPG
  const [openTPGValidation, setOpenTPGVAlidation] = useState(false);
  const [observationTPG, setObservationTPG] = useState("");
  const [initExpenseFormIsValid, setInitExpenseFormIsValid] = useState(false);
  
  // Validation Caissier
  const [openCashierValidation, setOpenCashierValidation] = useState(false);
  const [cashierObservation, setCashierObservation] = useState("");
  
  const handleGetExpenseSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/expensesheet/summary_by_year/?year="+actualYear+"&entity_id="+entityId);
      if (response && response.annual_sums) {
        setExpenseTotal(response.annual_sums[0].total_amount)
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  const openNotification = (title, message) => {
    notification.open({
      message: title,
      description: message,
      duration: 1,
    });
  }

  const handleSubmitValidation = async (e)=>{
    e.preventDefault();
    if(isMultipleSelect){
      selectedRowKeys?.forEach(async (rowKey)=>{
        let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+rowKey+"/?entity_id="+entityId;
        let data ={
          // is_urgent:typeValidation,
          is_urgent:false,
          description:validationDescription,
          transaction_number: transactionNumber,
          employee_initiator: beneficiaire
        }
        try {
          const response = await updateData(url, data, true);
          setValidationDescription("");
          setTransactionNumber("");
          setPaymentMode("ESPECES");
          setTypeValidation(false);
          setOpenValidateModal(false);
          handleGetAllExpenses();
          openNotification("SUCCESS", "Fiche de dépense validé");
          return
          // if(!requestError){
          //     return;
          // }
          // openNotification("ECHEC", "Echec de validation")
          
        } catch (error) {
          openNotification("ECHEC", "Echec de validation");      
        }
      })
    }else{
      let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/?entity_id="+entityId;
        let data ={
          // is_urgent:typeValidation,
          is_urgent:false,
          description:validationDescription,
          transaction_number: transactionNumber,
          employee_initiator: beneficiaire
        }
        try {
          const response = await updateData(url, data, true);
          if(!requestError){
            setValidationDescription("");
            setTransactionNumber("");
            setPaymentMode("ESPECES");
            setTypeValidation(false);
            setOpenValidateModal(false);  
            handleGetAllExpenses();
            openNotification("SUCCESS", "Fiche de dépense validé");
            return;
          }
        } catch (error) {
          openNotification("ECHEC", "Echec de validation");      
        }
    }
  }
  // const handleSubmitValidation = async (e)=>{
  //   e.preventDefault();
  //   try {
  //     let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id
  //     let url = 
  //       isMultipleSelect  ? 
  //       import.meta.env.VITE_DAF_API+"/expensesheet/bulk_validation/?entity_id="+entityId
  //       :
  //       import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/?entity_id="+entityId
      
  //     const data = isMultipleSelect  ? 
  //     {
  //       is_urgent:false,
  //       "pk_list": selectedRowKeys,
  //       "description": validationDescription,
  //       transaction_number: ""
  //     }:
  //     {
  //       // is_urgent:typeValidation,
  //       is_urgent:false,
  //       description:validationDescription,
  //       transaction_number: transactionNumber,
  //       employee_initiator: beneficiaire
  //     }
  //     console.log(data);
  //     const response = await updateData(url, data, true);
  //     if(!requestError){
  //       setValidationDescription("");
  //       setTransactionNumber("");
  //       setPaymentMode("ESPECES");
  //       setTypeValidation(false);
  //       setOpenValidateModal(false);
  //       handleGetAllExpenses();
  //       openNotification("SUCCESS", "Fiche de dépense validé")
  //       return;
  //     }
  //     openNotification("ECHEC", "Echec de validation")
      
  //   } catch (error) {
  //     openNotification("ECHEC", "Echec de validation");      
  //   }
  // }

  const handleRejectExpenses = async (e)=>{
    e.preventDefault();
    let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id
    let url = 
    isMultipleSelect ?
    import.meta.env.VITE_DAF_API+"/expensesheet/bulk_rejection/?entity_id="+entityId
    :
    import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/rejection/?entity_id="+entityId
    const data=
    isMultipleSelect ?
    {
      is_urgent:true,
      description:rejectionDescription,
      pk_list: selectedRowKeys,
      employee_initiator: JSON.parse(localStorage.getItem("user"))?.id
    }
    :
    {
      is_urgent:true,
      description:rejectionDescription,
      // payment_method: "ESPECE",
      employee_initiator: JSON.parse(localStorage.getItem("user"))?.id
    }
    try {
      const response = await updateData(url, data, true);
      if(!requestError){
        setRejectionDescription("");
        setOpenRejectModal(false);
  
        handleGetAllExpenses();
        openNotification("SUCCESS", "Fiche de dépense rejeté");
        return;
      }
      openNotification("ECHEC", "Echec du rejet de la fiche");
      
    } catch (error) {
      openNotification("ECHEC", "Echec du rejet de la fiche"); 
    }

  }

  const setSelectionRow = (expense) => {
    setSelectedExpense(expense);
    setOpenValidateModal(true);
  };

  const setSelectionRow2 = (expense) => {
    setSelectedExpense(expense);
    setOpenRejectModal(true);
  };

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  const numberWithCommas=(x)=>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  const expensesCol = [
    {
      title: 'Numéro de références',
      dataIndex: 'reference_number',
      key: 'reference_number',
      width:  "200px",
      render:(text)=>highlightText(text)
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
      width:  "200px",
      render: (text, record)=>{
        const site = entitySites?.find(site=>site.id === record.site)
        return <>{site?.name != undefined? highlightText(site?.name) :highlightText(text) }</>
      }
    },
    {
      title: 'Initiateur',
      dataIndex: 'employee_initiator',
      key: 'employee_initiator',
      width:  "200px",
      render: (text, record)=> beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase() ?  highlightText(beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase()) : highlightText(externalEntities.find(externalEntity=> externalEntity?.external_entity.id === text)?.external_entity.name.toUpperCase())
    },
    {
      title: 'Beneficiaire',
      dataIndex: 'employee_beneficiary',
      key: 'employee_beneficiary',
      width:  "200px",
      render: (text, record)=> beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase() ?  highlightText(beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase()) : highlightText(externalEntities.find(externalEntity=> externalEntity?.external_entity.id === text)?.external_entity.name.toUpperCase())
    },
    {
      title: 'Département',
      dataIndex: 'department',
      key: 'department',
      width:  "200px",
      render: (text, record)=> highlightText(departments.find(department=> department?.id === text)?.displayName)
    },
    {
      title: 'Mode de paiement',
      dataIndex: 'payment_method',
      key: 'payment_method',
      width:  "200px",
      render: (text, record)=> highlightText(text)
      },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      width:  "200px",
      render: (text)=><b>{numberWithCommas(text)} XAF</b>
    },
    {
      title: 'Status',
      width:  "200px",
      render:(text, record)=>
      (
        <div className='flex space-x-2'>
          <>
            {
              departments.find(department=> department?.id === record.department)?.name.includes("daf") ?
              <>
              {
                !record.is_urgent ?
                <>
                  <div className={`${((record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_budgetary_department != null && record.statut != "REJECT FINANCIAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF</div>
                  <div className={`${((record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_general_director != null && record.statut != "REJECT GENERAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DG</div>
                  <div className={`${((record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_president != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>PRE</div>
                  <div className={`${((record.statut == "EXECUTED") || (record.date_valid_paymaster_general != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>TPG</div>
                </>:
                <div 
                className={`${((record.statut === "VALIDATION FINANCIAL MANAGEMENT"|| record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_manager_department != null && record.statut != "REJECT DEPARTMENT MANAGER")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF
              </div>
              }
              </>
              :
              <>
                <div 
                  className={`${((record.statut === "VALIDATION FINANCIAL MANAGEMENT"|| record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_manager_department != null && record.statut != "REJECT DEPARTMENT MANAGER")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DEX
                </div>
                {
                  !record.is_urgent &&
                  <>
                    <div className={`${((record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_budgetary_department != null && record.statut != "REJECT FINANCIAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF</div>
                    <div className={`${((record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_general_director != null && record.statut != "REJECT GENERAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DG</div>
                    <div className={`${((record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_president != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>PRE</div>
                    <div className={`${((record.statut == "EXECUTED") || (record.date_valid_paymaster_general != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>TPG</div>
                  </>
                }
              </>
            }
            
          </>
          
        </div>
      )
      
    },
    {
      title: 'Actions',
      width:  "200px",
      fixed: "right",
      render: (text, record)=>(
        // <EllipsisHorizontalIcon className='text-gray-500 h-6 w-6 cursor-pointer'/>
        // <button className='btn btn-primary bg-green-500 text-white text-sm'>Valider</button>
        <>
           <div className='flex items-center space-x-2'>
            {
              (record.statut.includes("REJECT") || record.statut.includes("EXECUTED"))?
              <></>
              :
              (userFunction == "operations_manager" && record.date_valid_manager_department == null && record.statut != "IN_DISBURSEMENT") ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
              </>
              :
              ((userRole == "chief_financial_officer" && record.date_valid_manager_department) && record.date_valid_budgetary_department == null && record.statut != "IN_DISBURSEMENT") ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
                
              </>
              :
              ((userRole == "general_manager" && record.date_valid_budgetary_department) && record.date_valid_general_director === null && record.statut != "IN_DISBURSEMENT") ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
              </>
              :
              ((userRole == "president" && record.date_valid_general_director) && record.date_valid_president == null && record.statut != "IN_DISBURSEMENT") ?
                <>
                  <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                  <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
                </>
              :
              ((userRole == "paymaster_general" && record.date_valid_president ) && record.date_valid_paymaster_general == null && record.statut == "IN_DISBURSEMENT") ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                {/* <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/> */}
              </>:
              <>
              </>
            }
            <EyeIcon className='text-gray-500 h-6 cursor-pointer hover:bg-gray-300 hover:text-white p-1 rounded-lg' title='Voir le détail' onClick={()=>handleShowDetails(record)}/>
          </div>
        </>
      )
    }
  ]

  const handleToggleOpenForm = () =>{
    setIsOpen(!isOpen);
  }

  const handleShowDetails=async(record)=>{
    let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

    try {
      let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+record?.id+"/?entity_id="+entityId
      const detail = await fetchData(url);
      const selected = expenseDataSrc.find(expense=>expense.id === record.id);
      setIsOpenDrawer(true);
      console.log(selected);
      setSelectedExpense(selected);
    } catch (error) {
      openNotification("ECHEC", "Impossible de charger les détails");
    }
  }

  const handleGetAllExpenses = async() =>{
    let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id
    try {
      const response = await fetchData(import.meta.env.VITE_DAF_API+"/expensesheet/?entity_id="+entityId);
      const formatedData = response?.results?.map(obj => {
        return { ...obj, key: obj.id };
      });
      setExpenseDataSrc(formatedData);
      setFilteredData(formatedData);
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleGetSite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
    if(!requestError){
      setSite(response[0]?.id);
      setSites(response);
    }
  }
  
  const handleGetDepartments=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/departments");
    if(!requestError){
      setDepartements(response);
    }
  }
  
  const handleGetEntitySite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
    if(!requestError){
      console.log(response)
      setEntitySites(response);
    }
  }

  const handleBenef = async()=>{
    try {
      const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees");
      setBeneficiaires(benef);
      setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User.id)
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleExternalEntity = async()=>{
    const external = await fetchData(import.meta.env.VITE_USER_API+"/external_entities");
    if(!requestError){
      let result = external;
      
      setExternalEntities(result);
    }
  }

  const handleGetBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity_banks");
    if(!requestError){
      setBankEntity(banks);
      setBankAccountNumber(banks[0]?.bankAccounts[0]?.id);
      setBankAccountNumbers(banks[0]?.bankAccounts);
    }
  }

  useEffect(()=>{
    const selectedBank = bankEntity.find(bank => bank.bank.id === originAccount);
    setBankAccountNumber(selectedBank?.bankAccounts[0]?.id);
    setBankAccountNumbers(selectedBank?.bankAccounts);
  }, [originAccount])

  const handleGetExternalBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/external_entities");
    if(!requestError){
      setBankExternalEntity(banks);
    }
  }

  const handleDeleteExpense = async ()=>{
    const confirmDelete = await confirm("Voulez-vous supprimer la dépense ?")
    if(confirmDelete){
      const url = import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/?entity_id="+entityId;
      let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
        "Content-Type": "application/json"
      }

      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: headersList,
        });
  
        if(response.ok){
          openNotification("SUCCESS", "Recette supprimer avec success");
          handleGetAllExpenses();
          setIsOpenDrawer(false);
          return
        }
        openNotification("ECHEC", "Impossible de supprimer la recette");
      } catch (error) {
        openNotification("ECHEC", "Une erreur est survenue");
        throw new Error(`Error: Failed to update`);      
      }
    }
  }

  const handleClearForm = () =>{
    setPaymentMode("ESPECES");
    setSite(sites[0]?.id);
    setBeneficiaire(beneficiaires[0]?.User.id);
    setMontant("");
    setDescription("");
    setFiles([]);
  }

  const handleSubmitExpense= async (e)=>{
    e.preventDefault();
    setLoading(true);

    const headersList = new Headers();
    headersList.append(
      "Authorization", "Bearer "+localStorage.getItem("token")
    );
    const formData = new FormData();
    formData.append("site", site);
    formData.append("employee_beneficiary", beneficiaire);
    formData.append("employee_initiator", JSON.parse(localStorage.getItem("user"))?.User.id);
    formData.append("payment_method", paymentMode);
    formData.append("amount", montant);
    formData.append("beneficiary_bank_account_number", beneficiaryBankAccountNumber)
    formData.append("bank_account_number", bankAccountNumber)
    formData.append("description", description);
    formData.append("entity", entityId);
    formData.append("file_number", "file_number");
    // formData.append("image_list", "file_number");

    const requestOptions = {
      method: "POST",
      headers: headersList,
      body: formData,
    }

    
    
    const url = import.meta.env.VITE_DAF_API+"/expensesheet/?entity_id="+entityId;
    try {
      const response = await fetch(url, requestOptions)
      if(response.status === 201) {
        handleGetAllExpenses();
        handleClearForm();
        setIsOpen(false);
        openNotification("SUCCESS", "Dépense initier avec success.");
        return;
      }
      openNotification("ECHEC", "Echec de creation de la dépense.");
      // alert("Echec de creation de la dépense");          
    } catch (error) {
      console.log(error);
      openNotification("ECHEC", "Une erreur s'est produite.");
    }
    // finally{
    //   setLoading(false);
    // }
  }

  const [searchValue, setSearchValue] = useState("");
  useEffect(()=>{
    if(searchValue.length > 0){
      const search = filteredData?.filter((item) => {
        const searchTextLower = searchValue.toLowerCase();
        // return Object.values(item)?.some((fieldValue) => fieldValue?.toString().toLowerCase().includes(searchTextLower)
      // );
      return(
        item?.reference_number?.toString().toLowerCase().includes(searchTextLower) ||
        item?.statut?.toString().toLowerCase().includes(searchTextLower) ||
        item?.payment_method?.toString().toLowerCase().includes(searchTextLower) ||
        item?.amount?.toString().toLowerCase().includes(searchTextLower) ||
        item?.transaction_number?.toString().toLowerCase().includes(searchTextLower) ||
        item?.uin_beneficiary?.toString().toLowerCase().includes(searchTextLower) ||
        beneficiaires?.find(employee => employee?.User.id == item?.employee_initiator)?.User?.name?.toLowerCase().includes(searchTextLower) ||
        (beneficiaires?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower) ? 
        beneficiaires?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower)
        :externalEntities.find(externalEntity=> externalEntity?.external_entity.id === item?.employee_controller)?.external_entity.name.toUpperCase()) ||
        entitySites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower) 
      )
    }
  )
      setExpenseDataSrc(search)
    }else{
      setExpenseDataSrc(filteredData);
    }
  }, [searchValue]);
  
  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };
  const formatExportData=(data)=>{
    return data?.map(item=>{
      const {id, department, employee_initiator, employee_controller, date_valid_controller, date_valid_employee_checkout, site, entity, time_created, is_active, operation_types, ...rest} = item

      return {
        ...rest,
        department: departments.find(dept=>dept?.dept?.id === department)?.displayName,
        employee_initiator: beneficiaires?.find(employee=>employee?.User.id === employee_initiator)?.User.name,
        employee_controller: beneficiaires?.find(employee=>employee?.User.id === employee_controller)?.User.name,
        date_valid_controller: date_valid_controller?.split("T")[0],
        date_valid_employee_checkout: date_valid_employee_checkout?.split("T")[0],
        time_created: time_created?.split("T")[0],
        site: entitySites?.find(item=>item?.id === site)?.name,
      }
    })
  }

  const handleExportToExcel= async(filteredData)=>{
    let headings = [
        'Num Ref', 'Type Recette',
         'Montant Total', 'Provenance',
         'Site', 'Entites', 
         'Description', 'Shift', 
         'NIU client', 'Numero transaction',
        'Bank account', 'Initiateur', 'Controlleur', 'Caissier',
        'Status', 'Method de paiment','Department', 
        'Date validation controlleur','Date validation caissier', 'Date de création']
    try{
      let url = import.meta.env.VITE_USER_API+"/file/export-to-excel";
      let bodyContent = {
        "data": filteredData,
        headings
      };
      // let response = await postData(url, bodyContent, true);
      axios.post(url, bodyContent)
      .then((response) => {
        console.log(response.data);
        // Create a URL for the Excel file
        // const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

        // // Create a link to download the Excel file
        const link = document.createElement('a');
        link.href = response.data.fileUrl;
        link.download = 'export.xlsx';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
      // console.log(response)
      // if(!requestError){
      //   const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      //   const link = document.querySelector('file-link');
      //   link.href = url;
      //   link.download = 'export.xlsx';
      //   link.click();
      //   // openNotification("SUCCESS","Fichier téléchargé avec success");
      // }
    }catch(e){
      console.log(e)
    }
  }

  const handleDataExport = async ()=>{
   try {
      if(expenseDataSrc.length < 1) {
        setIsLoading(true);
        let url = `${import.meta.env.VITE_DAF_API}/eexpensesheet/multi_criteria_search/`;
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }
        let data = {
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
        .done(async function( data ) {
          // Add data
          let formated = formatExportData(data)
          handleExportToExcel(formated);
          setIsLoading(false);
          openNotification("SUCCESS", "Fichier exporté");
          });
        }
        else{
          let formated = formatExportData(expenseDataSrc);
          handleExportToExcel(formated);
          setIsLoading(false);
          openNotification("SUCCESS", "Fichier exporté");
        }     
    } catch (error) {
        console.log("Error :", error);
        openNotification("ECHEC", "Une erreur est survenue lors de l'export");
        setIsLoading(false);
      }
  }

  useEffect(()=>{
    handleGetAllExpenses();
    handleGetSite();
    handleBenef();
    handleExternalEntity();
    handleGetBank();
    handleGetExternalBank();
    handleGetExpenseSummary();
    handleGetEntitySite();
    handleGetDepartments();
  } , []);

      return (
        <LoginLayout classNam="space-y-3">
            <a id="file-link"></a>
            <div className='flex justify-between'>
              <h3 className='py-2 bold'>FICHE DE DÉPENSE</h3>
              <div className='flex items-center text-sm'>
                <p> Total : <b className='bg-yellow-300 p-2 rounded-lg'>{expenseDataSrc?.length > 0 ? numberWithCommas(expenseTotal):"0"} XAF</b></p>
              </div>
            </div>
            <PageHeader>
              {/* <input type="search" className='text-sm w-full md:w-auto' placeholder='Rechercher une operation' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/> */}
              <div className='flex items-center space-x-2'>
              <input type="search" className='text-sm w-full md:w-auto' placeholder='Rechercher une recette' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
              <Popover content={<ExepenseSheetFilter setExpenseDataSrc={setExpenseDataSrc}/>} title="Filtre" trigger="click">
                <button className='w-auto text-sm text-white btn bg-green-500 p-2 rounded-lg shadow-sm flex items-center'>
                  <FunnelIcon className='text-white w-4 h-4'/>
                  Filtre
                </button>
              </Popover>
            </div>
            <div className='w-full md:w-auto space-x-2 flex '>
              {
                selectedRowKeys.length > 0 &&
                <>
                  <div className='flex items-center space-x-2'>
                    <p className='text-xs'><b>{selectedRowKeys.length}</b> Fiches selectionés</p>
                    <button className='text-xs bg-green-500 text-white p-2 rounded-lg shadow-md' onClick={()=>{
                      {
                        multipleAction === "VALIDER" ?
                          setOpenValidateModal(true)
                        :
                          setOpenRejectModal(true)
                      };
                      setIsMultipleSelect(true);
                      }}>Action</button>
                  </div>
                  <select className='text-xs' value={multipleAction} onChange={e=>setMultipleAction(e.target.value)}>
                    <option value="VALIDER">Valider</option>
                    <option value="REJETER">Rejeter</option>
                  </select>
                </>
              }
              <button className={`${isLoading?"bg-green-300 cursor-not-allowed":"bg-green-500"}  btn p-2 text-white rounded-lg shadow-sm text-sm`} onClick={handleDataExport}>
                {
                  isLoading ?"En cours...":"Export to excel"
                }
              </button>
              <VerifyPermissions
                expected={["coordinator","chief_financial_officer","operations_manager", "paymaster_general", "accountant"]}
                roles={userInfo?.role?.name}
                functions={userInfo?.Function?.name}
              >
                <button 
                  className={`text-white ${requestLoading? "bg-green-300" : "bg-green-500"}  p-2 rounded-lg shadow text-sm w-full md:w-auto`}
                  onClick={handleToggleOpenForm}
                >Initier une dépense</button>
              </VerifyPermissions>
            </div>
            </PageHeader>
            <div className='border-[1px] border-gray-100 w-full p-3 rounded-md mt-3 overflow-x-auto'>
              <Table
                dataSource={expenseDataSrc}
                rowSelection={{
                  ...rowSelection
                }}
                columns={expensesCol}
                // footer={()=>(
                  
                // )}
                scroll={{
                  x: 500,
                  y: "50vh"
                }}
              />
            </div>

            {/* Payment modes */}
            <Modal
              title={<p className='flex items-center space-x-2'>
                <ArrowTopRightOnSquareIcon className='text-gray-500 h-6 w-6'/>
                <span>Initier une dépense</span>
                </p>}
              centered
              open={isOpen}
              footer={<></>}
              onOk={handleToggleOpenForm}
              onCancel={handleToggleOpenForm}
            >
                <div className='flex flex-col space-y-3'>
                  <form onSubmit={()=>{}} className='flex flex-col space-y-3'>
                    <div className='flex flex-col'>
                      <label htmlFor="" className='text-xs'>Mode de paiement</label>
                      <select name="" id="" value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}>
                        <option value="ESPECES">Espèces</option>
                        <option value="CARTE">Carte</option>
                        <option value="VIREMENT">Virement</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="PAIMENT MOBILE">Paiment mobile</option>
                      </select>
                    </div>
                    {/* {
                      (paymentMode === "CARTE" || paymentMode === "CHEQUE" || paymentMode === "PAIMENT MOBILE") &&
                      <input type="text" name="" id="" className='' value={transactionNumber} onChange={e=>setTransactionNumber(e.target.value)} placeholder='Numéro de transaction'/>
                    } */}
                    { paymentMode === "VIREMENT" &&
                      <>
                        <div className='w-full flex flex-col md:flex-row items-center space-x-3'>
                          <div className='flex flex-col w-1/2'>
                            <label htmlFor="" className='text-xs'>Choisir la banque opérateur</label>
                            <select className="w-full" name="" id="" value={originAccount} onChange={e=>{
                                setOriginAccount(e.target.value);
                                // const account = bankEntity.filter(account => account?.bank.id === e.target.value);
                                // // setAccountNumbers(account[0]?.bank.bank_account);
                                // setDestinationAccount("");
                              }}>
                              {
                                bankEntity.map(bank=><option key={bank?.bank.id} value={bank?.bank.id}>{bank?.bank.sigle}</option>)
                              }
                            </select>
                          </div>
                          <div className='w-full md:w-1/2'>
                            <label htmlFor="" className='text-xs'>Numéro de compte :</label>
                            <select name="" id="" value={bankAccountNumber} onChange={e=>setBankAccountNumber(e.target.value)} className='w-full'>
                              {
                                bankAccountNumbers?.map(accountNumber => <option key={accountNumber?.id} value={accountNumber?.id}>{accountNumber?.account_number}</option>)
                              }
                            </select>
                          </div>
                        </div>
                      </>
                    }
                    <div className='w-full flex flex-col'>
                      <label htmlFor="" className='text-xs'>Choisir le site</label>
                      <select name="" id="" value={site} onChange={e=>setSite(e.target.value)}>
                        {
                          sites?.map(site=><option value={site?.id} key={site?.id}>{site?.name}</option>)
                        }
                      </select>
                    </div>
                    <div className='w-full flex items-center space-x-2'>
                      <div className='flex flex-col w-1/2'>
                        <label htmlFor="" className='text-xs'>Type de bénéficiaire</label>
                        <select name="" id="" className='w-full' value={recipientType} onChange={e=>{
                            setRecipientType(e.target.value);
                            if(recipientType === "PERSONNEPHYSIQUE"){
                              setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User.id);
                              handleBeneficiaryBankAccount(JSON.parse(localStorage.getItem("user"))?.User.id);
                            }else{
                              setRecipient(externalEntities[0]?.external_entity.id);
                              handleBeneficiaryBankAccount(externalEntities[0]?.external_entity.id);
                            }
                          }}>
                          <option value="PERSONNEPHYSIQUE">Personne physique</option>
                          <option value="PERSONNEMORALE">Personne morale</option>
                          {/* <option value="EMPLOYEES">Employées</option> */}
                        </select>
                      </div>
                      { 
                        (recipientType === "PERSONNEPHYSIQUE") ?
                        <div className='flex flex-col w-1/2'>
                          <label htmlFor="" className='text-xs'>Choisir le beneficiaire</label>
                          <select name="" id="" className='w-full' value={beneficiaire} onChange={e=>{
                                setBeneficiaire(e.target.value);
                                handleBeneficiaryBankAccount(e.target.value);
                              }
                            }>
                            {
                              beneficiaires.map(benef=><option value={benef?.User.id} key={benef?.User.id}>{benef?.User.name}</option>)
                            }
                          </select>
                        </div>
                        :
                        recipientType === "PERSONNEMORALE" &&
                        <div className='flex flex-col  w-1/2'>
                          <label htmlFor="" className='text-xs'>Choisir l'entité</label>
                          <select name="" id="" className='w-full' value={beneficiaire} onChange={e=>{
                              // setBeneficiaryBankAccount(beneficiairyBanks[0]?.bank.id)
                              setBeneficiaire(e.target.value);
                              handleBeneficiaryBankAccount(e.target.value);
                            }
                            }>
                            {
                              externalEntities.map(ext=><option value={ext?.external_entity.id} key={ext?.external_entity.id}>{ext?.external_entity.name}</option>)
                            }
                          </select>
                        </div>
                      }
                    </div>
                    {
                      paymentMode === "VIREMENT" &&
                      <div className='w-full flex flex-col md:flex-row items-center space-x-3'>
                          <div className='flex flex-col w-1/2'>
                            {/* <label htmlFor="" className='text-xs'>Choisir la banque du bénéficiaire</label>
                            <select className="w-full" value={beneficiaryBankAccount} onChange = {e=>setBeneficiaryBankAccount(e.target.value)}>
                              {
                                beneficiairyBanks.map(benefBank=><option key={benefBank?.bank.id} value={benefBank?.bank.id}>{benefBank?.bank.sigle}</option>)
                              }
                            </select> */}
                            <label htmlFor="" className='text-xs'>Choisir la banque du bénéficiaire</label>
                            <select value={beneficiaryBankAccount} onChange={e=>setBeneficiaryBankAccount(e.target.value)}>
                              {
                                beneficiairyBanks?.map(beneficiairy => <option key={beneficiairy?.bank.id} value={beneficiairy?.bank.id}>
                                  {
                                    beneficiairy?.bank.sigle
                                  }
                                </option>)
                              }
                            </select>
                          </div>
                          <div className='flex flex-col w-1/2'>
                            <label htmlFor="" className='text-xs'>Numéro du compte bénéficiaire</label>
                            <select name="" id="" value={beneficiaryBankAccountNumber} onChange={e=>setBeneficiaryBankAccountNumber(e.target.value)}>
                              {
                                beneficiaryBankAccountNumbers?.map(accountNumber => <option value={accountNumber?.id} key={accountNumber?.id}>{accountNumber?.account_number}</option>)
                              }
                            </select>
                            {/* <SuggestInput 
                              inputValue={beneficiaryBankAccountNumber} 
                              setInputValue={setBeneficiaryBankAccountNumber} 
                              dataList={beneficiaryBankAccount}
                              placeholder="Numéro du compte bénéficiaire"
                            /> */}
                          </div>
                        </div>
                    }
                    {/* {
                      ((montant > MAX_ALLOWED_AMOUNT && recipient === "" && recipientType === "PERSONNEPHYSIQUE" && paymentMode === "ESPECES") || montant > MAX_ALLOWED_AMOUNT_OTHERS) &&
                      <input type="text" placeholder='NIU'/>
                    } */}
                    <input type="number" className='' placeholder='Montant' value={montant} onChange={e=>setMontant(e.target.value)}/>
                    {/* <Dragger >
                      <p className="ant-upload-text text-xs flex items-center justify-center"> 
                        <PaperClipIcon className='text-gray-500 h-6 w-6'/>
                        Piece jointe
                      </p>
                    </Dragger> */}
                    <textarea name="" id="" cols="30" rows="5" placeholder='Description' value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                  </form>
                
                  <div className="flex justify-end">
                    <button className={`${loading ? "bg-green-300 cursor-not-allowed" : "bg-green-500" } btn text-white text-sm shadow flex items-center`} onClick={handleSubmitExpense} disabled={loading}> 
                      <span>
                        {loading ? "En cours de création":"Initier la dépense"}
                      </span>
                    </button>
                  </div>
                </div>
            </Modal>

            {/* Validation de la dépense */}
            <Modal
              title={<p>Valider la depense</p>}
              open={openValidateModal}
              onCancel={()=>setOpenValidateModal(false)}
              onOk={handleToggleOpenForm}
              footer={()=>{}}
            >
              <form className='flex flex-col w-full space-y-3' onSubmit={handleSubmitValidation}>
                <VerifyPermissions
                  expected={["operations_manager"]}
                  roles={userInfo?.role?.name}
                  functions={userInfo?.Function?.name}
                >
                  {/* { selectedExpense?.statut === "VALIDATION DEPARTMENT MANAGER" &&
                    <div className='flex flex-col w-full'>
                      <label htmlFor="" className='text-xs'>Type de validation</label>
                      <select name="" id="" value={typeValidation} onChange={e=>setTypeValidation(e.target.value)}>
                        <option value={true}>Urgent</option>
                        <option value={false}>Pas urgent</option>
                      </select>
                    </div>
                  } */}
                </VerifyPermissions>
                {
                  selectedExpense?.payment_method !== "ESPECES" &&
                    <VerifyPermissions
                  expected={["paymaster_general"]}
                  roles={userInfo?.role?.name}
                  functions={userInfo?.Function?.name}
                >
                  <input type="text" placeholder='Numéro de la transaction' value={transactionNumber} onChange={e=>setTransactionNumber(e.target.value)}/>
                    </VerifyPermissions>
                }

                <textarea name="" id="" placeholder='Observation' value={validationDescription} onChange={e=>setValidationDescription(e.target.value)}></textarea>
                <button className={`${requestLoading? "bg-green-300 cursor-not-allowed" :"bg-green-500"} btn  text-white`} disabled={requestLoading}>{requestLoading?"Validation encours...":"Valider"}</button>
              </form>
            </Modal>
              
            {/* Rejet de la dépense */}
            <Modal
              title={<p>Rejeter la depense</p>}
              open={openRejectModal}
              onCancel={()=>setOpenRejectModal(false)}
              onOk={handleToggleOpenForm}
              footer={()=>{}}
            >
              <form className='flex flex-col w-full space-y-3' onSubmit={handleRejectExpenses}>
                <textarea name="" id="" placeholder='Observation' value={rejectionDescription} onChange={e=>setRejectionDescription(e.target.value)}></textarea>
                <button className='btn bg-red-500 text-white'>Rejeter</button>
              </form>
            </Modal>

            {/* Formulaire du TPG */}
            <Modal
              title={<p className='flex items-center'><CalculatorIcon className='text-gray-500 h-6 w-6'/> Validation TPG</p>}
              // open={true}
              open={openTPGValidation}
              onCancel={()=>setOpenRejectModal(false)}
              onOk={handleToggleOpenForm}
              footer={()=>{}}
            >
              <form className='flex flex-col w-full space-y-3' onSubmit={handleRejectExpenses}>
                <input type="text" placeholder='Numéro de la transaction' value={observationTPG} onChange={e=>setObservationTPG(e.target.value)}/>
                <div className='flex items-center justify-end'>
                  <button className={`${requestLoading ? "bg-green-300" : "bg-green-500" } btn text-white text-sm shadow flex items-center`}>
                    
                    <span>{requestLoading ? "Validation en cours..." :"Validation"}</span>
                  </button>
                </div>
              </form>
            </Modal>

            {/* Observation du caissier */}
            <Modal
              title={<p className='flex'> <BanknotesIcon className='text-gray-500 h-6 w-6'/> Caissier</p>}
              open={openCashierValidation}
              onCancel={()=>setOpenRejectModal(false)}
              onOk={handleToggleOpenForm}
              footer={()=>{}}
            >
              <form className='flex flex-col w-full space-y-3' onSubmit={handleRejectExpenses}>
                {/* <input type="text" placeholder='Numéro de la transaction' /> */}
                <textarea name="" id="" placeholder='Observation caissier' value={cashierObservation} onChange={e=>setCashierObservation(e.target.value)}></textarea>
                <div className='flex items-center justify-end'>
                  <button className='btn bg-green-500 text-white'>Valider</button>
                </div>
              </form>
            </Modal>

            <Drawer
              title={<p>Détails de la recette</p>}
              placement={"bottom"}
              width={500}
              height={"90vh"}
              onClose={onClose}
              open={isOpenDrawer}
              extra={
                <Space>
                  <>
                    {/* <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-green-300'>
                      <CheckIcon className="h-5"/>
                      <span>Valider</span>
                    </button>
                    <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-red-300'>
                      <XMarkIcon className="h-5"/>
                      <span>Rejeter</span>
                    </button>
                    <button 
                      className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                      onClick={()=>{}}
                    >
                      <PencilIcon className="h-5"/>
                      <span>Modifier</span>
                    </button> */}
                    {
                      (selectedExpense?.statut?.includes("REJECT") || selectedExpense?.statut?.includes("EXECUTED")) ?<></>:
                        <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300' onClick={handleDeleteExpense}>
                        <TrashIcon className="h-5"/>
                        <span>Supprimer</span>
                      </button>
                    }
                  </>
                </Space>
              }
            >
              <div className='w-full h-full overflow-hidden flex justify-evenly space-x-2'>

                {/* Recette details */}
                <div className='w-1/2 bg-white border-[1px] rounded-lg overflow-y-auto p-3'>
                  
                  <div className='flex items-center space-x-5 space-y-3'>
                    <div>
                      <label htmlFor="">Date initiatier :</label>
                        <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                          <p>02/05/2024</p>
                        </div>
                    </div>
                    <div>
                      <label htmlFor="">Numéro de Références :</label>
                      <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                        <p>1001/05/24</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="">Controlleur :</label>
                      {isUpdateMode ? 
                      <div>
                        <select className='w-full' name="" id="" value={controller} onChange={e=>setController(e.target.value)}>
                          <option value="">Choisir le controleur</option>
                          <option value="">Controleur 1</option>
                          <option value="">Controleur 2</option>
                          <option value="">Controleur 3</option>
                        </select>
                      </div>
                      :
                      <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                        <p>Controlleur 1</p> 
                      </div>
                      }
                  </div>
                  <div>
                    <label htmlFor="">Provenence :</label>
                    {isUpdateMode ? 
                      <div>
                        <select className='w-full' name="" id="" value={origin} onChange={e=>setOrigin(e.target.value)}>
                          <option value="">Provenance</option>
                          <option value="">Règlement facture</option>
                          <option value="">Caution sur opération</option>
                          <option value="">Vente sur site</option>
                        </select>
                      </div>
                      :
                      <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                        <p>vente sur site</p> 
                      </div>
                      }
                  </div>
                  <div>
                    <label htmlFor="">Shift :</label>
                    {isUpdateMode ? 
                      <div>
                        <select className='w-full' name="" id="" value={shift} onChange={e=>setShift(e.target.value)}>
                          <option value="">Choisir le shift</option>
                          <option value="">6h-15h</option>
                          <option value="">15h-22h</option>
                          <option value="">22h-6h</option>
                        </select>
                      </div>
                      :
                      <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                        <p>15h-22h</p> 
                      </div>
                      }
                  </div>
                </div>

                {/* Operations details */}
                <div className='w-1/2 bg-white border-[1px] rounded-lg overflow-y-auto flex flex-col space-y-2 p-3'>
                
                  <Collapsible 
                    title={<p>Toutes les opérations</p>}
                    isOpenned={false}
                  >
                  </Collapsible>
                </div>

              </div>
            </Drawer>

        </LoginLayout>
      )
}

export default ExpensePage