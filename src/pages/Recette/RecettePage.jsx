import React, { useState, useEffect, useContext } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import { Table, Modal, Drawer, Space } from 'antd'
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
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
    if(!requestError){
      setSites(response );
    }
}

const handleGetController = async()=>{
    const controller = await fetchData(import.meta.env.VITE_USER_API+"/users");
    try {
        let result = controller ;
        setEmployeesControllers(result)
    } catch (error) {
        console.error("Error creating recipe:", error);
    }
}
  const {fetchData, postData, requestError} = useFetch();
  const entityValue = JSON.parse(localStorage.getItem('user'))?.entity.id;
  const [selectionType, setSelectionType] = useState('checkbox');
  // Recette can be of 2 types, Recette Portiere and Reglement de Factures. The inputs depends on what is selected
  const  [recipeDataSrc, setRecetteDataSrc] = useState([]);
  const  [operationDataSrc, setOperationDataSrc] = useState(
    [
      {
        operation: "Normale",
        qty: "5",
        unitaire: "10000",
      }
    ]
  );

  const generateRefNumber = (table) => {
    const existingNumbers = table.map(expense => parseInt(expense.ref_number.split('/')[0]));
    const nextNumber = existingNumbers.length === 0 ? 1001 : Math.max(...existingNumbers) + 1;
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getFullYear()}`; // Use month + 1 for correct indexing (0-based)
    return `${nextNumber}/${formattedDate}`;
  };

  const [employeesControllers, setEmployeesControllers] = useState([])
  const [sites, setSites] = useState([])

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddingOperation, setIsAddingOperation] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

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


  const [isUpdateMode, setIsUpdateMode] = useState(false);


  // Validation recette
  const [openValidationModal, setOpenValidationModal] = useState(false);
  const handleCloseValidationModal = () =>{
    setOpenValidationModal(false);
  }
  const handleSubmitValidationModal = () =>{
    setOpenValidationModal(false);
  }
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };

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

  const numberWithCommas=(x)=>{
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }


  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows.map(row => row.key)); // Get unique keys
  };

  const listSelected = () => {
    const selectedNames = selectedRows.map(key => data.find(item => item.key === key)?.name);
    alert(`Selected Names: ${selectedNames.join(', ')}`);
  };

  const [selectedRecipe, setSelectedRecipe] = useState("")
  const handleSelectedRecipe=async(_selectedRecipe)=>{
    console.log(_selectedRecipe)
    const selected = recipeDataSrc.find(recipe=>recipe.id == _selectedRecipe?.id);
    console.log(selected?.id)
    setSelectedRecipe(selected?.id);
    setOpenValidationModal(true);
  }

  const handleValidateRecipe=async()=>{

  }
  
  const operationCol = [
    {
      title: 'Type d\'opération',
      dataIndex: 'operation',
      key: 'operation',
    },
    {
      title: 'P.U',
      dataIndex: 'unitaire',
      key: 'unitaire',
    },
    {
      title: 'Qté',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Total',
      render: (text, record)=>(
        <>{+record.qty*+record.unitaire}</>
      )
    },
    {
      title: 'Action',
      render: ()=>(
        <div className='flex items-start space-x-2 text-xs'>
          <span className='text-green-500 cursor-pointer'>Éditer</span>
          <span className='text-red-500 cursor-pointer'>Supprimer</span>
        </div>
      )
    }
  ]
  
  const recetteCol = [
    {
      title: 'Numéro de références',
      dataIndex: 'reference_number',
      key: 'reference_number',
    },
    {
      title: 'Controleur',
      dataIndex: 'employee_controller',
      key: 'employee_controller',
      // render:(text, record)=>{
      //   // const employee = employeesControllers?.find(controller=>controller?.id === text);
      //   // console.log(employee)
      //   return <>{employee? employee?.first_name : text}</>
      // }
    },
    {
      title: 'Provenance',
      dataIndex: 'provenance',
      key: 'provenance',
    },
    {
      title: 'Montant Total',
      dataIndex: 'amount',
      key: 'amount',
      render:(text, record)=>(
        <>{numberWithCommas(record.total_amount)+" XAF"}</>
      )
    },
    {
      title: 'Status',
      render:(text, record)=>(
        <div className='flex space-x-2'>
          <div 
            className={`${(record.statut === "VALIDATION CHECKOUT" || record.statut === "RECEIVED") ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center py-2 px-5`}>Ctrleur</div>
          <div className={`${record.statut === "RECEIVED" ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center py-2 px-5`}>caisse</div>
        </div>
      )
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
    },
    
    {
      title: 'Actions',
      data:"id",
      render: (text, record)=>(
        <div className='flex items-center space-x-2'>
          {
            
            <CheckIcon onClick={()=>handleSelectedRecipe(text)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
          }
          {/* <XMarkIcon className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/> */}
          <EyeIcon className='text-gray-500 h-6 cursor-pointer hover:bg-gray-300 hover:text-white p-1 rounded-lg' title='Voir le détail' onClick={handleShowDetails}/>
        </div>
      )
    }
  ]

  const handleToggleOpenForm = () =>{
    setIsOpen(!isOpen);
  }
  
  const handleNextStep = () =>{
    const step = currentStep;
    setCurrentStep(step+1);
  }
  const handlePrevStep = () =>{
    const step = currentStep;
    setCurrentStep(step-1);
  }

  const handleGetAllRecette=async ()=>{
    const url = import.meta.env.VITE_DAF_API+"/recipesheet/?entity_id="+entityValue;
    try {
      const response = await fetchData(url);
      console.log(response);
      setRecetteDataSrc(response?.results);
    } catch (error) {
      console.error("Error creating recipe:", error);
      // alert(`Failed to create recipe: ${error.message || 'An unknown error occurred.'}`);
    }
  }


  const handleCreateRecette=()=>{

    // data={
    //   origin, controller, amount: totalAmount, shift
    // }

    const data={
      "departement":departement,
      "employer_controller":controller,
      "total_amount":totalAmount,
      "provenance":origin,
      "description":description,
      "shift":shift,
      "file_number":fileNumber,
      "social_reason":socialReason,
      "tax_payer_number_social_reason":NIU,
      "site":site,
      "entite": entity,
      "operations": operations
    }

    const response = postData(import.meta.env.VITE_DAF_API, data, true);
    
    if(requestError){
      alert("Echec de la requetes");
    }else{
      console.log(response);
    }
    setIsOpen(false);

    handleClearForm();
  }

  const handleCreateOperation = () => {

    const data={
      label: "operationLabel",
      recipe_sheetst: recipeSheet,
      unit_price: unitPrice,
      qantity: qty,
      total_price: operationTotalPrice
    }

    const response = postData(import.meta.env.VITE_DAF_API, data, true);
    
    if(requestError){
      alert("Echec de la requetes");
    }else{
      console.log(response);
    }
    setIsOpen(false);

    handleClearForm();
  }


  const handleUpdateRecette=()=>{

  }

  const handleClearForm=()=>{
    setTypeRecette("PORT");
    setSite('');
    setController('');
    setOrigin('');
    setShift('');
    setName("");
    setNIU("");
  }

  const handleShowDetails=()=>{
    setOpen(true);
  }


  useEffect(()=>{
    handleGetAllRecette();
    handleGetSites();
    handleGetController();
  }, []);

  const hasSelected = selectedRowKeys.length > 0;
  
  return (
    <LoginLayout classNam="space-y-3">
        <h3 className='py-2 bold'>FICHE DE RECETTE</h3>

        <PageHeader>
          <input type="search" className='text-sm' placeholder='Rechercher une operation'/>
          <div>
            <VerifyPermissions 
              expected={["gueritte_chef", "accountant"]}
              // received={userInfo?.role.name || userInfo?.Function.name}
              roles={userInfo?.role?.name}
              functions={userInfo?.Function?.name}
            >
              <button 
                className='text-white bg-green-500 p-2 rounded-lg shadow text-sm'
                onClick={handleToggleOpenForm}
              >Initier une opération</button>
            </VerifyPermissions>
          </div>
        </PageHeader>


        <div className='border-[1px] border-gray-100 w-full p-3 rounded-md mt-3'>

          {/* Action to perform on selected recettes */}
          {/* <div className='flex items-center mb-3 space-x-3 justify-end'>
            <select name="" id="" className='text-sm'>
              <option value="">choisir une Actions</option>
              <option value="valider">Valider</option>
              <option value="supprimer">Rejetter</option>
            </select>
            <button className={`${hasSelected?"bg-green-500":"bg-green-200"} text-white btn btn-primary rounded-lg shadow text-sm cursor-pointer`} onClick={()=>{}} disabled={!hasSelected}>
              Soumettre
            </button>
          </div> */}


          {/* Recette Table */}
          <Table 
                //  rowSelection={rowSelection}
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                footer={() => <div className='flex'>
                  <p className='text-sm'>
                    Total : <b className='bg-yellow-300 p-2 rounded-lg'>{recipeDataSrc?.length > 0 ? numberWithCommas(sumMontants(recipeDataSrc)): "0"} XAF</b>
                  </p>
                </div>}
                dataSource={recipeDataSrc}
                columns={recetteCol}
                scroll={{
                  x: 500,
                  y: "130px"
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
                  {/* <button 
                  onClick={()=>setOpenValidationModal(true)}
                  className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-green-300'>
                    <CheckIcon className="h-5"/>
                    <span>Valider</span>
                  </button> */}
                  {/* <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-red-300'>
                    <XMarkIcon className="h-5"/>
                    <span>Rejeter</span>
                  </button> */}
                  <button 
                    className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'
                    onClick={()=>setIsUpdateMode(true)}
                  >
                    <PencilIcon className="h-5"/>
                    <span>Modifier</span>
                  </button>
                  <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'>
                    <TrashIcon className="h-5"/>
                    <span>Supprimer</span>
                  </button>
                </>
                
              }
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
                      <option value="REGLEMENT_FACTURE">Règlement facture</option>
                      <option value="CAUTION_OPERATION">Caution sur opération</option>
                      <option value="SALE_ON_SITE">Vente sur site</option>
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
                  </div>
                {/* {
                  operationDataSrc.map(data=>(
                    <DetailCard
                      leftBorderColor={"green"}
                      className={"rounded-lg"}
                      content={
                        <div className=''>
                          <div className='p-2 flex flex-col'>
                            <div className='flex space-x-2'>
                              <p className='bold'>Type d'opération :</p>
                              <p>{data.operation}</p>
                            </div>
                            <div className='flex space-x-2'>
                              <p className='bold'>Qté :</p>
                              <p>{data.qty}</p>
                            </div>
                            <div className='flex space-x-2'>
                              <p className='bold'>P.U :</p>
                              <p>{data.unitaire}</p>
                            </div>
                            <div className='flex space-x-2'>
                              <p className='bold'>Total :</p>
                              <p>{data.unitaire}</p>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  ))
                } */}
              </Collapsible>
            </div>

          </div>
        </Drawer>
    </LoginLayout>
  )
}

export default RecettePage