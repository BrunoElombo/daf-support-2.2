import React, {useEffect, useState} from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import ReportingSheetFilter from './TreasurySheetFilter';
import PageHeader from '../../components/PageHeader/PageHeader'
import TabsComponent from '../../components/TabsComponents/TabsComponent'
import Tab from '../../components/TabsComponents/Tab'
import { Table, Popover, Drawer, Space, notification } from 'antd'
import {BarsArrowDownIcon, EllipsisHorizontalIcon, FunnelIcon, CheckIcon, XMarkIcon, PencilIcon, TrashIcon} from  '@heroicons/react/24/outline'
import useFetch from '../../hooks/useFetch'
import RecetteSheetFilter from '../Recette/RecetteSheetFilter';
import ExepenseSheetFilter from '../Expense/ExepenseSheetFilter';
import $ from 'jquery';
import axios from 'axios';

function TreasuryPage() {
  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();

  const [path, setPath] = useState("expenses");
  const [recetteData, setRecetteData] = useState([]);
  const [expensesDataSource, setExpensesDataSource] = useState([]);
  const [recipesDataSource, setRecipesDataSource] = useState([]);
  const [expensesData, setExpensesData] = useState([]);  
  const [recipeDataSrc, setRecetteDataSrc] = useState([]);
  const [expenseDataSrc, setExpenseDataSrc] = useState([]);

  const [beneficiaires, setBeneficiaires] = useState([]);
  const [entitySites, setEntitySites] = useState([]);
  const [sites, setSites] = useState([]);
  const [departments, setDepartements] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const [selectedMonth, setSelectedMonth] =useState("");
  const [to, setTo] =useState("");

  const [cashBalance, setCashBalance] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [recipeTotal, setRecipeTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function sumMontants(objects) {
    // Initialize a variable to store the sum
    let total = 0;

    // Loop through each object in the list
    for (const obj of objects) {
      // Check if the object has a `montant` attribute
      if (obj.hasOwnProperty('amount')) {
        // Get the value of the `montant` attribute
        const montant = obj.amount;

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

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
    const filteredData = expensesData.filter(item => {
      const [, month, year] = item.reference_number.split('/');
      return (selectedMonth === '' || month === selectedMonth) && year === '2024';
    });
    setExpensesData(filteredData);
  };

  const numberWithCommas=(x)=>{
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  const handleGetSite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
    console.log(response)
    try {
      setSites(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleBenef = async()=>{
    try {
      const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees");
      setBeneficiaires(benef);
    } catch (error) {
      console.log(error);
    }
  }

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
  
  const handleGetEntitySite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
    if(!requestError){
      setEntitySites(response);
    }
  }

  const handleGetDepartments=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/departments");
    if(!requestError){
      setDepartements(response);
    }
  }

  const handleGetRecipeSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/recipesheet/summary_by_year/?year="+actualYear+"&entity_id="+entityId);
      if (response && response.annual_sums) {
        console.log(response.annual_sums)
        setRecipeTotal(response.annual_sums[0].total_amount)
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchAllRecettes =async ()=>{
    try {
      const url = import.meta.env.VITE_DAF_API+"/recipesheet/?entity_id="+entityId;
      const response = await fetchData(url);
      setRecetteData(response?.results);
      setRecipesDataSource(response?.results);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchAllExpenses = async ()=>{
    try {
      const url = import.meta.env.VITE_DAF_API+"/expensesheet/?entity_id="+entityId;
      const response = await fetchData(url);
      setExpensesData(response?.results);
      setExpensesDataSource(response?.results);
    } catch (error) {
      console.error(error)
    }
  }

  const [searchValue, setSearchValue] = useState("");
  
  useEffect(()=>{
    if(path === "expenses"){
      if(searchValue.length > 0){
        const search = expensesDataSource?.filter(item =>{
          const searchTextLower = searchValue.toLowerCase();
          return(
            item?.reference_number?.toString().toLowerCase().includes(searchTextLower) ||
            item?.statut?.toString().toLowerCase().includes(searchTextLower) ||
            item?.payment_method?.toString().toLowerCase().includes(searchTextLower) ||
            item?.amount?.toString().toLowerCase().includes(searchTextLower) ||
            item?.transaction_number?.toString().toLowerCase().includes(searchTextLower) ||
            item?.uin_beneficiary?.toString().toLowerCase().includes(searchTextLower) ||
            (beneficiaires?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower) ? 
            beneficiaires?.find(employee => employee?.User.id == item?.employee_beneficiary)?.User?.name?.toLowerCase().includes(searchTextLower)
            :externalEntities.find(externalEntity=> externalEntity?.external_entity.id === item?.employee_controller)?.external_entity.name.toUpperCase()) ||
            entitySites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower)
          )
        })
        setExpensesData(search);
      }
      else{
        setExpensesData(expensesDataSource);
      }
    }else{
      if(searchValue.length > 0){
        const search = recipesDataSource?.filter((item) => {
          const searchTextLower = searchValue.toLowerCase();
          return(
            item?.reference_number.toString().toLowerCase().includes(searchTextLower) ||
            item?.recipe_type.toString().toLowerCase().includes(searchTextLower) ||
            item?.total_amount.toString().toLowerCase().includes(searchTextLower) ||
            item?.provenance.toString().toLowerCase().includes(searchTextLower) ||
            item?.shift.toString().toLowerCase().includes(searchTextLower) ||
            item?.payment_method.toString().toLowerCase().includes(searchTextLower)||
            beneficiaires?.find(employee => employee?.User.id == item?.employee_initiator)?.User?.name?.toLowerCase().includes(searchTextLower) ||
            beneficiaires?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower) ||
            entitySites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower) 
            )
          }
        )
        setRecetteData(search)
      }else{
        setRecetteData(recipesDataSource);
      }
    }
  }, [searchValue]);

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  }

  const handleExternalEntity = async()=>{
    const external = await fetchData(import.meta.env.VITE_USER_API+"/external_entities");
    if(!requestError){
      let result = external;
      setExternalEntities(result);
    }
  }

  
/**
*
*/
  const openNotification = (title, message) => {
    notification.open({
      message: title,
      description: message,
      duration: 1,
    });
  }


  // Get the solde the trésorerie
  const handleSoldeTresorerie = async ()=>{

  }

  /**
   * Format Recipe data
   */
  const formatExportRecipeData=(data)=>{
    return data?.map(item=>{
      const {
        reference_number, recipe_type, total_amount, provenance, 
        site, entity, description, shift, uin_client, transaction_number, bank_account_number, employee_initiator, employee_controller, employee_checkout, statut, payment_method, department, date_valid_controller, date_valid_employee_checkout, time_created} = item

      return {
        reference_number:reference_number || "N/A",
        recipe_type : recipe_type || "N/A",
        total_amount :total_amount || "N/A",
        provenance:provenance || "N/A",
        site: entitySites?.find(item=>item?.id === site)?.name || "N/A",
        entity : entity || "N/A",
        description : description || "N/A",
        shift : shift || "N/A",
        uin_client : uin_client || "N/A",
        transaction_number :transaction_number || "N/A",
        bank_account_number : bank_account_number || "N/A",
        employee_initiator: beneficiaires?.find(employee=>employee?.User.id === employee_initiator)?.User.name || "N/A",
        employee_controller: beneficiaires?.find(employee=>employee?.User.id === employee_controller)?.User.name || "N/A",
        employee_checkout: beneficiaires?.find(employee=>employee?.User.id === employee_checkout)?.User.name || "N/A",
        statut:statut || "N/A",
        payment_method: payment_method || "N/A",
        department: departments.find(dept=>dept?.id === department)?.displayName || "N/A",
        date_valid_controller: date_valid_controller?.split("T")[0] || "N/A",
        date_valid_employee_checkout: date_valid_employee_checkout?.split("T")[0] || "N/A",
        time_created: time_created || "N/A",
      }

    })
  }

  /**
   * Handle Export recipe to excel
   */
  const handleExportRecipeToExcel= async(filteredData)=>{
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

  /**
   * Handle recipe data
   */
  const handleRecipeDataExport = async ()=>{
    try {
       if(recetteData.length < 1) {
         setIsLoading(true);
         let url = `${import.meta.env.VITE_DAF_API}/recipesheet/multi_criteria_search/`;
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
           let formated = formatExportRecipeData(data)
           handleExportRecipeToExcel(formated);
           setIsLoading(false);
           openNotification("SUCCESS", "Fichier exporté");
           });
         }
         else{
           let formated = formatExportRecipeData(recetteData);
           handleExportRecipeToExcel(formated);
           setIsLoading(false);
           openNotification("SUCCESS", "Fichier exporté");
         }     
     } 
     catch (error) {
         console.log("Error :", error);
         openNotification("ECHEC", "Une erreur est survenue lors de l'export");
         setIsLoading(false);
      }
  }

  /**
  * Format Expense data
  */
  const formatExportExpenseData=(data)=>{
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
          paymaster_general,
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
          date_valid_paymaster_general,
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
        paymaster_general:beneficiaires?.find(employee=>employee?.User.id === paymaster_general)?.User.name || "N/A",
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
        date_valid_paymaster_general:date_valid_paymaster_general?.split("T")[0] ||"N/A",
        department: departments.find(dept=>dept?.dept?.id === department)?.displayName || "N/A",
        statut:statut || "N/A",
        time_created: time_created
      }
    })
  }

  /**
   * Handle Export expense to excel
   */
  const handleExportExpenseToExcel= async(filteredData)=>{
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

  /**
   * 
   */
  const handleExpenseDataExport = async ()=>{
    try {
       if(expensesData.length < 1) {
         setIsLoading(true);
         let url = `${import.meta.env.VITE_DAF_API}/expensesheet/multi_criteria_search/`;
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
           let formated = formatExportExpenseData(data)
           handleExportExpenseToExcel(formated);
           setIsLoading(false);
           openNotification("SUCCESS", "Fichier exporté");
           });
         }
         else{
           let formated = formatExportExpenseData(expensesData);
           handleExportExpenseToExcel(formated);
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
    handleFetchAllRecettes();
    handleFetchAllExpenses();
    handleGetSite();
    handleSoldeTresorerie();
    handleBenef();
    handleExternalEntity();
    handleGetExpenseSummary();
    handleGetRecipeSummary();
    handleGetEntitySite();
    handleGetDepartments();
  }, []);


  useEffect(()=>{
    setCashBalance(+recipeTotal - +expenseTotal)
  }, [expenseTotal, recipeTotal]);

  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }

  const recetteCol = [
    {
      title: 'Numéro de références',
      dataIndex: 'reference_number',
      key: 'reference_number',
      width: "200px",
      render: (text)=>highlightText(text)
    },
    {
      title: 'Controleur',
      dataIndex: 'employee_controller',
      key: 'employee_controller',
      width:  "200px",
      render: (text, record)=>highlightText(beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase())
    },
    {
      title: 'Provenance',
      dataIndex: 'provenance',
      key: 'provenance',
      width:  "200px",
      render: (text)=>highlightText(text)
    },
    {
      title: 'Pont',
      dataIndex: 'site',
      key: 'site',
      width:  "200px",
      render: (text, record)=>(
        <>{highlightText(sites.find(site=>site.id === text)?.name)}</>
      )
    },
    {
      title: 'Montant Total',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width:  "200px",
      render:(text, record)=>(
        <>{highlightText(numberWithCommas(record.total_amount))} XAF</>
      )
    },
    {
      title: 'Status',
      width:  "200px",
      render:(text, record)=>(
        <div className='flex space-x-2'>
          <div 
            className={`${(record.statut === "VALIDATION CHECKOUT" || record.statut === "RECEIVED") ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center py-2 px-8`}>Ctrleur</div>
          <div className={`${record.statut === "RECEIVED" ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center py-2 px-6`}>caisse</div>
        </div>
      )
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      width:  "200px",
      render: (text)=>highlightText(text)
    },
  ]

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
        const site = sites?.find(site=>site.id === record.site)
        return <>{site?.name != undefined? highlightText(site?.name) :highlightText(text) }</>
      }
    },
    {
      title: 'Beneficiaire',
      dataIndex: 'employee_beneficiary',
      key: 'employee_beneficiary',
      width:  "200px",
      render: (text, record)=>highlightText(beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase())
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      width:  "200px",
      render:(text, record)=>(
        <>{highlightText(numberWithCommas(record.total_amount))} XAF</>
      )
    },
    {
      title: 'Status',
      width:  "200px",
      render:(text, record)=>
      (
        <div className='flex space-x-2'>
          <div 
          className={`${((record.statut === "VALIDATION FINANCIAL MANAGEMENT"|| record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_manager_department != null && record.statut != "REJECT DEPARTMENT MANAGER")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DEX</div>
          {
            !record.is_urgent &&
            <>
              <div className={`${((record.statut === "VALIDATION GENERAL MANAGEMENT" || record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_budgetary_department != null && record.statut != "REJECT FINANCIAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF</div>
              <div className={`${((record.statut === "VALIDATION PRESIDENT" ||  record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_general_director != null && record.statut != "REJECT GENERAL MANAGEMENT")) ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DG</div>
              <div className={`${((record.statut == "EXECUTED" ||  record.statut == "IN_DISBURSEMENT") || (record.date_valid_president != null && record.statut != "REJECT PRESIDENT"))?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>PRE</div>
            </>
          }
        </div>
      )
      
    },
    // {
    //   title: 'Actions',
    //   render: ()=>(
    //     <EllipsisHorizontalIcon className='text-gray-500 h-6 w-6 cursor-pointer'/>
    //     // <button className='btn btn-primary bg-green-500 text-white text-sm'>Valider</button>
    //   )
    // }
  ]

  const handleFilter=(e)=>{
    setSelectedMonth(e.target.value);
    const filteredExpenses = expensesData.filter(expense=>expense?.reference_number.split('/')[1] == selectedMonth);
    if(selectedMonth.length === 0){
      setExpensesData(expensesDataSource);
    }else{
      setExpensesData(filteredExpenses);
    }
  }

  return (
    <LoginLayout>
        {/* <h3>REPORTING</h3> */}
        <PageHeader>
          {/* <div className='flex flex-col md:flex-row space-y-2 md:space-x-3 items-center w-full md:w-auto'>
            <input type="text" className='text-xs w-full md:w-auto' placeholder="Choisir l'année"/>
            <select value={selectedMonth} onChange={handleChange} className='text-xs w-full md:w-auto'>
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <input type="date" className='text-xs w-full md:w-auto'/>
            <input type="date" className='text-xs w-full md:w-auto'/>
            <input type="search" placeholder='Recherche' className='text-xs w-full md:w-auto'/>
          </div> */}
          <div className='flex justify-between items-center w-full'>
            <div className='mt-2 md:mt-0 flex space-x-5'>
              <h3 className='text-xs'>
                Solde trésorerie : <b className={`bg-yellow-300 p-2 rounded-lg`}>{numberWithCommas(cashBalance)} XAF</b>
              </h3>
              <h3 className="text-xs">
                Dépense total : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(expenseTotal)} XAF</b>
              </h3>
              <h3 className="text-xs">
                Recette total : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(recipeTotal )} XAF</b>
              </h3>
            </div>
            <div className='flex space-x-2 items-center'>
              <div>
                <Popover 
                  content={
                    path === "expenses" ?
                    <ExepenseSheetFilter 
                      setExpenseDataSrc={setExpensesData}
                      onSubmit={()=>{}}
                    />
                    :
                    <RecetteSheetFilter 
                      setRecetteDataSrc={setRecetteData}
                      onSubmit={()=>{}}
                    />
                  } 
                  title={path === "expenses" ? "Filtre dépenses":"Filtre recettes"} 
                  trigger="click"
                  >
                  <button 
                    className='w-auto text-sm text-white btn bg-green-500 p-2 rounded-lg shadow-sm flex items-center'
                  >
                    <FunnelIcon className='text-white w-4 h-4'/>
                    Filtre
                  </button>
                </Popover>
              </div>
              <div>
                {
                  <button 
                  className={`${isLoading?"bg-green-300 cursor-not-allowed":"bg-green-500"}  btn p-2 text-white rounded-lg shadow-sm text-sm`} 
                  onClick={path === "expenses" ? handleExpenseDataExport : handleRecipeDataExport}>
                    { (recetteData || expensesData) &&
                      isLoading ?"En cours...":"Export to excel"
                    }
                  </button>
                }
              </div>
              <div>
                <input type="search" className='text-sm w-full md:w-auto' placeholder='Rechercher une recette' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
              </div>
            </div>   
          </div>
        </PageHeader>
        <div className='border-[1px] border-gray-100 w-full p-3 rounded-md mt-3'>
          
          <TabsComponent >
            <Tab 
              title={"Toutes les dépenses"}
              icon={<></>}
              isActive={path === "expenses"}
              onClick={()=>handleTabClick("expenses")}             
            />
            <Tab 
              title={"Toutes les recettes"}
              icon={<></>}
              isActive={path === "recettes"}
              onClick={()=>handleTabClick("recettes")}
            />
          </TabsComponent>
          <Table 
            columns={
              path === "recettes" ? recetteCol : expensesCol
            }
            dataSource={
              path === "recettes" ? recetteData : expensesData
            }
            pagination={{
              pageSize: 50,
            }}
            footer={()=>(
              <div>
                
              </div>
            )}
            scroll={{
              y: "40vh",
              x:500
            }}
          />
        </div>
        <Drawer 
        title={<p>Détails de l'approvisionement</p>}
        placement={"bottom"}
        width={500}
        height={"100vh"}
        onClose={()=>{}}
        open={false}
        extra={
          <Space>
            <>
              <button 
                className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                onClick={()=>{}}
              >
                <PencilIcon className="h-5"/>
                <span>Modifier</span>
              </button>
              <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'>
                <TrashIcon className="h-5"/>
                <span>Supprimer</span>
              </button>
            </>
          </Space>
        }
        >
      
        </Drawer>
    </LoginLayout>
  )
}

export default TreasuryPage
