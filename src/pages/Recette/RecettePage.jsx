import React, { useState, useEffect, useContext } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import { Table, Modal, Drawer, Space, notification, Form, Input } from 'antd'
import { CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Collapsible from '../../components/Collapsible/Collapsible';
import DetailCard from '../../components/DetailCard/DetailCard';
import useFetch from '../../hooks/useFetch'
import ValidationRecette from './ValidationRecette';
import CreateRecetteForm from './CreateRecetteForm';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import { AUTHCONTEXT } from '../../context/AuthProvider';

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

function RecettePage() {

  const { userInfo } = useContext(AUTHCONTEXT);

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
          console.log(result)
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

  const {fetchData, postData, requestError} = useFetch();
  const entityValue = JSON.parse(localStorage.getItem('user'))?.entity.id;
  const [selectionType, setSelectionType] = useState('checkbox');
  // Recette can be of 2 types, Recette Portiere and Reglement de Factures. The inputs depends on what is selected
  const  [recipeDataSrc, setRecetteDataSrc] = useState([]);
  const  [recipeData, setRecipeData] = useState([]);
  const  [operationDataSrc, setOperationDataSrc] = useState([]);

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
      const search = filteredData?.filter(
        recipe => recipe.reference_number.toLowerCase().includes(searchValue.toLowerCase())
      )
      setRecetteDataSrc(search)
    }else{
      setRecetteDataSrc(filteredData);
    }
  }, [searchValue]);

  const [ rowToUpdate, setRowToUpdate] = useState(undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [employeesControllers, setEmployeesControllers] = useState([])
  const [sites, setSites] = useState([])

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddingOperation, setIsAddingOperation] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
  const [entity, setEntity] = useState('');
  

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

  const handleGetBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity_banks");
    if(!requestError){
      setEntitiesBank(banks);
    }
  }

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
        alert("Echedc de chargement des produits")
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
      key: 'reference_number',
      width: "200px",
    },
    {
      title: 'Controleur',
      dataIndex: 'employee_controller',
      key: 'employee_controller',
      width:  "200px",
      render:(text, record)=>(
        <>{
          record.provenance !== "INVOICE PAYMENT"?
          employeesControllers.find(employee=>employee?.User?.id === text)?.User?.name?.toUpperCase():
          "N/A"
          }</>
      )
    },
    {
      title: 'Provenance',
      dataIndex: 'provenance',
      key: 'provenance',
      width:  "200px",
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
      width:  "200px",
      render: (text, record)=>(
        <>{sites.find(site=>site.id === text)?.name}</>
      )
    },
    {
      title: 'Montant Total',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width:  "200px",
      render:(text, record)=>(
        <>{numberWithCommas(record.total_amount)+" XAF"}</>
      )
    },
    {
      title: 'Status',
      width:  "200px",
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
      key: 'shift',
      width:  "200px",
      render:(text, record)=>(
        <>
        {
          record.provenance !== "INVOICE PAYMENT"? text : "N/A"
        }
        </>
      )
    },
    
    {
      title: 'Actions',
      data:"id",
      width:  "200px",
      render: (text, record)=>(
        <div className='flex items-center space-x-2'>
          {
            <VerifyPermissions 
              expected={["coordinator", "cashier"]}
              roles={userInfo?.role?.name}
              functions={userInfo?.Function?.name}
            >
              {
              record.statut !== "RECEIVED" &&
              <CheckIcon onClick={()=>handleSelectedRecipe(text)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
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
      setFilteredData(response?.results);
      setRecetteDataSrc(response?.results);
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
        setRecipeTotal(response.annual_sums[0].total_amount)
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
  }, []);

  const hasSelected = selectedRowKeys.length > 0;
  
  return (
    <LoginLayout classNam="space-y-3">
        <h3 className='py-2 bold'>FICHE DE RECETTE</h3>

        <PageHeader >
          <input type="search" className='text-sm w-full md:w-auto' placeholder='Rechercher une recette' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
          <div className='w-full md:w-auto'>
            <VerifyPermissions 
              expected={["gueritte_chef", "accountant"]}
              // received={userInfo?.role.name || userInfo?.Function.name}
              roles={userInfo?.role?.name}
              functions={userInfo?.Function?.name}
            >
              <button 
                className='text-white bg-green-500 p-2 rounded-lg shadow text-sm w-full md:w-auto'
                onClick={handleToggleOpenForm}
              >Initier une opération</button>
            </VerifyPermissions>
          </div>
        </PageHeader>


        <div className='border-[1px] border-gray-100 w-full p-3 rounded-md mt-3 h-[80vh] max-h-[80vh] overflow-y-scroll'>

          {/* Recette Table */}
          <Table 
            footer={() => <div className='flex'>
              <p className='text-sm'>
                {/* Total : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(sumMontants(recipeDataSrc))} XAF</b> */}
                Total : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(recipeTotal)} XAF</b>
              </p>
            </div>}
            dataSource={recipeDataSrc}
            columns={recetteCol}
            scroll={{
              x: 500,
              y: "50vh"
            }}
          />
        </div>


        {/* New recette detail */}
        <CreateRecetteForm 
          title={<p>Initier une opération</p>}
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
          onOk={handleSubmitValidationModal}
          onCancel={handleCloseValidationModal}
        >
          <ValidationRecette 
            onSubmit={handleSubmitValidationModal}
            recipeId={selectedRecipe}
          />
        </Modal>
        
        {/* Recettes details */}
        <Drawer
          title={<p>Détails de la recette</p>}
          placement={"bottom"}
          width={500}
          height={"100vh"}
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

            {/* Recette details */}
            <div className='w-full md:w-1/2 bg-white border-[1px] rounded-lg overflow-y-auto p-3'>
              
              <div className='flex items-center space-x-5 space-y-3'>
                <div>
                  <label htmlFor="">Date initiatier :</label>
                    <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                      <p>{activeRecipe.time_created}</p>
                    </div>
                </div>
                <div>
                  <label htmlFor="">Numéro de Références :</label>
                  <div className="bg-gray-200 border-gray-300 border rounded-lg p-1">
                    <p>{activeRecipe.reference_number}</p>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="">Controlleur :</label>
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
                        employeesControllers.find(controller=>controller?.User?.id == activeRecipe.employee_controller)?.User.name.toUpperCase()
                      }</p> 
                  </div>
                  }
              </div>
              <div>
                <label htmlFor="">Provenence :</label>
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
                    <p>{activeRecipe.shift == null ? "N/A": activeRecipe.shift}</p> 
                  </div>
                }
              </div>
              <div>
                <label htmlFor="">Mode de paiment :</label>
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
                    <p>{activeRecipe.payment_method == null ? "N/A": activeRecipe.payment_method}</p> 
                  </div>
                }
              </div>
              <div>
                <label htmlFor="">Description :</label>
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