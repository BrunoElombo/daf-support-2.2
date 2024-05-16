import React, { useContext, useEffect, useState } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import { InboxOutlined } from '@ant-design/icons';
import { Table, Modal, Upload, Drawer, Space } from 'antd';
import { v4 as uuidV4 } from 'uuid';
import useFetch from '../../hooks/useFetch';
const { Dragger } = Upload;
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, TrashIcon, EllipsisHorizontalIcon, PaperClipIcon, PlusIcon, EyeIcon, PencilIcon, CheckIcon, XMarkIcon, BanknotesIcon, CalculatorIcon, ArrowUpRightIcon, ArrowTopRightOnSquareIcon  } from '@heroicons/react/24/outline';
import { AUTHCONTEXT } from '../../context/AuthProvider';
import Collapsible from '../../components/Collapsible/Collapsible';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';


const props = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

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

const MAX_ALLOWED_AMOUNT = 100000;
const MAX_ALLOWED_AMOUNT_OTHERS = 250000;
let entityId = JSON.parse(localStorage.getItem("entity"))?.entity.id;
function ExpensePage() {

  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();
  const [selectionType, setSelectionType] = useState('checkbox');
  const  [expenseDataSrc, setExpenseDataSrc] = useState([]);
      
    const  [operationDataSrc, setOperationDataSrc] = useState(
        [
          {
            operation: "Normale",
            qty: "5",
            unitaire: "10000",
          }
        ]
    );

    const [isUpdateMode, setIsUpdateMode] = useState(false);

      const { defaultEntity, } = useContext(AUTHCONTEXT);

      const [isOpenDrawer, setIsOpenDrawer] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [currentStep, setCurrentStep] = useState(0);
      const [isAddingOperation, setIsAddingOperation] = useState(false);
      const [selectedRowKeys, setSelectedRowKeys] = useState([]);
      const [loading, setLoading] = useState(false);


      const [site, setSite] = useState('');
      const [beneficiaire, setBeneficiaire] = useState('');
      const [montant, setMontant] = useState("");
      const [paymentMode, setPaymentMode] = useState("");
      const [description, setDescription] = useState('');
      const [files, setFiles] = useState([]);
      const[recipientType, setRecipientType] = useState("");
      const[recipient, setRecipient] = useState("");
      const [selectedRecipe, setSelectedRecipe] = useState("");

      const [sites, setSites] = useState([]);
      const [beneficiaires, setBeneficiaires] = useState([]);

      const [selectedExpense, setSelectedExpense] = useState({})

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
      

      // Validation Caissier
      const [openCashierValidation, setOpenCashierValidation] = useState(false);
      const [cashierObservation, setCashierObservation] = useState("");

      const handleSubmitValidation = async (e)=>{
        e.preventDefault();
        let entityId = JSON.parse(localStorage.getItem("entity"))?.entity.id
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/?entity_id="+entityId
        const data={
          is_urgent:typeValidation,
          description:validationDescription,
          employee_initiator: JSON.parse(localStorage.getItem("user"))?.id
        }
        const response = await updateData(url, data, true);
        if(!requestError){
          setValidationDescription("");
          setTypeValidation(true);
          setOpenValidateModal(false);
          handleGellAllExpenses();
          alert("Fiche de dépense validé");
        }

      }

      const handleRejectExpenses = async (e)=>{
        e.preventDefault();
        let entityId = JSON.parse(localStorage.getItem("entity"))?.entity.id
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+selectedExpense?.id+"/rejection/?entity_id="+entityId
        const data={
          is_urgent:true,
          description:rejectionDescription,
          // payment_method: "ESPECE",
          employee_initiator: JSON.parse(localStorage.getItem("user"))?.id
        }
        try {
          const response = await updateData(url, data, true);
          
        } catch (error) {
          
        }
        if(!requestError){
          setRejectionDescription("");
          setOpenRejectModal(false);
          handleGellAllExpenses();
          alert("Fiche de dépense rejeté");
        }

      }

      const [newRefNumber, setNewRefNumber] = useState('');
    
      const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
          setSelectedRowKeys([]);
          setLoading(false);
        }, 1000);
      };
    
      const setSelectionRow = (expense) => {
        // console.log('selectedRowKeys changed: ', id);
        setSelectedExpense(expense);
        setOpenValidateModal(true);
        // setSelectedRowKeys(newSelectedRowKeys);
      };
      const setSelectionRow2 = (expense) => {
        // console.log('selectedRowKeys changed: ', id);
        setSelectedExpense(expense);
        setOpenRejectModal(true);
        // setSelectedRowKeys(newSelectedRowKeys);
      };
    
      const onClose = () => {
        setIsOpenDrawer(false);
      };

      const numberWithCommas=(x)=>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
      }

      const hasSelected = selectedRowKeys.length > 0;
    
      const operationCol = [
        {
          title: 'Type d\'opération',
          dataIndex: 'operation',
          key: 'operation',
        },
        {
          title: 'Site',
          dataIndex: 'site',
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
      
      const expensesCol = [
        {
          title: 'Numéro de références',
          dataIndex: 'reference_number',
          key: 'reference_number',
        },
        {
          title: 'Site',
          dataIndex: 'site',
          key: 'site',
          render: (text, record)=>{
            const site = sites?.find(site=>site.id === record.site)
            return <>{site?.name != undefined? site?.name :text }</>
          }
        },
        {
          title: 'Beneficiaire',
          dataIndex: 'employee_beneficiary',
          key: 'employee_beneficiary',
          render: (text, record)=>{
            const beneficiaire = beneficiaires?.find(benef=>benef.id === record.employee_beneficiary);
            return <>{!beneficiaire?text:beneficiaire?.first_name}</>
           
          }
        },
        {
          title: 'Montant',
          dataIndex: 'amount',
          key: 'amount',
          render: (text)=><>{numberWithCommas(text)} XAF</>
        },
        {
          title: 'Status',
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
        {
          title: 'Actions',
          render: (text, record)=>(
            // <EllipsisHorizontalIcon className='text-gray-500 h-6 w-6 cursor-pointer'/>
            // <button className='btn btn-primary bg-green-500 text-white text-sm'>Valider</button>
            <>
                <div className='flex items-center space-x-2'>
              {
                (!record.statut.includes("REJECT") || record.statut.includes("EXECUTED") || record.statut.includes("IN_DISBURSEMENT")) &&
                <>
                  <CheckIcon onClick={()=>setSelectionRow(record)} className='text-gray-500 h-6 cursor-pointer hover:bg-green-300 hover:text-white p-1 rounded-lg' title='Valider' />
                  <XMarkIcon onClick={()=>{setSelectionRow2(record)}} className='text-gray-500 h-6 cursor-pointer hover:bg-red-300 hover:text-white p-1 rounded-lg' title='Rejeter'/>
                </>
              }
                <EyeIcon className='text-gray-500 h-6 cursor-pointer hover:bg-gray-300 hover:text-white p-1 rounded-lg' title='Voir le détail' onClick={()=>handleShowDetails(record.id)}/>
              </div>
            </>
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

      const handleShowDetails=async(id)=>{
        setIsOpenDrawer(true);
        let entityId = JSON.parse(localStorage.getItem("entity"))?.entity.id;
        let url = import.meta.env.VITE_DAF_API+"/expensesheet/"+id+"?entity_id="+entityId
        const detail = await fetchData(url);
        console.log(detail);
        const selected = expenseDataSrc.find(expense=>expense.id === id);
        setSelectedExpense(detail.result);
      }

      const generateRefNumber = () => {
        const existingNumbers = expenseDataSrc.map(expense => parseInt(expense.ref_number.split('/')[0]));
        const nextNumber = existingNumbers.length === 0 ? 1001 : Math.max(...existingNumbers) + 1;
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getFullYear()}`; // Use month + 1 for correct indexing (0-based)
        return `${nextNumber}/${formattedDate}`;
      };

      
      const handleGellAllExpenses = async() =>{
        let entityId = JSON.parse(localStorage.getItem("entity"))?.entity.id
        try {
          const response = await fetchData(import.meta.env.VITE_DAF_API+"/expensesheet/?entity_id="+entityId);
          setExpenseDataSrc(response);
        } catch (error) {
          console.log(error.message);
        }
      }
    
      const handleGetSite=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
        if(!requestError){
          setSites(response);
        }
      }

      const handleBenef = async()=>{
        const benef = await fetchData(import.meta.env.VITE_USER_API+"/users");
        if(!requestError){
          let result = benef;
          setBeneficiaires(result);
        }
      }

      const handleClearForm = () =>{
        setPaymentMode("");
        setSite("");
        setBeneficiaire("");
        setMontant("");
        setDescription("");
        setFiles([]);
      }

      const handleSubmitOperation= async (e)=>{
        e.preventDefault();
        // generateRefNumber();
        // const expenses = JSON.parse(localStorage.getItem('expenses'));

        // let data = {
        //   key:uuidV4(),
        //   ref_number:generateRefNumber(),
        //   site, 
        //   beneficiaire, 
        //   amount:montant, 
        //   description,
        //   dop_validated: true,
        //   daf_validated: false,
        //   dg_validated: false,
        //   pre_validated: false,
        // };

        // console.log(data);
        // if(expenses){
        //   localStorage.setItem('expenses', JSON.stringify([...expenses, data]));
        //   handleClearForm();
        //   setIsOpen(true);
        //   handleGellAllExpenses();
        //   return
        // }
        // localStorage.setItem('expenses', JSON.stringify([data]));

        let data = {
          site, 
          employee_beneficiary: beneficiaire, 
          employee_initiator: localStorage.getItem("user")?.id,
          payment_mode: paymentMode,
          amount:montant, 
          entity: entityId,
          description,
        }

        const headersList = new Headers();
        headersList.append(
          "Authorization", "Bearer "+localStorage.getItem("token")
        );
        const formData = new FormData();
        formData.append("site", site);
        formData.append("employee_beneficiary", beneficiaire);
        formData.append("employee_initiator", JSON.parse(localStorage.getItem("user"))?.id);
        formData.append("payment_method", paymentMode);
        formData.append("amount", montant);
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
          console.log(requestOptions)
          if(response.status === 201) {
            handleClearForm();
            alert("Dépense créee avec success");
            setIsOpen(false);
            handleGellAllExpenses();
            return;
          }
          alert("Echec de creation de la dépense");          
        } catch (error) {
          console.log(error)
          alert("Echec de creation de la dépense");
        }
      }
      
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

      useEffect(()=>{
        handleGellAllExpenses();
        handleGetSite();
        handleBenef();
      } , []);

      return (
        <LoginLayout classNam="space-y-3">
            <h3 className='py-2 bold'>FICHE DE DÉPENSE</h3>
            <PageHeader>
              <input type="search" className='text-sm' placeholder='Rechercher une operation'/>
              <VerifyPermissions
                expected={["is_director" || "is_president"]}
                received={"cassier"}
              >
                <button 
                  className='text-white bg-green-500 p-2 rounded-lg shadow text-sm'
                  onClick={handleToggleOpenForm}
                >Initier une dépense</button>
              </VerifyPermissions>
            </PageHeader>
            <div className='border-[1px] border-gray-100 w-full p-3 rounded-md mt-3 overflow-x-auto'>
              <div className='flex items-center mb-3 space-x-3 justify-end'>
                <select name="" id="" className='text-sm'>
                  <option value="">choisir une Actions</option>
                  <option value="valider">Valider</option>
                  <option value="valider">Valider et remonter</option>
                  <option value="supprimer">Supprimer</option>
                </select>
                <button className={`${hasSelected?"bg-green-500":"bg-green-200"} text-white btn btn-primary rounded-lg shadow text-sm cursor-pointer`} onClick={start} disabled={!hasSelected} loading={loading}>
                  Soumettre
                </button>
              </div>
              
              <Table 
                //  rowSelection={rowSelection}
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                dataSource={expenseDataSrc}
                columns={expensesCol}
                footer={()=>(
                  <div className='flex items-center'>
                    <p> Total : <b className='bg-yellow-300 p-2 rounded-lg'>{expenseDataSrc?.length > 0 ? numberWithCommas(sumMontants(expenseDataSrc)):"0"} XAF</b></p>
                  </div>
                )}
                scroll={{
                  x: 500,
                  y: "150px"
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
              {
                currentStep === 0 ?
                <div className='flex flex-col space-y-3'>
                  <form onSubmit={()=>{}} className='flex flex-col space-y-3'>
                    <select name="" id="" value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}>
                      <option value="">Mode de paiement</option>
                      <option value="ESPECES">Espèces</option>
                      <option value="CARTE">Carte</option>
                      <option value="VIREMENT">Virement</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="PAIMENT MOBILE">Paiment mobile</option>
                    </select>
                    { paymentMode === "VIREMENT" &&
                      <>
                        <div className='w-full flex items-center space-x-3'>
                          <select className="w-1/2" name="" id="" value={originAccount} onChange={e=>setOriginAccount(e.target.value)}>
                            <option value="">Choisir la banque opérateur</option>
                            <option value="UBA">UBA</option>
                            <option value="Ecobank">Ecobank</option>
                            <option value="BGFI">BGFI</option>
                            <option value="Afriland">Afriland</option>
                          </select>
                          <input type="text" placeholder='Numéro du compte opérateur' className="w-1/2"/>
                        </div>
                        <div className='w-full flex items-center space-x-3'>
                          <select className="w-1/2" name="" id="" value={destinationAccount} onChange={e=>setDestinationAccount(e.target.value)}>
                            <option value="">Choisir la banque bénéficiaire</option>
                            <option value="UBA">UBA</option>
                            <option value="Ecobank">Ecobank</option>
                            <option value="BGFI">BGFI</option>
                            <option value="Afriland">Afriland</option>
                          </select>
                          <input className="w-1/2" type="text" placeholder='Numéro du compte bénéficiaire'/>
                        </div>
                      </>
                    }
                    <select name="" id="" value={site} onChange={e=>setSite(e.target.value)}>
                      <option value="">Choisir le site</option>
                      {
                        // sites?.map(site=><option value={site?.id} key={site?.id}>{site?.name}</option>)
                      }
                    </select>
                    <select className='' name="" id="" value={beneficiaire} onChange={e=>setBeneficiaire(e.target.value)}>
                      <option value="">Choisir le beneficiaire</option>
                      {
                        beneficiaires?.map(benef=><option value={benef.id} key={benef.id}>{benef.first_name}{" "}{benef.last_name}</option>)
                      }
                    </select>
                    <div className='w-full flex items-center space-x-2'>
                      <select name="" id="" className='w-1/2' value={recipientType} onChange={e=>setRecipientType(e.target.value)}>
                        <option value="">Type de destinaire</option>
                        <option value="PERSONNEPHYSIQUE">Personne physique</option>
                        <option value="PERSONNEMORALE">Personne morale</option>
                        <option value="EMPLOYEES">Employées</option>
                      </select>
                      <select name="" id="" className='w-1/2' value={recipient} onChange={e=>setRecipient(e.target.value)}>
                        <option value="">Choisir le destinataire</option>
                        {
                          beneficiaires?.map(benef=><option value={benef.id} key={benef.id}>{benef.first_name}{" "}{benef.last_name}</option>)
                        }
                      </select>
                      {/* <input className='w-1/3' type="text" placeholder='Raison social' value={companyName} onChange={e=>setCompanyName(e.target.value)}/> */}
                    </div>
                    {
                      ((montant > MAX_ALLOWED_AMOUNT && recipient === "" && recipientType === "PERSONNEPHYSIQUE" && paymentMode === "ESPECES") || montant > MAX_ALLOWED_AMOUNT_OTHERS) &&
                      <input type="text" placeholder='NIU'/>
                    }
                    <input type="number" className='' placeholder='Montant' value={montant} onChange={e=>setMontant(e.target.value)}/>
                    <Dragger {...props}>
                      <p className="ant-upload-text text-xs flex items-center justify-center"> 
                        <PaperClipIcon className='text-gray-500 h-6 w-6'/>
                        Piece jointe
                      </p>
                    </Dragger>
                    <textarea name="" id="" cols="30" rows="5" placeholder='Description' value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                  </form>
                  <div className="flex justify-end">
                    <button className={`${requestLoading ? "bg-green-300" : "bg-green-500"} btn btn-ptimary  text-white text-sm shadow flex items-center`} onClick={handleSubmitOperation} disabled={requestLoading}> 
                      Initier
                    </button>
                  </div>
                </div> :
                currentStep === 1 &&
                <div className='flex flex-col space-y-3'>
                  <form className='flex flex-col space-y-3' onSubmit={()=>{}}>
                    {
                      isAddingOperation &&
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
                      </div>
                    }
                    {
                      !isAddingOperation &&
                      <div className="flex justify-end">
                        <button className='bg-green-500 p-2 rounded-lg shadow text-white flex items-center' onClick={()=>setIsAddingOperation(true)}>
                          <PlusIcon className='text-white h-4 w-4'/>
                          <span>Ajouter une opération</span>
                        </button>
                      </div>
                    }
                  </form>
                  <hr />
                    <div>
                      <Table 
                        columns={operationCol}
                        dataSource={operationDataSrc}
                      />
                      <div className='flex justify-between items-center'>
                        <p>Total de toutes les opérations:</p>
                        <div className='bg-gray-100 border-[1px] border-gray-200 rounded-lg px-3'>
                          <p className=''>0.0</p>
                        </div>
                      </div>
                    </div>
                  <div className='flex justify-between items-center'>
                    <button className='btn btn-ptimary bg-green-500 text-white text-sm shadow flex items-center' onClick={handlePrevStep}>
                      <ChevronDoubleLeftIcon className='text-white h-4 w-4'/> 
                      <span>Precédent</span>
                    </button>
                    <button className='btn btn-ptimary bg-green-500 text-white text-sm shadow flex items-center' onClick={()=>{
                      setCurrentStep(0);
                      setIsOpen(false);
                    }}> 
                      <span>Initier l'opération</span>
                    </button>
                  </div>
                </div>
              }
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
                { selectedExpense?.statut === "VALIDATION DEPARTMENT MANAGER" &&
                  <select name="" id="" value={typeValidation} onChange={e=>setTypeValidation(e.target.value)}>
                    <option value="">Type de validation</option>
                    <option value={true}>Urgent</option>
                    <option value={false}>Pas urgent</option>
                  </select>
                }
                <textarea name="" id="" placeholder='Observation' value={validationDescription} onChange={e=>setValidationDescription(e.target.value)}></textarea>
                <button className='btn bg-green-500 text-white'>Valider</button>
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
                  <button className='btn bg-green-500 text-white'>Validation</button>
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
              height={"100vh"}
              onClose={onClose}
              open={isOpenDrawer}
              extra={
                <Space>
                  <>
                    <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-green-300'>
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
                    </button>
                    <button className='btn hover:text-white flex items-center space-x-2 text-gray-500  text-sm hover:bg-gray-300'>
                      <TrashIcon className="h-5"/>
                      <span>Supprimer</span>
                    </button>
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