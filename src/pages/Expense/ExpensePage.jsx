import React, { useContext, useEffect, useRef, useState } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import ExepenseSheetFilter from './ExepenseSheetFilter';
import { InboxOutlined } from '@ant-design/icons';
import { Table, Modal, Upload, Drawer, Space, Select, notification, Popover } from 'antd';
import { v4 as uuidV4 } from 'uuid';
import useFetch from '../../hooks/useFetch';
const { Dragger } = Upload;
import { FunnelIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, TrashIcon, EllipsisHorizontalIcon, PaperClipIcon, PlusIcon, EyeIcon, PencilIcon, CheckIcon, XMarkIcon, BanknotesIcon, CalculatorIcon, ArrowUpRightIcon, ArrowTopRightOnSquareIcon, PencilSquareIcon  } from '@heroicons/react/24/outline';
import { AUTHCONTEXT } from '../../context/AuthProvider';
import Collapsible from '../../components/Collapsible/Collapsible';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import SuggestInput from '../../components/SuggestInput/SuggestInput';
import $ from 'jquery';
import axios from 'axios';
import StateForm from '../../components/caisse/StateForm';
import CurrencyCuts from '../../components/caisse/CurrencyCuts';
import { v4 as uuid } from 'uuid'
import ManagementControllerForm from './ManagementControllerForm';
import DetailForm from '../../components/Expenses/DetailForm';


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
  getCheckboxProps: (record) => ({
    disabled: record.statut.includes("REJECT") || record.statut.includes("EXECUTED")
  }),
};

const fileList = [];

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
  const [managementControllerFormIsOpen, setManagementControllerFormIsOpen] = useState(false);

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
  const [beneficiaire, setBeneficiaire] = useState(JSON.parse(localStorage.getItem("user"))?.User?.id);
  const [montant, setMontant] = useState("");
  const [paymentMode, setPaymentMode] = useState("ESPECES");
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState("");
  const [fileNumber, setFileNumber] = useState("line1");
  const[recipientType, setRecipientType] = useState("PERSONNEPHYSIQUE");
  const[recipient, setRecipient] = useState("");

  const [operators, setOperators] = useState([]);
  const [operatorAccounts, setOperatorAccounts] = useState([]);
  const [operator, setOperator] = useState("");
  
  const [cut, setCut] = useState("");
  const [qty, setQty] = useState(0);
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [currencyCuts, setCurrencyCuts] = useState([]);
  const [cashDesks, setCashDesks] = useState([]);
  const [cashDesksId, setCashDesksId] = useState("");

  const handleGetCashDesks= async ()=>{
    let url = import.meta.env.VITE_USER_API+"/cash-desk";
    try {
      const response = await fetchData(url);
      if(response.error) return response.error;
      setCashDesks(response);
      // setCashDeskId(response[0]?.id)
    } catch (error) {
      
    }
  }

  const handleBeneficiaryBankAccount= async (id)=>{
    let url = import.meta.env.VITE_USER_API+`${recipientType === "PERSONNEPHYSIQUE" ?"/employees/" :"/external-entities/"}${id}/banks`;
    try {
        const response = await fetchData(url);
        if(response.error) return response.error;
        setBeneficiaryBankAccount(response[0]?.bank.id);
        setBeneficiairyBanks(response);
        setBeneficiaryBankAccountNumber(response[0]?.bankAccounts[0]?.account_number);
        setBeneficiaryBankAccountNumbers(response[0]?.bankAccounts);    
    } catch (error) {
        openNotification("ECHEC", "Impossible dóbtenir les informations des bank\n du bénéficiaire");
        console.error(error)
        return;
      }
}

  useEffect(()=>{
    if(recipientType === "PERSONNEPHYSIQUE"){
      setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User?.id);
      handleBeneficiaryBankAccount(JSON.parse(localStorage.getItem("user"))?.User?.id);
    }else if(recipientType === "PERSONNEMORALE"){
      setRecipient(externalEntities[0]?.id);
      handleBeneficiaryBankAccount(externalEntities[0]?.id);
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
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [mobileAccountsSuggestions, setMobileAccountsSuggestions] = useState([]);
  const [cutProduct, setCutProduct] = useState(0)
  const [budgetLines, setBudgetLines] = useState([]);
  const [budgetLine, setBudgetLine] = useState("");

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fileRef = useRef(null);

  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange =(event)=> {
    setFiles([...event.target.files]);
  };

  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  }

  const handleSubmitFiles = async () => {
    const formData = new FormData();
  
    files.forEach((file) => {
      formData.append('files', file);
    });
  
    if (files.length > 0) {
      try {
        const response = await axios.post(import.meta.env.VITE_USER_API + '/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const fileData = await response?.data?.map(file => file.url);
        setUploadedFiles(fileData);
      } catch (error) {
        console.log(error);
        openNotification("ECHEC", "Echec lors de la sauvegarde du fichier");
      }
    }
  };

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
  
  
  const [cashDeskCuts, setCashDeskCuts] = useState([]);
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

  const handleGetExpenseSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/expensesheet/summary_by_year/?year="+actualYear+"&entity_id="+entityId);
      if (response && response?.annual_sums) {
        setExpenseTotal(response?.annual_sums[0]?.total_amount)
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
    let updatedCurrencyCuts = await cashDeskCuts.map((item) => {
      let { id, ...rest } = item;
      return { ...rest };
    });

    let totalSum = updatedCurrencyCuts.reduce((totalSum, item)=>{
      return totalSum + item?.total_amount
    }, 0);

    if(isMultipleSelect){
      selectedRowKeys?.forEach(async (rowKey)=>{

        let entityId = JSON.parse(localStorage.getItem("user"))?.entity?.id;
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+rowKey+"/?entity_id="+entityId;
        let data ={
          // is_urgent:typeValidation,
          is_urgent:false,
          description:validationDescription,
          transaction_number: transactionNumber,
          employee_initiator: beneficiaire,
          denomination_cash_cut_expenses: cashDeskCuts? updatedCurrencyCuts : []
        }
        try {
          const response = await updateData(url, data, true);
          setValidationDescription("");
          setTransactionNumber("");
          setPaymentMode("ESPECES");
          setCashDesksId("");
          setTypeValidation(false);
          setOpenValidateModal(false);
          handleGetAllExpenses();
          setCashDeskCuts([]);
          openNotification("SUCCESS", "Fiche de dépense validé");
          return;
        } catch (error) {
          openNotification("ECHEC", "Echec de validation");      
        }
      })
    }
    else{
      let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/?entity_id="+entityId;
        if(totalSum != selectedExpense?.amount && selectedExpense?.it_is_a_cash_desk_movement){
          openNotification("ECHEC", "Montant doit être égale au montant total");
          return;
        }
        let data ={
          // is_urgent:typeValidation,
          is_urgent:false,
          description:validationDescription,
          transaction_number: transactionNumber,
          employee_initiator: beneficiaire,
          denomination_cash_cut_expenses: cashDeskCuts? updatedCurrencyCuts : [],
          cash_desk_number: cashDesksId
        }
        try {
          const response = await updateData(url, data, true);
          if(!requestError){
            setValidationDescription("");
            setTransactionNumber("");
            setCashDesksId("");
            setPaymentMode("ESPECES");
            setTypeValidation(false);
            setOpenValidateModal(false);  
            handleGetAllExpenses();
            setCashDeskCuts([]);
            openNotification("SUCCESS", "Fiche de dépense validé");
            return;
          }
        } catch (error) {
          openNotification("ECHEC", "Echec de validation");      
        }
    }
  }

  const handleGetCurrencies=async()=>{
    try {
      let response = await fetchData(import.meta.env.VITE_USER_API+"/currencies");
      if(response.error) return response.error;
      setCurrencies(response);
      setCurrency(response[0]?.code);
      setCut(response[0]?.currencyCuts[0]?.value)
      setCurrencyCuts(response[0]?.currencyCuts)
    } catch (error) {
      console.log(error)
    }
  }

  
  const handleClearCutsForm =()=>{
    // setCut(currency?.currencyCuts[0]?.value);
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
      setMontant(cutsTotal);
     
      handleClearCutsForm();
    }else{
      openNotification("Echec", "Choisir la coupure et la qté");
    }
  }

  const handleRejectExpenses = async (e)=>{
    e.preventDefault();
    let entityId = JSON.parse(localStorage.getItem("user"))?.entity?.id
    let url = 
    isMultipleSelect ?
    import.meta.env.VITE_DAF_API+"/expensesheet/bulk_rejection/?entity_id="+entityId
    :
    import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/rejection/?entity_id="+entityId
    const data=
    isMultipleSelect ?
    {
      is_urgent:false,
      description:rejectionDescription,
      pk_list: selectedRowKeys,
      employee_initiator: JSON.parse(localStorage.getItem("user"))?.id
    }
    :
    {
      is_urgent:false,
      description:rejectionDescription,
      // payment_method: "ESPECE",
      employee_initiator: JSON.parse(localStorage.getItem("user"))?.id
    }
    try {
      const response = await updateData(url, data, true);
      setRejectionDescription("");
      setOpenRejectModal(false);
      handleGetAllExpenses();
      openNotification("SUCCESS", "Fiche de dépense rejeté");
      return;
    } catch (error) {
      openNotification("ECHEC", "Echec du rejet de la fiche"); 
    }

  }

  const handleGetBudgetLines=async ()=>{
    let url =`${import.meta.env.VITE_BUDGET_API}/sub_lines/`;
    try{
      let response = await fetchData(url);
      setBudgetLines(response?.results);
      setFileNumber(response?.results[0]?.id);
    }catch(error){
      console.error("BUDGET_LINES_ERR", error)
    }
  }

  const handleSubmitBudgetLines=async ()=>{
    try{
      if(fileNumber === "" || montant === ""){
        openNotification("ECHEC", "Ligne budgetaire et montant son requis");
        return;
      }
      let url = `${import.meta.env.VITE_BUDGET_API}/update-expense/`;
      let data = {
        id: fileNumber,
        amount: montant
      }
      let response = await postData(url, data , true);
      if(requestError){
        openNotification("ECHEC", "Erreur sur la ligne budgetaire");
        return false
      }
      return true;
    }catch(error){
      console.error("BUDGET_LINES", error)
      throw error
    };
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
        const site = entitySites?.find(site=>site?.id === text)
        return <>{site?.name != undefined? highlightText(site?.name) :highlightText(text) }</>
      }
    },
    {
      title: 'Initiateur',
      dataIndex: 'employee_initiator',
      key: 'employee_initiator',
      width:  "200px",
      render: (text, record)=> {
        return beneficiaires.find(benef=> benef?.User?.id === text)?.User?.name.toUpperCase() ?  
        highlightText(beneficiaires.find(benef=> benef?.User?.id === text)?.User?.name?.toUpperCase()) : 
        highlightText(externalEntities.find(externalEntity=> externalEntity?.external_entity?.id === text)?.external_entity?.name?.toUpperCase());
      }
    },
    {
      title: 'Beneficiaire',
      dataIndex: 'employee_beneficiary',
      key: 'employee_beneficiary',
      width:  "200px",
      render: (text, record)=> 
        {
          let entityName = JSON.parse(localStorage.getItem("user"))?.entity?.Sigle;
            if (beneficiaires.find(benef=> benef?.User?.id === text) != undefined){
              return highlightText(beneficiaires.find(benef=> benef?.User?.id === text)?.User?.name?.toUpperCase())
            }
            if(entityId == text) {
              return highlightText(entityName)
            };

            if (externalEntities.find(externalEntity=> externalEntity?.external_entity?.id === text)!= undefined) {
              return highlightText(externalEntities.find(externalEntity=> externalEntity?.external_entity?.id === text)?.external_entity?.name?.toUpperCase());
            }
            return highlightText("N/A")
        }
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
      title: 'Avis controleur conf.',
      dataIndex: 'is_an_favorable_management_controller',
      key: 'is_an_favorable_management_controller',
      width:  "200px",
      render: (isFavorable) => {
        let backgroundColor = '';
        if (isFavorable === null) {
          backgroundColor = 'bg-yellow-50';
        } else if (isFavorable === false) {
          backgroundColor = 'bg-red-200';
        } else {
          backgroundColor = 'bg-white';
        }
        return (
          <div className={`px-4 py-2 rounded ${backgroundColor} text-xs`}>
            {isFavorable === null
              ? 'En attente'
              : isFavorable === false
              ? 'Non Favorable'
              : 'Favorable'}
          </div>
        );
      }
    },
    {
      title: 'Status',
      width:  "200px",
      render:(text, record)=>
      (
        <div className='flex space-x-2'>
          <>
            {
              departments.find(department=> department?.id === record.department)?.name?.includes("daf") ?
              <>
              {
                !record?.is_urgent ?
                <>
                  <div className={`${((record?.statut === "VALIDATION GENERAL MANAGEMENT" || record?.statut === "VALIDATION PRESIDENT" ||  record?.statut == "EXECUTED" ||  record?.statut == "IN_DISBURSEMENT") || (record?.date_valid_budgetary_department != null && record?.statut != "REJECT FINANCIAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF</div>
                  <div className={`${((record?.statut === "VALIDATION PRESIDENT" ||  record?.statut == "EXECUTED" ||  record?.statut == "IN_DISBURSEMENT") || (record?.date_valid_general_director != null && record?.statut != "REJECT GENERAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DG</div>
                  <div className={`${((record?.statut == "EXECUTED" ||  record?.statut == "IN_DISBURSEMENT") || (record?.date_valid_president != null && record?.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>PRE</div>
                  <div className={`${((record?.statut == "EXECUTED") || (record?.date_valid_rop != null && record?.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>TPG</div>
                </>:
                <div 
                className={`${((record?.statut === "VALIDATION FINANCIAL MANAGEMENT"|| record?.statut === "VALIDATION GENERAL MANAGEMENT" || record?.statut === "VALIDATION PRESIDENT" ||  record?.statut == "EXECUTED" ||  record?.statut == "IN_DISBURSEMENT") || (record?.date_valid_manager_department != null && record?.statut != "REJECT DEPARTMENT MANAGER")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF
              </div>
              }
              </>
              :
              <>
                <div 
                  className={`${((record?.statut === "VALIDATION FINANCIAL MANAGEMENT"|| record?.statut === "VALIDATION GENERAL MANAGEMENT" || record?.statut === "VALIDATION PRESIDENT" ||  record?.statut == "EXECUTED" ||  record?.statut == "IN_DISBURSEMENT") || (record?.date_valid_manager_department != null && record?.statut != "REJECT DEPARTMENT MANAGER")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DEX
                </div>
                {
                  !record.is_urgent &&
                  <>
                    <div className={`${((record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_budgetary_department != null && record.statut != "REJECT FINANCIAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF</div>
                    <div className={`${((record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_general_director != null && record.statut != "REJECT GENERAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DG</div>
                    <div className={`${((record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_president != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>PRE</div>
                    <div className={`${((record.statut == "EXECUTED") || (record.date_valid_rop != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>TPG</div>
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
              (
                userRole == "management_controller" 
                && (record.is_an_favorable_management_controller == null)
              )?
              <PencilSquareIcon onClick={()=>{
                setManagementControllerFormIsOpen(true);
                setSelectedExpense(record)
              }} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />:
              (userFunction == "operations_manager" 
                && record.date_valid_manager_department == null 
                && record.statut != "IN_DISBURSEMENT"
                && record.is_an_favorable_management_controller != null
              ) ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
              </>
              :
              ((
                userRole == "chief_financial_officer" 
                && record.date_valid_manager_department) 
                && record.date_valid_budgetary_department == null 
                && record.statut != "IN_DISBURSEMENT"
                && record.is_an_favorable_management_controller != null
              ) ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
              </>
              :
              ((
                userRole == "general_manager" 
                && record.date_valid_budgetary_department) 
                && record.date_valid_general_director === null 
                && record.statut != "IN_DISBURSEMENT"
                && record.is_an_favorable_management_controller != null
              ) ?
              <>
                <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
              </>
              :
              ((
                userRole == "president" 
                && record.date_valid_general_director) 
                && record.date_valid_president == null 
                && record.statut != "IN_DISBURSEMENT"
                && record.is_an_favorable_management_controller != null
              ) ?
                <>
                  <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                  <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
                </>
              :
              ((
                userRole == "paymaster_general" 
                && record.date_valid_president ) 
                && record.date_valid_rop == null 
                && record.statut == "IN_DISBURSEMENT"
                && record.is_an_favorable_management_controller != null
              ) ?
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
    setIsOpenDrawer(true);
    setSelectedExpense(record);
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
    if(response.error) return response.error;
    setSite(response[0]?.id);
    setSites(response);
  }
  
  const handleGetDepartments=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/departments");
    if(response.error) return response.error;
    setDepartements(response);
  }
  
  const handleGetEntitySite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
    if(response.error) return response.error;
    setEntitySites(response);
  }

  const handleBenef = async()=>{
    try {
      const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees");
      if(benef.error) return benef.error;
      setBeneficiaires(benef);
      setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User.id)
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleExternalEntity = async()=>{
    const external = await fetchData(import.meta.env.VITE_USER_API+"/external-entities");
    if(external.error) return external.error;
    let result = external;
    console.log(result);
    setExternalEntities(result);
  }

  const handleGetBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity-banks");
    if(banks.error) return banks.error;
    setBankEntity(banks);
    setBankAccountNumber(banks[0]?.bankAccounts[0]?.id);
    setBankAccountNumbers(banks[0]?.bankAccounts);
  }

  useEffect(()=>{
    if(paymentMode != "CHEQUE"){
      // setExternalEntityBankAccountNumbers(beneficiairyBanks[0]?.bankAccounts);
      const selectedBank = bankEntity.find(bank => bank.bank.id === originAccount);
      setBankAccountNumber(selectedBank?.bankAccounts[0]?.id);
      setBankAccountNumbers(selectedBank?.bankAccounts);
      return;
  }
  }, [originAccount])

  useEffect(()=>{
    if(paymentMode == "VIREMENT"){
        // setExternalEntityBankAccountNumbers(beneficiairyBanks[0]?.bankAccounts);
        return;
    }
    if(paymentMode == "PAIMENT MOBILE"){
      setBeneficiaryBankAccountNumber("");
      return;
  }
    setQty(0);
    setCutProduct(0);
    setCashDeskCuts([]);
    setBankAccountNumber("");
    setTransactionNumber("");
}, [paymentMode]);

  const handleGetExternalBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/external-entities");
    if(banks.error) return banks.error;
    setBankExternalEntity(banks);
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
    setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User?.id);
    // setUploadedFiles([]);
    setFileNumber("")
    setFiles([]);
    setMontant("");
    setDescription("");
    setFiles([]);
  }

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    let fileList = [];

    const fileFormData = new FormData();
  
    files.forEach((file) => {
      fileFormData.append('files', file);
    });
  
    if (files.length > 0) {
      try {
        const response = await axios.post(import.meta.env.VITE_USER_API + '/file/upload', fileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if(response.status === 200){
          const fileData = await response?.data?.map(file => file.url);
          fileList = await fileData;
          await setUploadedFiles(fileList);
          // await setFiles([]);
          // await setSelectedFiles("")
        }
        
      } catch (error) {
        console.log(error);
        openNotification("ECHEC", "Echec lors de la sauvegarde du fichier");
      }
    }

    const headersList = new Headers();
  
    // remove ids form the currency cuts
    let updatedCurrencyCuts = cashDeskCuts.map((item) => {
      let { id, ...rest } = item;
      return { ...rest };
    });

    headersList.append(
      "Authorization", "Bearer " + localStorage.getItem("token")
    );
    const formData = new FormData();
    formData.append("site", site);
    formData.append("employee_beneficiary", beneficiaire);
    formData.append("employee_initiator", JSON.parse(localStorage.getItem("user"))?.User.id);
    formData.append("payment_method", paymentMode);
    formData.append("amount", montant);
    formData.append("beneficiary_bank_account_number", beneficiaryBankAccountNumber);
    formData.append("bank_account_number", bankAccountNumber);
    formData.append("description", description);
    formData.append("file_number", fileNumber);
    formData.append("entity", entityId);
    formData.append("transaction_number", transactionNumber);
    formData.append("denomination_cash_cut_expenses", JSON.stringify(updatedCurrencyCuts));
    
    formData.append("image_list", `[${fileList}]`);
  
    const requestOptions = {
      method: "POST",
      headers: headersList,
      body: formData,
    };
    
    try {
      handleSubmitBudgetLines();
      const url = import.meta.env.VITE_DAF_API + "/expensesheet/?entity_id=" + entityId;
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        openNotification("ECHEC", "Echec de creation de la dépense.");
        return;
      }
      handleGetAllExpenses();
      handleClearForm();
      setCashDeskCuts([]);
      setIsOpen(false);
      openNotification("SUCCESS", "Dépense initier avec success.");
      // Clear the file input
      setFiles([]);
      return;
    } catch (error) {
      console.log(error);
      openNotification("ECHEC", "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };
  

  const [searchValue, setSearchValue] = useState("");
  
  useEffect(()=>{
    if(searchValue.length > 0){
      const search = filteredData?.filter((item) => {
        const searchTextLower = searchValue.toLowerCase();
        
      return(
        item?.reference_number?.toString().toLowerCase().includes(searchTextLower) ||
        item?.statut?.toString().toLowerCase().includes(searchTextLower) ||
        item?.payment_method?.toString().toLowerCase().includes(searchTextLower) ||
        item?.amount?.toString().toLowerCase().includes(searchTextLower) ||
        item?.transaction_number?.toString().toLowerCase().includes(searchTextLower) ||
        item?.uin_beneficiary?.toString().toLowerCase().includes(searchTextLower) ||
        externalEntities?.find(externalEntity=> externalEntity?.external_entity.id == item?.employee_beneficiary)?.external_entity.name.toLowerCase().includes(searchTextLower)||
        beneficiaires?.find(employee => employee?.User.id == item?.employee_initiator)?.User?.name?.toLowerCase().includes(searchTextLower) ||
        beneficiaires?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower) ||
        entitySites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower) ||
        departments?.find(department => department?.id == item?.department)?.displayName.toLowerCase().includes(searchTextLower) 
      )
    }
  )
      setExpenseDataSrc(search)
    }else{
      setExpenseDataSrc(filteredData);
    }
  }, [searchValue]);
  
  useEffect(()=>{
    setCutProduct(+cut* +qty);
  },[cut, qty]);

  useEffect(()=>{
    if(currencyCuts?.length < 1){
      setCutProduct(0)
    }
  }, [currencyCuts])

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  }

  const formatExportData=(data)=>{
    // let headings = [
    //   "Numéro de référence", "Site", "Initiateur", "Beneficiaire", "Departement", "Method de paiment", "Montant", "Status"]
    return data?.map(item=>{
      const {
          reference_number, 
          site, 
          employee_initiator, 
          employee_beneficiary, 
          manager_department,
          budgetary_department,
          general_director,
          president,
          rop,
          description,
          amount, 
          payment_method, 
          transaction_number,
          uin_beneficiary,
          cash_desk_number,
          bank_account_number,
          it_is_a_cash_desk_movement,
          observation_manager_department,
          observation_budgetary_department,
          observation_general_director,
          observation_president,
          date_valid_manager_department,
          date_valid_budgetary_department,
          date_valid_general_director,
          date_valid_president,
          date_valid_rop,
          department, 
          statut,
          time_created
        } = item

      return {
        reference_number: reference_number || "N/A",
        site: entitySites?.find(item=>item?.id === site)?.name || "N/A",
        employee_initiator: beneficiaires?.find(employee=>employee?.User.id === employee_initiator)?.User.name || "N/A",
        employee_beneficiary: beneficiaires?.find(employee=>employee?.User.id === employee_beneficiary)?.User.name || "N/A",
        manager_department: beneficiaires?.find(employee=>employee?.User.id === manager_department)?.User.name || "N/A",
        budgetary_department: beneficiaires?.find(employee=>employee?.User.id === budgetary_department)?.User.name || "N/A",
        general_director: beneficiaires?.find(employee=>employee?.User.id === general_director)?.User.name || "N/A",
        president: beneficiaires?.find(employee=>employee?.User.id === president)?.User.name || "N/A",
        rop:beneficiaires?.find(employee=>employee?.User.id === rop)?.User.name || "N/A",
        description: description || "N/A",
        amount: amount || 0,
        payment_method: payment_method || "N/A",
        transaction_number: transaction_number || "N/A",
        uin_beneficiary: uin_beneficiary || "N/A",
        cash_desk_number: cash_desk_number || "N/A",
        bank_account_number: bank_account_number || "N/A",
        it_is_a_cash_desk_movement:it_is_a_cash_desk_movement ||"N/A",
        observation_manager_department:observation_manager_department ||"N/A",
        observation_budgetary_department:observation_budgetary_department ||"N/A",
        observation_general_director:observation_general_director ||"N/A",
        observation_president:observation_president ||"N/A",
        date_valid_manager_department:date_valid_manager_department?.split("T")[0] ||"N/A",
        date_valid_budgetary_department:date_valid_budgetary_department?.split("T")[0] ||"N/A",
        date_valid_general_director:date_valid_general_director?.split("T")[0] ||"N/A",
        date_valid_president:date_valid_president?.split("T")[0] ||"N/A",
        date_valid_rop:date_valid_rop?.split("T")[0] ||"N/A",
        department: departments.find(dept=>dept?.dept?.id === department)?.displayName || "N/A",
        statut:statut || "N/A",
        time_created: time_created
      }
    })
  }

  const handleExportToExcel= async(filteredData)=>{
    let headings = [
      "Numéro de référence", "Site", "Initiateur", "Beneficiaire", "Chef de département", "Directeur Affaires Financiaire", "Directeur General", "President(e)", "TPG", "Description", "Montant total", "Methode de paiment", "Numéro de transaction", "NIU bénéficiaire", "Numéro de caisse", "Numéro du compte banquaire", "Appro", "Observation chef de département", "Observation DAF", "Observation DG", "Observation président(e)", "Date validation Chef de département", "Date validation DAF",  "Date validation DG",  "Date validation président", "Date validation TPG", "Department", "Statut", "Date de creation"]
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
        const link = document.createElement('a');
        link.href = response.data.fileUrl;
        link.download = 'export.xlsx';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
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
  const handleMobileSuggestions = (e) =>{
    setBeneficiaryBankAccountNumber(e.target.value);
    let suggestions = operatorAccounts?.filter(account => account?.name?.toLowerCase()?.includes(e.target.value.toLowerCase()));
    setMobileAccountsSuggestions(suggestions);
    if(suggestions.length > 0){
        setShowMobileSuggestions(true);
        return;
    }
    setShowMobileSuggestions(false);
}

  /**
   * Handle operator onChange
   */

  const handleSelectOperator = async (e) => {
    setOperator(e.target.value);
    setBeneficiaryBankAccountNumber("");
    getOperatorAccounts(e.target.value);
  };


  /**
   * Get all operators
   */
  const getOperators = async () =>{
    let url = import.meta.env.VITE_USER_API+"/operators";
    try {
        let response = await fetchData(url);
        if(response.error) return response.error;
        setOperators(response);
        setOperator(response[0]?.id);
    } catch (error) {
        console.warn(error.message);
    }
}

/**
 * Get Operator accounts
 */
const getOperatorAccounts = async (operator) =>{
    let id = operator;
    let url = `${import.meta.env.VITE_USER_API}/operators/${id}/accounts`;
    try {
        let response = await fetchData(url);
        if(response.error) return response.error;
        setOperatorAccounts(response);
    } catch (error) {
        console.warn(error.message);
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
    handleGetCashDesks();
    handleGetCurrencies();
    handleGetBudgetLines();
    getOperators();
  } , []);

      return (
        <LoginLayout classNam="space-y-3">
            <a id="file-link"></a>
            <div className='flex justify-between'>
              <h3 className='py-2 bold'>DÉPENSES</h3>
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
                  <VerifyPermissions
                      expected={["accountant", 
                          "department_manager", 
                          "general_manager", 
                          "president", 
                          "operations_manager", 
                          "paymaster_general",
                          "chief_financial_officer",
                          "cashier",
                          "rop",
                      ]}
                      roles={userInfo?.role?.name}
                      functions={userInfo?.Function?.name}
                  >
                  <>
                  {
                  selectedRowKeys?.length > 0 &&
                  <>
                    <div className='flex items-center space-x-2'>
                      <p className='text-xs'><b>{selectedRowKeys?.length}</b> Fiches selectionés</p>
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
                  </>
                  </VerifyPermissions>
              }
              { expenseDataSrc?.length > 0 &&
                <button className={`${isLoading?"bg-green-300 cursor-not-allowed":"bg-green-500"}  btn p-2 text-white rounded-lg shadow-sm text-sm`} onClick={handleDataExport}>
                {
                  isLoading ?"En cours...":"Export to excel"
                }
              </button>
              }
              <VerifyPermissions
                expected={["rop", "accountant"]}
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
                loading={requestLoading}
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
                      <select name="" id="" value={paymentMode} onChange={e=>{
                        if(paymentMode != "VIREMENT"){
                          setBankAccountNumber("")
                        }
                        setFiles([]);
                        setSelectedFiles("");
                        setPaymentMode(e.target.value)
                        }}>
                        <option value="ESPECES">Espèces</option>
                        <option value="CARTE">Carte</option>
                        <option value="VIREMENT">Virement</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="PAIMENT MOBILE">Paiment mobile</option>
                      </select>
                    </div>
                    { 
                    paymentMode === "VIREMENT" &&
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
                                bankEntity?.length > 0 &&
                                bankEntity.map(bank=><option key={bank?.bank?.id} value={bank?.bank?.id}>{bank?.bank?.sigle}</option>)
                              }
                            </select>
                          </div>
                          <div className='w-full md:w-1/2'>
                            <label htmlFor="" className='text-xs'>Numéro de compte :</label>
                            <select name="" id="" value={bankAccountNumber} onChange={e=>setBankAccountNumber(e.target.value)} className='w-full'>
                              {
                                bankAccountNumbers?.length > 0 &&
                                bankAccountNumbers?.map(accountNumber => <option key={accountNumber?.account_number} value={accountNumber?.account_number}>{accountNumber?.account_number}</option>)
                              }
                            </select>
                          </div>
                        </div>
                      </>
                    }
                    {
                        (paymentMode === "CARTE") &&
                        <div className='w-full flex space-x-2'>
                          <div className='w-full flex flex-col md:flex-row items-center space-x-3'>
                            <div className='flex flex-col w-1/2'>
                              <label htmlFor="" className='text-xs'>Choisir la banque opérateur</label>
                              <select className="w-full" name="" id="" value={originAccount} onChange={e=>{
                                  setOriginAccount(e.target.value);
                                  const account = bankEntity.filter(account => account?.bank.id === e.target.value);
                                  setBankAccountNumbers(account[0]?.bank.bank_account);
                                  setDestinationAccount("");
                                }}>
                                {
                                  bankEntity?.length > 0 &&
                                  bankEntity.map(bank=><option key={bank?.bank?.id} value={bank?.bank?.id}>{bank?.bank?.sigle}</option>)
                                }
                              </select>
                            </div>
                            <div className='w-full md:w-1/2'>
                              <label htmlFor="" className='text-xs'>Numéro de la carte :</label>
                              <select value={bankAccountNumber} onChange={e=>setBankAccountNumber(e.target.value)} className='w-full'>
                                {
                                  bankAccountNumbers?.length > 0 &&
                                  bankAccountNumbers?.map(accountNumber => <option key={accountNumber?.cardNumber} value={accountNumber?.cardNumber}>{accountNumber?.cardNumber}</option>)
                                }
                              </select>
                            </div>
                          </div>
                        </div>
                    }
                    {
                        (paymentMode === "CHEQUE") &&
                        <div className='w-full flex space-x-2'>
                          <div className='w-full flex flex-col md:flex-row items-center space-x-3'>
                            <div className='flex flex-col w-1/2'>
                              <label htmlFor="" className='text-xs'>Choisir la banque opérateur</label>
                              <select className="w-full" name="" id="" value={originAccount} onChange={e=>{
                                  setOriginAccount(e.target.value);
                                  const account = bankEntity.filter(account => account?.bank?.id === e.target.value);
                                  setBankAccountNumbers(account[0]?.bank?.bank_account);
                                  setDestinationAccount("");
                                }}>
                                {
                                  bankEntity?.length > 0 &&
                                  bankEntity.map(bank=><option key={bank?.bank?.id} value={bank?.bank?.id}>{bank?.bank?.sigle}</option>)
                                }
                              </select>
                            </div>
                            <div className='w-full md:w-1/2'>
                              <label htmlFor="" className='text-xs'>Numéro du cheque :</label>
                              <input type="text"value={bankAccountNumber} onChange={e=>setBankAccountNumber(e.target.value)} className='w-full'/>
                            </div>
                          </div>
                        </div>
                    }
                    {
                      (paymentMode === "PAIMENT MOBILE") &&
                      <div className='w-full flex flex-col md:flex-row space-x-2 items-end'>
                        <div className='w-full md:w-1/2 flex flex-col'>
                            <label htmlFor="" className='text-xs'>Choisir l'opérateur :</label>
                            <select value={operator} onChange={handleSelectOperator}>
                                {
                                    operators?.length > 0 &&
                                    operators.map(operator => <option value={operator?.id}>{operator?.displayName}</option>)
                                }
                            </select>
                        </div>
                        <div className='w-full md:w-1/2 relative'>
                          <label htmlFor="" className="text-xs">Numéro du compte :</label>
                          <input type="text" className='w-full' value={beneficiaryBankAccountNumber} onChange={handleMobileSuggestions}/>
                          {   
                            beneficiaryBankAccountNumber &&
                            <ul className={`absolute top-15 bg-white shadow-sm rounded-lg w-full z-100 overflow-y-scroll max-h-[60px]`}>
                                {
                                    (showMobileSuggestions) &&
                                    mobileAccountsSuggestions.map(account=>
                                    <li 
                                        className='text-xs  hover:bg-gray-100 p-2 w-full' 
                                        onClick={()=>{
                                            setBeneficiaryBankAccountNumber(account?.name);
                                            setShowMobileSuggestions(false);
                                        }}
                                    >
                                        {`${account?.name}`}
                                    </li>)
                                }
                            </ul>
                          }
                        </div>
                      </div>
                    }
                    {
                      (paymentMode === "CARTE" || paymentMode === "PAIMENT MOBILE") &&
                      <input type="text" name="" id="" className='' value={transactionNumber} onChange={e=>setTransactionNumber(e.target.value)} placeholder='Numéro de transaction'/>
                    }

                    <div className='flex flex-col'>
                      <label htmlFor="" className='text-xs'>Ligne budgetaire :</label>
                      <select className='w-full' value={fileNumber} onChange={e=>setFileNumber(e.target.value)}>
                        {/* {
                          budgetLines?.length > 0 &&
                          budgetLines.map(line=><option value={line?.id} key={line?.id}>{line?.name}</option>)
                        } */}
                        <option value="line1">Ligne budgetaire 1</option>
                        <option value="line2">Ligne budgetaire 2</option>
                        <option value="line3">Ligne budgetaire 3</option>
                      </select>
                    </div>

                    {/* Files selected */}
                    <div className='w-full flex flex-col'>
                      <input type="file" multiple onChange={handleFileChange} value={selectedFiles} accept="image/*,.pdf, .doc, .docx, .xlxs, .xls"/>
                      <p className="text-xs">Selected Files</p>
                      <ul className="flex flex-wrap space-x-2 space-y-2">
                        {
                          files.map((file, index) => (
                            <li key={index} className="p-1 bg-gray-200 rounded-full text-xs flex space-x-2 items-center">
                              <span className="text-xs">{file.name}</span>
                              <XMarkIcon  className="text-red-500 text-xs w-3 h-3 cursor-pointer" onClick={() => handleFileRemove(index)}/>
                            </li>
                          ))
                        }
                      </ul>
                    </div>

                    <div className='w-full flex flex-col'>
                      <label htmlFor="" className='text-xs'>Choisir le site</label>
                      <select name="" id="" value={site} onChange={e=>setSite(e.target.value)}>
                        {
                          sites?.length > 0 &&
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
                              setBeneficiaire(JSON.parse(localStorage.getItem("user"))?.User?.id);
                              handleBeneficiaryBankAccount(JSON.parse(localStorage.getItem("user"))?.User?.id);
                            }else{
                              setRecipient(externalEntities[0]?.id);
                              handleBeneficiaryBankAccount(externalEntities[0]?.id);
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
                              beneficiaires.length > 0 &&
                              beneficiaires.map(benef=><option value={benef?.User?.id} key={benef?.User?.id}>{benef?.User?.name}</option>)
                            }
                          </select>
                        </div>
                        :
                        recipientType === "PERSONNEMORALE" &&
                        <div className='flex flex-col  w-1/2'>
                          <label htmlFor="" className='text-xs'>Choisir l'entité</label>
                          <select name="" id="" className='w-full' value={beneficiaire} onChange={e=>{
                              setBeneficiaryBankAccount(beneficiairyBanks[0]?.bank.id)
                              setBeneficiaire(e.target.value);
                              handleBeneficiaryBankAccount(e.target.value);
                            }
                            }>
                            {
                              externalEntities?.length > 0 &&
                              externalEntities.map(ext=><option value={ext?.id} key={ext?.id}>{ext?.displayName}</option>)
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
                            <select value={beneficiaryBankAccount} onChange={e=>{
                              let selectedBank = beneficiairyBanks?.find(bank => bank?.bank?.id === e.target.value);
                              if(selectedBank){
                                setBeneficiaryBankAccountNumbers(selectedBank?.bankAccounts);
                                setBeneficiaryBankAccountNumber(selectedBank?.bankAccounts[0]?.account_number)
                              }
                              setBeneficiaryBankAccount(e.target.value)
                              }}>
                              {
                                beneficiairyBanks?.length > 0 &&
                                beneficiairyBanks?.map(beneficiairy => <option key={beneficiairy?.bank?.id} value={beneficiairy?.bank?.id}>
                                  {
                                    beneficiairy?.bank?.sigle
                                  }
                                </option>)
                              }
                            </select>
                          </div>
                          <div className='flex flex-col w-1/2'>
                            <label htmlFor="" className='text-xs'>Numéro du compte bénéficiaire</label>
                            <select name="" id="" value={beneficiaryBankAccountNumber} onChange={e=>setBeneficiaryBankAccountNumber(e.target.value)}>
                              {
                                beneficiaryBankAccountNumbers?.length > 0 &&
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
                    <input 
                      type="" 
                      className='' 
                      placeholder='Montant' 
                      value={montant} 
                      onChange={e=>{
                        if(!isNaN(Number(e.target.value))){
                          setMontant(e.target.value?.replaceAll("-","")?.trim());
                        }
                      }}
                      disabled={paymentMode === "ESPECES"}
                    />
                    {
                      paymentMode === "ESPECES" &&
                      <div className=''>
                       {/* Currency selection */}
                        <div className='flex flex-col w-full'>
                          <label htmlFor="" className='text-xs'>Choisir la monnaie :</label>
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
                                      if(+e.target.value >= 0){
                                        setQty(e.target.value)
                                      }
                                    }}/>
                              </div>
                              <div className='py-2 px-1 border-b-2 border-b-green-500 bg-gray-50 w-full md:w-1/5 md:max-w-1/2 overflow-x-auto'>
                                {cutProduct}
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
                      </div>
                    }
                    {/* {
                      ((montant > MAX_ALLOWED_AMOUNT && recipient === "" && recipientType === "PERSONNEPHYSIQUE" && paymentMode === "ESPECES") || montant > MAX_ALLOWED_AMOUNT_OTHERS) &&
                      <input type="text" placeholder='NIU'/>
                    } */}
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

            {/* Management controller */}
            <Modal
              title={<p>Observation du controlleur</p>}
              open={managementControllerFormIsOpen}
              onCancel={()=>setManagementControllerFormIsOpen(false)}
              onOk={handleToggleOpenForm}
              footer={()=>{}}
            >
              <ManagementControllerForm
                selected={selectedExpense}
                onSubmit={()=>
                  {
                    handleGetAllExpenses();
                    setManagementControllerFormIsOpen(false);
                  }
                }
              />
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
                  (selectedExpense.payment_method == "ESPECES") &&
                    <VerifyPermissions
                      expected={["paymaster_general"]}
                      roles={userInfo?.role?.name}
                      functions={userInfo?.Function?.name}
                    >
                      <div className=''>
                        <p>Choisir la caisse : </p>
                      </div>
                    <div className=''>
                      <select name="" id="" className='w-full' value={cashDesksId} onChange={e=>setCashDesksId(e.target.value)}>
                        { 
                          cashDesks.map((desk) =><option value={desk?.id} key={desk?.id}>{desk?.name}</option>)
                        }
                      </select>
                    </div>
                    </VerifyPermissions>
                }
                {
                  (selectedExpense?.it_is_a_cash_desk_movement && selectedExpense?.payment_method == "ESPECES") &&
                    <VerifyPermissions
                      expected={["rop"]}
                      roles={userInfo?.role?.name}
                      functions={userInfo?.Function?.name}
                    >
                      <div className=''>
                        <p>Montant total: <b>{numberWithCommas(selectedExpense?.amount)}</b></p>
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
                    </div>
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
                <button className={`${requestLoading?"bg-red-300 cursor-not-allowed":"bg-red-500"} btn text-white`} disable={requestLoading}>{requestLoading?"En cours...":"Rejeter"}</button>
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
              title={<p>Détails de la dépense</p>}
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
                    </button> */}
                    {/* {
                      isUpdateMode ? 
                      <>
                        <button 
                        className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                        onClick={()=>setIsUpdateMode(false)}
                        >
                          <XMarkIcon className="h-5"/>
                          <span>Annuler</span>
                        </button>
                        <button 
                        className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                        onClick={()=>{}}
                        >
                          <span>Sauvegarder</span>
                        </button>
                      </>
                      :
                      <button 
                        className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                        onClick={()=>setIsUpdateMode(true)}
                      >
                        <PencilIcon className="h-5"/>
                        <span>Modifier</span>
                      </button>
                    } */}
                    {
                      selectedExpense?.date_validation_department_manager != null &&
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
              <DetailForm 
                selected={selectedExpense}
                isUpdateMode={isUpdateMode}
              />
            </Drawer>

        </LoginLayout>
      )
}

export default ExpensePage