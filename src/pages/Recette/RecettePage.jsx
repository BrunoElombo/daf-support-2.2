
import React, { useState, useEffect, useContext } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import { Table, Modal, Drawer, Space, notification, Form, Input, Popover } from 'antd'
import { CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, EllipsisHorizontalIcon, EyeIcon, FunnelIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Collapsible from '../../components/Collapsible/Collapsible';
import DetailCard from '../../components/DetailCard/DetailCard';
import useFetch from '../../hooks/useFetch'
import ValidationRecette from './ValidationRecette';
import CreateRecetteForm from './CreateRecetteForm';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import { AUTHCONTEXT } from '../../context/AuthProvider';
import RecetteSheetFilter from './RecetteSheetFilter';
// import { saveAs } from 'file-saver';
// import * as Excel from 'exceljs';
// import * as XLSX from 'xlsx';
import $ from 'jquery';
import axios from 'axios';
import RecipeDetail from '../../components/RecipeDetail';


function RecettePage() {
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

  const { userInfo } = useContext(AUTHCONTEXT);
  let userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;
  let userFunction = JSON.parse(localStorage.getItem("user"))?.Function?.name;

  const handleGetSites=async()=>{
    try {
      let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
      setSites(response);
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetController = async()=>{
      const controller = await fetchData(import.meta.env.VITE_USER_API+"/employees/controllers");
      try {
          let result = controller ;
          setEmployeesControllers(result);
      } catch (error) {
          console.error("Error creating recipe:", error);
      }
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

  const openNotification = (title, message, icon) => {
    notification.open({
      message: title,
      description: message,
      icon: icon
    });
  };

  const {fetchData, postData, requestError, requestLoading} = useFetch();
  const entityValue = JSON.parse(localStorage.getItem('user'))?.entity?.id;
  const [selectionType, setSelectionType] = useState('checkbox');
  // Recette can be of 2 types, Recette Portiere and Reglement de Factures. The inputs depends on what is selected
  const  [recipeDataSrc, setRecetteDataSrc] = useState([]);
  const  [recipeData, setRecipeData] = useState([]);
  const  [operationDataSrc, setOperationDataSrc] = useState([]);
  const  [employees, setEmployees] = useState([]);
  const [departments, setDepartements] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const generateRefNumber = (table) => {
    const existingNumbers = table.map(expense => parseInt(expense.ref_number.split('/')[0]));
    const nextNumber = existingNumbers.length === 0 ? 1001 : Math.max(...existingNumbers) + 1;
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getFullYear()}`; // Use month + 1 for correct indexing (0-based)
    return `${nextNumber}/${formattedDate}`;
  };

  const [searchValue, setSearchValue] = useState("");
  useEffect(()=>{
    if(searchValue.length > 0){
      const search = filteredData?.filter((item) => {
        const searchTextLower = searchValue.toLowerCase();
      return(
        item?.reference_number.toString().toLowerCase().includes(searchTextLower) ||
        item?.recipe_type.toString().toLowerCase().includes(searchTextLower) ||
        item?.total_amount.toString().toLowerCase().includes(searchTextLower) ||
        item?.provenance.toString().toLowerCase().includes(searchTextLower) ||
        item?.shift.toString().toLowerCase().includes(searchTextLower) ||
        item?.payment_method.toString().toLowerCase().includes(searchTextLower)||
        employees?.find(employee => employee?.User.id == item?.employee_initiator)?.User?.name?.toLowerCase().includes(searchTextLower) ||
        employees?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower) ||
        entitySites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower) 
      )
    }
  )
      console.log("Search result :",search);
      setRecetteDataSrc(search)
    }else{
      setRecetteDataSrc(filteredData);
    }
  }, [searchValue]);

  const [ rowToUpdate, setRowToUpdate] = useState(undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false)

  const [employeesControllers, setEmployeesControllers] = useState([])
  const [sites, setSites] = useState([])

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddingOperation, setIsAddingOperation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [recipeTotal, setRecipeTotal] = useState(0);
  // Recette Fileds
  const [typeRecette, setTypeRecette] = useState('PORT');

  const [departement, setDepartement] = useState('');
  const [controller, setController] = useState('');
  const [totalAmount, setTotalAmount] = useState("");
  const [origin, setOrigin] = useState('');
  const [description, setDescription] = useState('');
  const [shift, setShift] = useState('');
  const [fileNumber, setFileNumber] = useState("");
  const [socialReason, setSocialReason] = useState('');
  const [NIU, setNIU] = useState("");
  const [site, setSite] = useState('');
  const [entitySites, setEntitySites] = useState([])
  const [entity, setEntity] = useState('');
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  

  // Operation fields
  const [operations, setOperations] = useState([]);
  const [typeOperation, setTypeOperation] = useState('');
  const [operationLabel, setOperationLabel] = useState('');
  const [recipeSheet, setRecipeSheet] = useState("");
  const [unitPrice, setUnitPrice] = useState('');
  const [qty, setQty] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [operationTotalPrice, setOperationTotalPrice] = useState('');


  const [name, setName] = useState("");

  const [addOperation, setAddOperation] = useState(false);


  const [entitiesBank, setEntitiesBank] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [match, setMatch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popOverIsOpen, setPopOverIsOpen] = useState(false);

  const handleGetBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity_banks");
    if(!requestError){
      setEntitiesBank(banks);
    }
  }

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };

  // Validation recette
  const [openValidationModal, setOpenValidationModal] = useState(false);
  const handleCloseValidationModal = () =>{
    setOpenValidationModal(false);
  }
  const handleSubmitValidationModal = () =>{
    handleGetAllRecette();
    setOpenValidationModal(false);
  }
  const onClose = () => {
    setOpen(false);
  };

  const numberWithCommas=(x)=>{
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  const [selectedRecipe, setSelectedRecipe] = useState("")
  const  [activeRecipe, setActiveRecipe] = useState({})

  const handleSelectedRecipe=async(_selectedRecipe)=>{
    const selected = recipeDataSrc.find(recipe=>recipe.id == _selectedRecipe?.id);
    setSelectedRecipe(selected?.id);
    setOpenValidationModal(true);
  }
  
  const handleDeleteRecipe = async(id)=>{
    const confirmDelete = await confirm("Voulez-vous supprimer la recette ?")
    if(confirmDelete){
      const url = import.meta.env.VITE_DAF_API+"/recipesheet/"+id+"/?entity_id="+entityValue;
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
          handleGetAllRecette();
          setOpen(false);
        }
      } catch (error) {
        openNotification("ECHEC", "Impossible de supprimer la recette");
        throw new Error(`Error: Failed to update`);      
      }
    }
  }

  const handleSelectRecipeForDelete=async(_selectedRecipe)=>{
    setSelectedRecipe(_selectedRecipe.id);
    handleShowDetails(_selectedRecipe.id);
  }

  const handleGetallProducts = async ()=>{
    try {
        const url = import.meta.env.VITE_USER_API+"/products";
        let response = await fetchData(url);
        setProducts(response);
    } catch (error) {
        alert("Echec de chargement des produits")
    }
  }

  const handleGetallDepartments = async ()=>{
    try {
        const url = import.meta.env.VITE_USER_API+"/departments";
        let response = await fetchData(url);
        setDepartements(response);
    } catch (error) {
        alert("Echec de chargement des departments")
    }
  }

  const handleGetEntitySite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/");
    if(response.error) return response.error;
    setEntitySites(response);
  }

  const handleExternalEntity = async()=>{
    const response = await fetchData(import.meta.env.VITE_USER_API+"/external-entities");
    if(response.status === 200){
      setExternalEntities(response);
      return;
    }
  }

  const operationCol = [
    {
      title: 'Numéro de ref',
      dataIndex: 'reference_number',
      key: 'reference_number',
      width: 100,
    },
    {
      title: 'Type d\'opération',
      dataIndex: 'label',
      key: 'label',
      ediable: true,
      width: 100,
      render:(text, record)=>(
        rowToUpdate
        ?
         <Input />
         :
        <>{products.find(product => product.id === text)?.name}</>
      )
    },
    {
      title: 'P.U',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 100,
    },
    {
      title: 'Qté',
      dataIndex: 'quantity',
      key: 'quantity',
      ediable: true,
      width: 100,
      render:(text, record)=>(
        rowToUpdate
        ?
         <Input />
         :
        <>{text}</>
      )
    },
    {
      title: 'Total price',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 100,
    },
    {
      title: 'Action',
      width: 100,
      render: (text, record)=>
        {
          // isUpdateMode &&
          return (<div className='flex items-start space-x-2 text-xs'>
            <span className='text-green-500 cursor-pointer' onClick={()=>setRowToUpdate(record.id)}>Éditer</span>
            <span className='text-red-500 cursor-pointer'>Supprimer</span>
          </div>)
        }
    }
  ]
  
  const recetteCol = [
    {
      title: 'Numéro de références',
      dataIndex: 'reference_number',
      key: '1',
      width: "200px",
      render: (text) => highlightText(text)
    },
    {
      title: 'Initiateur',
      dataIndex: 'employee_initiator',
      key: '2',
      width:  "200px",
      render:(text, record)=>(
        <>{highlightText(employees.find(employee=>employee?.User?.id === text)?.User?.displayName?.toUpperCase())}</>
      )
    },
    {
      title: 'Controleur',
      dataIndex: 'employee_controller',
      key: '3',
      width:  "200px",
      render:(text, record)=>(
        <>{
          record.employee_controller ?
          highlightText(employees.find(employee=>employee?.User?.id === text)?.User?.displayName?.toUpperCase()):
          "N/A"
          }</>
      )
    },
    {
      title: 'Provenance',
      dataIndex: 'provenance',
      key: '5',
      width:  "200px",
      render: (text) => highlightText(text),
    },
    {
      title: 'Numéro de Factures',
      dataIndex: 'invoice_number',
      key: '6',
      width:  "200px",
      render: (text, record) => record.invoice_number ? highlightText(text) : highlightText("N/A"),
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: '7',
      width:  "200px",
      render: (text, record)=>(
        <>{highlightText(entitySites.find(site=>site.id === text)?.name)}</>
      )
    },
    {
      title: 'Montant Total',
      dataIndex: 'total_amount',
      key: '8',
      width:  "200px",
      render:(text, record)=>{
        let formatedAmount = numberWithCommas(text)
        return <b>{formatedAmount+" XAF"}</b>
      }
    },
    {
      title: 'Status',
      width:  "200px",
      key: '9',	
      render:(text, record)=>(
        record.statut !== "RECEIVED" ?
          <div className='flex space-x-2'>
            <div 
              className={`${(record.statut === "VALIDATION CHECKOUT" || record.statut === "RECEIVED") ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center py-2 px-8`}>Ctrleur</div>
            <div className={`${record.statut === "RECEIVED" ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center py-2 px-6`}>caisse</div>
          </div>:
          <p className=''>{("Perçu").toString().toUpperCase()}</p>
      )
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: '10',
      width:  "200px",
      render:(text, record)=>(
        <>
        {
          record.provenance !== "INVOICE PAYMENT"? highlightText(text) : "N/A"
        }
        </>
      )
    },
    
    {
      title: 'Actions',
      data:"id",
      width:  "200px",
      fixed: 'right',
      key: "11",
      render: (text, record)=>(
        <div className='flex items-center space-x-2'>
          {
            <VerifyPermissions 
              expected={["coordinator", "cashier"]}
              roles={userInfo?.role?.name}
              functions={userInfo?.Function?.name}
            >
              {
               (userFunction === "coordinator"  && record.date_valid_controller == null) ?
                 <CheckIcon onClick={()=>handleSelectedRecipe(text)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
               :
               ((userRole === "cashier" && record.date_valid_controller) && record.date_valid_employee_checkout == null) ?
                    <CheckIcon onClick={()=>handleSelectedRecipe(text)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
              :
              <></>
            }
            </VerifyPermissions>
          }
          {/* <XMarkIcon className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/> */}
          <EyeIcon className='text-gray-500 h-6 cursor-pointer hover:bg-gray-300 hover:text-white p-1 rounded-lg' title='Voir le détail' onClick={()=>handleSelectRecipeForDelete(record)}/>
        </div>
      )
    }
  ]

  const handleToggleOpenForm = () =>{
    setIsOpen(!isOpen);
  }
  
  const handleGetAllRecette=async ()=>{
    const url = import.meta.env.VITE_DAF_API+"/recipesheet/?entity_id="+entityValue;
    try {
      const response = await fetchData(url);
      const formatedData = response?.results?.map(obj => {
        return { ...obj, key: obj.id };
      });
      setFilteredData(formatedData);
      setRecetteDataSrc(formatedData);
      handleGetRecipeSummary();
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  }

  const handleShowDetails= async (id)=>{
    try {
      // setIsOpenDrawer(true);
      let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
      
      let url = import.meta.env.VITE_DAF_API+"/recipesheet/"+id+"/?entity_id="+entityId
      const detail = await fetchData(url);
      setActiveRecipe(detail);
      setOperationDataSrc(detail.operation_types);
      setOpen(true);
      
    } catch (error) {
      console.error(error)
      openNotification("ERREUR", "Impossible de voir le détail de la recette.", (<XMarkIcon className='text-red-500 h-6 w-6'/>))
    }
  }

  const handleGetRecipeSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/recipesheet/summary_by_year/?year="+actualYear+"&entity_id="+entityValue);
      if (response && response.annual_sums) {
        setRecipeTotal(response.annual_sums?.find(sum=>sum?.year?.split("-")[0] == new Date().getFullYear()).total_amount)
      }
      
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(()=>{
    handleGetAllRecette();
    handleGetSites();
    handleGetController();
    handleGetallProducts();
    handleGetRecipeSummary();
    handleGetEntitySite();
    handleGetEmployees();
    handleGetallDepartments();
    handleExternalEntity();
  }, []);

  const formatExportData=(data)=>{
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
        employee_initiator: employees?.find(employee=>employee?.User.id === employee_initiator)?.User.name || "N/A",
        employee_controller: employees?.find(employee=>employee?.User.id === employee_controller)?.User.name || "N/A",
        employee_checkout: employees?.find(employee=>employee?.User.id === employee_checkout)?.User.name || "N/A",
        statut:statut || "N/A",
        payment_method: payment_method || "N/A",
        department: departments?.find(dept=>dept?.id === department)?.displayName || "N/A",
        date_valid_controller: date_valid_controller?.split("T")[0] || "N/A",
        date_valid_employee_checkout: date_valid_employee_checkout?.split("T")[0] || "N/A",
        time_created: time_created || "N/A",
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
       if(recipeDataSrc?.length < 1) {
         setIsLoading(true);
         let url = `${import.meta.env.VITE_DAF_API}/recipesheet/multi_criteria_search/`;
         let headersList = {
             "Accept": "*/*",
             "Content-Type": "application/json"
         }
         let data = {
           "entity_id":entityValue
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
           let formated = formatExportData(recipeDataSrc);
           handleExportToExcel(formated);
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
  
  return (
    <LoginLayout classNam="space-y-3">
        <div className='flex justify-between'>
        <h3 className='py-2 bold'>RECETTES</h3>
          <div className='flex items-center text-sm'>
            <p className='text-sm'>
              Total : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(recipeTotal)} XAF</b>
            </p>
          </div>
        </div>
        <PageHeader >
          <div className='flex items-center space-x-2'>
            <input type="search" className='text-sm w-full md:w-auto' placeholder='Rechercher une recette' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
            <Popover 
              content={
              <RecetteSheetFilter 
                setRecetteDataSrc={setRecetteDataSrc}
                onSubmit={()=>setPopOverIsOpen(false)}
              />} 
              title="Filtre" 
              trigger="click"
              >
              <button 
                className='w-auto text-sm text-white btn bg-green-500 p-2 rounded-lg shadow-sm flex items-center'
                onClick={()=>setPopOverIsOpen(true)}
              >
                <FunnelIcon className='text-white w-4 h-4'/>
                Filtre
              </button>
            </Popover>
          </div>
            {/* {
              openFilter &&
              <div >
                  <RecetteSheetFilter />
              </div>
            } */}
          <div className='w-full md:w-auto space-x-2'>
            {
              recipeDataSrc?.length > 0 &&
              <button className={`${isLoading?"bg-green-300 cursor-not-allowed":"bg-green-500"}  btn p-2 text-white rounded-lg shadow-sm`} onClick={handleDataExport}>
              {
                isLoading ?"En cours...":"Export to excel"
              }
            </button>
            }
            <VerifyPermissions 
              expected={["gueritte_chef", "accountant"]}
              // received={userInfo?.role.name || userInfo?.Function.name}
              roles={userInfo?.role?.name}
              functions={userInfo?.Function?.name}
            >
              <button 
                className='text-white bg-green-500 p-2 rounded-lg shadow text-sm w-full md:w-auto'
                onClick={handleToggleOpenForm}
              >Enregistrer une opération</button>
            </VerifyPermissions>
            {
              selectedRowKeys.length > 0 &&
              <div className='flex items-center space-x-2'>
                <p className='text-xs'><b>{selectedRowKeys.length}</b> Fiches selectionés</p>
                <button className='text-xs bg-green-500 text-white p-2 rounded-lg shadow-md' onClick={()=>{
                  setOpenValidationModal(true);
                  setIsMultipleSelect(true);
                  }}>Validation</button>
              </div>
            }
          </div>
        </PageHeader>


        <div className='border-[1px] border-gray-100 w-full p-3 rounded-md mt-3 h-[80vh] max-h-[80vh] overflow-y-scroll'>

          {/* Recette Table */}
          <Table 
            footer={() => <div className='flex'></div>}
            rowSelection={{
              ...rowSelection
            }}
            loading={requestLoading}
            dataSource={recipeDataSrc}
            columns={recetteCol}
            scroll={{
              x: 500,
              y: "40vh"
            }}
          />
        </div>


        {/* New recette detail */}
        <CreateRecetteForm 
          title={<p>Enregistrer une opération</p>}
          centered
          open={isOpen}
          footer={<></>}
          onOk={handleToggleOpenForm}
          onCancel={handleToggleOpenForm}
          onSubmit={handleGetAllRecette}
          setIsOpen={setIsOpen}
        />
        
        {/* Validation de la recette */}
        <Modal
          title={<p>Valider la recette</p>}
          centered={true}
          open={openValidationModal}
          footer={<></>}
          afterClose={()=>setIsMultipleSelect(false)}
          onOk={handleSubmitValidationModal}
          onCancel={handleCloseValidationModal}
        >
          <ValidationRecette 
            onSubmit={handleSubmitValidationModal}
            recipeId={ isMultipleSelect ? selectedRowKeys : selectedRecipe}
            isMultipleSelect={isMultipleSelect}
          />
        </Modal>
        
        {/* Recettes details */}
        <Drawer
          title={<p>Détails de la recette</p>}
          placement={"bottom"}
          width={500}
          height={"90vh"}
          onClose={onClose}
          open={open}
          extra={
            <VerifyPermissions
              expected={["gueritte_chef", "accountant"]}
              roles={userInfo?.role?.name}
              functions={userInfo?.Function?.name}
            >
              <Space>
                  {/* <button onClick={onClose} className='btn bg-red-500 text-white'>Annuler</button>
                  <button onClick={onClose} className='btn btn-primary bg-green-500 text-white'>Sauvegarder</button> */}
                  { isUpdateMode ?
                    <>
                      <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-green-300'>
                        <PlusIcon className="h-5"/>
                        <span>Sauvegarder</span>
                      </button>
                      <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300' onClick={()=>setIsUpdateMode(false)}>
                        <XMarkIcon className="h-5"/>
                        <span>Annuler</span>
                      </button>
                    </>:
                    <>
                      {
                        (activeRecipe.statut == "VALIDATION CONTROLLER") &&
                        <>
                          <button 
                            className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                            onClick={()=>setIsUpdateMode(true)}
                          >
                            <PencilIcon className="h-5"/>
                            <span>Modifier</span>
                          </button>
                          <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300' onClick={()=>handleDeleteRecipe(activeRecipe.id)}>
                            <TrashIcon className="h-5"/>
                            <span>Supprimer</span>
                          </button>
                        </>
                      }
                    </>
                  }
              </Space>
            </VerifyPermissions>
          }
        >
          <div className='w-full h-full overflow-hidden flex flex-col md:flex-row justify-evenly md:space-x-2'>
            {/* <RecipeDetail data={activeRecipe}/> */}
            {/* Recette details */}
            <div className='w-full md:w-1/2 bg-white border-[1px] rounded-lg overflow-y-auto p-3 space-y-2'>
              
              <div className='flex items-center md:space-x-5 space-y-3 md:space-y-0'>
                <div>
                  <label htmlFor="" className='text-xs'>Date initiatier :</label>
                    <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                      <p>{activeRecipe.time_created}</p>
                    </div>
                </div>
                <div>
                  <label htmlFor="" className='text-xs'>Numéro de Références :</label>
                  <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                    <p>{activeRecipe.reference_number}</p>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="" className='text-xs'>Controlleur :</label>
                  {isUpdateMode ? 
                  <div>
                    <select className='w-full' name="" id="" value={controller} onChange={e=>setController(e.target.value)}>
                      <option value="">Choisir le controleur</option>
                      {
                        employeesControllers.map(employee =><option value={employee?.User.id} key={employee?.User.id}>{employee.User.name}</option>)
                      }
                    </select>
                  </div>
                  :
                  <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                    <p>{
                        employeesControllers.length > 0 ? employeesControllers.find(controller=>controller?.User?.id == activeRecipe.employee_controller)?.User.name.toUpperCase() :"N/A"
                      }</p> 
                  </div>
                  }
              </div>
              <div>
                <label htmlFor="" className='text-xs'>Provenence :</label>
                {isUpdateMode ? 
                  <div>
                    <select className='w-full' name="" id="" value={origin} onChange={e=>setOrigin(e.target.value)}>
                      <option value="">Provenance</option>
                      <option value="REGLEMENT_FACTURE">Règlement facture</option>
                      <option value="CAUTION_OPERATION">Caution sur opération</option>
                      <option value="SALE_ON_SITE">Vente sur site</option>
                    </select>
                  </div>
                  :
                  <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                    <p>{activeRecipe.provenance}</p> 
                  </div>
                  }
              </div>
              <div>
                <label htmlFor="" className='text-xs'>Shift :</label>
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
                    <p>{activeRecipe.shift == null ? "N/A": activeRecipe.shift}</p> 
                  </div>
                }
              </div>
              <div>
                <label htmlFor="" className='text-xs'>Mode de paiment :</label>
                <div className='flex space-x-0 md:space-x-2 space-y-2 md:space-y-0 w-full'>
                    {isUpdateMode ? 
                      <div className='w-full md:w-1/2'>
                        <select className='w-full' name="" id="" value={shift} onChange={e=>setShift(e.target.value)}>
                          <option value="ESPECES">Especes</option>
                          <option value="PAIMENTMOBILE">Paiment mobile</option>
                        </select>
                      </div>
                      :
                      <div className="bg-gray-200 border-gray-300 border rounded-lg p-1 w-1/2">
                        <p>{activeRecipe.payment_method == null ? "N/A": activeRecipe.payment_method}</p> 
                      </div>
                    }
                  <div className="bg-gray-200 border-gray-300 border rounded-lg p-1 w-1/2">
                    <p>{activeRecipe.total_amount == null ? "N/A": numberWithCommas(activeRecipe.total_amount)} XAF</p> 
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="" className='text-xs'>Description :</label>
                {isUpdateMode ? 
                  <div>
                    <textarea className='w-full' name="" id="" value={description} onChange={e=>setDescription(e.target.value)}>
                    </textarea>
                  </div>
                  :
                  <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                    <p>{activeRecipe.description == null ? "N/A": activeRecipe.description}</p> 
                  </div>
                }
              </div>
            </div>

            {/* Operations details */}
            <div className='w-full md:w-1/2 bg-white border-[1px] rounded-lg overflow-y-auto flex flex-col space-y-2 p-4'>
              <div className='flex justify-end'>
                  <button className='btn text-sm hover:bg-gray-200 hover:text-white' onClick={()=>setAddOperation(true)}>Ajouter une opération</button>
              </div>
              {
                addOperation &&
                <div className='flex flex-col space-y-3'>
                <form className='flex flex-col space-y-3' onSubmit={()=>{}}>
                    <div className='flex items-center space-x-3 w-full justify-between'>
                      <select name="" id="" className='w-1/4'>
                        <option value="">Type d'opération</option>
                        <option value="">Normale</option>
                        <option value="">Hors pesée</option>
                        <option value="">Test</option>
                      </select>
                      <input type="number" name="" id="" placeholder='Prix unitaire' className='w-1/4'/>
                      <input type="number" name="" id="" placeholder='Qté' className='w-1/4'/>
                      <button className='text-white p-2 text-sm bg-green-500 rounded-lg shadow w-1/4' onClick={()=>setIsAddingOperation(false)}>
                        <span>Ajouter</span>
                      </button>
                      <button className='text-white p-2 text-sm bg-red-500 rounded-lg shadow w-1/4' onClick={()=>setAddOperation(false)}>
                        <span>Annuler</span>
                      </button>
                    </div>
                </form>
                <hr />
                  
                </div>
              }
              <Collapsible 
                title={<p>Toutes les opérations</p>}
                isOpenned={false}
              >
                <div>
                  <Form>
                    <Table 
                      columns={operationCol}
                      dataSource={operationDataSrc}
                      loading={requestLoading}
                      footer={()=>(
                        <div className='flex justify-between items-center'>
                          <p className='text-xs'><b>Total encaissé (XAF):</b></p>
                          <div className='bg-gray-100 border-[1px] border-gray-200 rounded-lg px-3'>
                            <p className=''>0.0</p>
                          </div>
                        </div>
                      )}
                    />
                  </Form>
                  </div>
                
              </Collapsible>
            </div>

          </div>
        </Drawer>
    </LoginLayout>
  )
}

export default RecettePage