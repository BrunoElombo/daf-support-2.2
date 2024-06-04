import React, {useState, useEffect, useContext} from 'react'
import { AUTHCONTEXT } from '../../context/AuthProvider';
import { Modal, Table, notification } from 'antd'
import { PlusIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import useFetch from '../../hooks/useFetch';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import Popup from '../../components/Popup/Popup';

function CreateRecetteForm(
    {title, centered, open, footer, onOk, onCancel, setIsOpen, onSubmit}
) {

    const {userInfo} = useContext(AUTHCONTEXT);

    const entityValue = JSON.parse(localStorage.getItem('user'))?.entity.id;
    const numberWithCommas=(x)=>{
        return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
    }
    const handleGetSites=async()=>{
        let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
        if(!requestError){
          setSiteValue(response[0]?.id);
          setSites(response);
        }
    }

    const handleGetController = async()=>{
        const controller = await fetchData(import.meta.env.VITE_USER_API+"/employees/controllers");
        try {
            let result = controller ;
            setEmployeeController(result[0]?.User?.id);
            setEmployeesControllers(result)
            console.log(result);
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    }
    
    const openNotification = (title, message) => {
        notification
        .open({
          message: title,
          description: message,
          duration: 1,
        })
      };
      
    const [employeesControllers, setEmployeesControllers] = useState([]);
    const [sites, setSites] = useState([]);
    const [recipeType, setRecipeType] = useState("");
    const [employeeController, setEmployeeController] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [provenanceValue, setProvenanceValue] = useState("INVOICE PAYMENT");

    const [entityBankAccountNumber, setEntityBankAccountNumber] = useState("");
    const [entityBankAccountNumbers, setEntityBankAccountNumbers] = useState([]);
    const [externalEntityBankAccountNumber, setExternalEntityBankAccountNumber] = useState("");
    const [transactionNumber, setTransactionNumber] = useState("");
    const [cashDeskNumber, setCashDeskNumber] = useState("");

    const [descriptionValue, setDescriptionValue] = useState("");
    const [shiftValue, setShiftValue] = useState("");
    const [fileNumber, setFileNumber] = useState("");
    const [corporateName, setCorporateName] = useState("");
    const [uinClient, setUinClient] = useState("");
    const [siteValue, setSiteValue] = useState("");
    const [recipeErrMsg, setRecipeErrMsg] = useState("");
    const [enableNext, setEnableNext] = useState(false);
    
    // Operaitons types
    const [operationQuantity, setOperationQuantity] = useState(0);
    const [isAddingOperation , setIsAddingOperation] = useState(false)
    const [unitPrice, setUnitPrice] = useState(0);
    const [operationErrMsg, setOperationErrMsg] = useState("");
    const [allOperationsTotal, setAllOperationsTotal] = useState("0.0");

    const [nextIsEnabled, setNextIsEnabled] = useState(false);
    const [operations, setOperations] = useState([]);

    const [products, setProducts] = useState([]);
    const [entities, setEntities] = useState([]);
    // const [product, setPoduct] = useState("");

    const handleDelete = (record) => {
        const rowId = operations.indexOf(record);
        const updatedOperations = operations.slice(rowId, 1);
        // const updatedOperations = operations.filter((op) => rowId !== record.id);
        
        setOperationDataSrc(updatedOperations);
    };

    const [beneficiaryBankAccount, setBeneficiaryBankAccount] = useState("");
    const [beneficiairyBanks, setBeneficiairyBanks] = useState([]);
    const [beneficiaryBankAccountNumbers, setBeneficiaryBankAccountNumbers] = useState([]);
      
    const handleBeneficiaryBankAccount= async (id)=>{
        let url = import.meta.env.VITE_USER_API+`/external_entities/${id}/banks`;
        try {
        const response = await fetchData(url);
        if(response.length > 0) {
            setBeneficiairyBanks(response);
            setBeneficiaryBankAccountNumbers(response[0]?.bankAccounts);
        }
        } catch (error) {
            openNotification("ECHEC", "Impossible dóbtenir les informations des bank\n du bénéficiaire");
        }
    }

    const operationCol = [
        {
          title: '#',
          dataIndex: 'label',
          key: 'label',
          render:(text, record)=>(<>{operations.indexOf(record)+1}</>)
        },
        {
          title: 'Type d\'opération',
          dataIndex: 'label',
          key: 'label',
          render:(text, record)=>(<>{products.find(product => product.id === text)?.name}</>)
        },
        {
          title: 'P.U',
          dataIndex: 'unit_price',
          key: 'unit_price',
          render:(text, record)=><>{numberWithCommas(text)}</>
        },
        {
          title: 'Qté',
          dataIndex: 'quantity',
          key: 'quantity',
          render:(text, record)=><>{numberWithCommas(text)}</>
        },
        {
          title: 'Total',
          dataIndex: 'total_price',
          key: 'total_price',
          render: (text, record)=>(
            <>{numberWithCommas(record.total_price)}</>
          )
        },
        {
          title: 'Action',
          render: (text, record)=>(
            <div className='flex items-start space-x-2 text-xs'>
              <span className='text-green-500 cursor-pointer'>Éditer</span>
              <span className='text-red-500 cursor-pointer' onClick={()=>handleDelete(record)}>Supprimer</span>
            </div>
          )
        }
    ]

    const handleClearRecipeForm = () => {
        setEmployeeController(employeesControllers[0]?.User.id);
        setPaymentMethod("");
        setTotalAmount("");
        setDescriptionValue("");
        setShiftValue("6h-15h");
        setFileNumber("");
        setCorporateName("");
        setUinClient("");
        setSiteValue(sites[0]?.id);
        setRecipeErrMsg("");
        setTransactionNumber("");
        setOperationDataSrc([]);
        setOperations([]);
    }

    const [operationDataSrc, setOperationDataSrc] = useState([]);
    const [selectedOperationType, setSelectedOperationType] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [entityBank, setEntityBank ] = useState("");

    const [confirmModalText, setConfirmModalText] = useState("");
    const [confirmModalIcon, setConfirmModalIcon] = useState(undefined);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [externalEntities, setExternalEntities] = useState([]);
    const [bankEntity, setBankEntity] = useState([]);
    const [externalEntity, setExternalEntity] = useState("");
    const [accountNumbers, setAccountNumbers] = useState([]);
    const [destinationAccount, setDestinationAccount ] = useState("");

    const handleExternalEntity = async()=>{
        try {
            const external = await fetchData(import.meta.env.VITE_USER_API+"/external_entities");
            let result = external;
            console.log(result)
            setExternalEntities(result);
            setExternalEntity(result[0]?.external_entity.id);
            handleBeneficiaryBankAccount(result[0]?.external_entity.id)
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetBank= async()=>{
        const banks = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity_banks");
        if(!requestError){
            setBankEntity(banks);
            setEntityBankAccountNumbers(banks[0]?.bank.bank_account)
        }
    }

    const handleGetExternalBank= async()=>{
    const banks = await fetchData(import.meta.env.VITE_USER_API+"/external_entities");
    if(!requestError){
        setBankExternalEntity(banks);
    }
    }

    const handleNextStep =() =>{
        const step = currentStep;
        setCurrentStep(step+1);
    }

    const handlePrevStep =() =>{
        const step = currentStep;
        setCurrentStep(step-1);
    };

    const {requestError, postData, requestLoading, fetchData} = useFetch();
    
    const clearOperationsForm=()=>{
        setSelectedOperationType("");
        setOperationQuantity("");
        setUnitPrice(0);
    }

    const handleCreateOperation = async (e)=>{
        e.preventDefault();
        if(selectedOperationType !== "" && operationQuantity !== "" && unitPrice !== ""){
            const total = +operationQuantity * +unitPrice;
            const data = {
                "label": selectedOperationType,
                "unit_price": unitPrice,
                "quantity": operationQuantity,
                "total_price": total
            };
            setOperations([...operations, data]);
            setOperationDataSrc([...operations, data]);
            setAllOperationsTotal(operationsTotal([...operations, data]));
            clearOperationsForm();
            setIsAddingOperation(false);
            return
        }else{
            if(selectedOperationType === ""){
                setOperationErrMsg("Type d'operations requis");
                return;
            }
            if(operationQuantity === ""){
                setOperationErrMsg("Quantité requis");
                return;
            }
            if(unitPrice === ""){
                setOperationErrMsg("Prix unitaire requis");
                return;
            }
        }
    };

    useEffect(()=>{
        setOperationErrMsg("");
    }, [selectedOperationType, operationQuantity, unitPrice])

    useEffect(()=>{
        handleBeneficiaryBankAccount(externalEntity)
    }, [externalEntity])


    const handleCancelOperationCreation= (e) =>{
        e.preventDefault();
        setIsAddingOperation(false);
        setOperationDataSrc([]);
        setOperations([]);
        clearOperationsForm();
    }

    function operationsTotal(operations) {
        // Validate input data
        if (!Array.isArray(operations)) {
            throw new TypeError('Input must be an array');
        }
        // const totals = operations.map(operation =>operation.total);
        // console.log(totals);

        // Reduce function to iterate through objects and sum totals
        return operations.reduce((acc, current) => {
            // Check if "total" exists and convert to number if needed
            const total = typeof current.total_price === 'number' ? current.total_price : +current.total_price;
            // Check if conversion to number was successful (avoid NaN)
            if (!isNaN(total)) {
                setTotalAmount(acc + (+current.total_price));
                return acc + (+current.total_price);
            } else {
            console.warn('Encountered non-numeric "total" value. Skipping...');
            return acc;
            }
        }, 0);
    }

    const handleCreateRecettes = async (e) =>{
        e.preventDefault();
        const url = import.meta.env.VITE_DAF_API+"/recipesheet/?entity_id="+entityValue;
        const data = {
            "recipe_type": recipeType,
            "employee_controller": employeeController,
            "payment_method": paymentMethod,
            "total_amount": totalAmount,
            "provenance": provenanceValue,
            "description": descriptionValue,
            "shift": shiftValue,
            "file_number": fileNumber,
            "corporate_name": corporateName,
            "uin_client": uinClient,
            "bank_account_number": entityBankAccountNumber,
            "client_bank_account_number": externalEntityBankAccountNumber,
            "it_is_a_cash_desk_movement": false,
            "transaction_number": transactionNumber,
            "cash_desk_number": cashDeskNumber,
            "site": siteValue,
            "entity": entityValue,
            "operation_types" : operations
        };

        try {
            const response = await postData(url, data, true);
            onSubmit();

            if(!requestError){
                setCurrentStep(0);
                setIsOpen(false);
                handleClearRecipeForm();
                openNotification("SUCCESS", "Recette créer avec success.");
                return
            }
            openNotification("ECHEC", "Echec de creation de la recette.");
            // handleOpenModal("Recette créer avec success.", (<CheckCircleIcon className='text-green-500 h-8 w-8'/>))
        } catch (error) {
            openNotification("ECHEC", "Echec de creation de la recette.");
            // handleOpenModal("Echec de creation de la recette.",(<XMarkIcon className='text-red-500 h-8 w-8'/>))
            console.error("Error creating recipe:", error);
        }
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

    const handleGetAllEntities = async ()=>{
        try {
          const benef = await fetchData(import.meta.env.VITE_USER_API+"/entities/all");
          setEntities(benef);
        } catch (error) {
          console.log(error.message);
        }
    }

    useEffect(()=>{
        handleGetController();
        handleGetSites();
        handleGetallProducts();
        handleExternalEntity();
        handleGetBank();
        handleGetExternalBank();
        handleGetAllEntities();
        setShiftValue("6h-15h")
        const functions = JSON.parse(localStorage.getItem("user"))?.Function?.name;

        if(functions === "gueritte_chef"){
            setRecipeType("PORT REVENUE");
            setProvenanceValue("WEIGHBRIDGE PAYMENT")
        }else{
            setRecipeType("INVOICE PAYMENT");
        }
    }, []);


  return (
    <>
        <Modal
            open={open}
            centered={centered}
            footer={footer}
            title={title}
            onOk={onOk}
            onCancel={onCancel}
            setIsOpen={setIsOpen}
        >
            {
                currentStep === 0 ?
                <div className='flex flex-col space-y-3'>
                <form className='flex flex-col space-y-3'>
                    <VerifyPermissions 
                        // expected={["accountant"]}
                        expected={["guerrite_chef"]}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name}
                        // received={userInfo?.role.name}
                        isExcluded={true}
                    >
                        <select name="" id="" value={recipeType} onChange={e=>setRecipeType(e.target.value)}>
                            {/* <option value="To be invoiced">Recette portuaire</option> */}
                            <option value="INVOICE PAYMENT">Règlement de facture</option>
                            <option value="TO BE INVOICED">A facturer</option>
                        </select>
                    </VerifyPermissions>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Mode de paiement :</label>
                        <select name="" id="" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
                            <option value="ESPECES">Espèces</option>
                            <VerifyPermissions 
                                expected={["accountant"]}
                                // received={userInfo?.role.name || userInfo?.Function.name}
                                roles={userInfo?.role?.name}
                                functions={userInfo?.Function?.name}
                                // isExclude={true}
                            >
                                <option value="CARTE">Carte</option>
                                <option value="VIREMENT">Virement</option>
                                <option value="CHEQUE">Cheque</option>
                            </VerifyPermissions>
                            <option value="PAIMENT MOBILE">Paiment mobile</option>
                        </select>
                    </div>

                    {
                        (paymentMethod === "CHEQUE" || paymentMethod === "CARTE" || paymentMethod === "PAIMENT MOBILE") &&
                        <input type="text" value={transactionNumber} onChange={e=>setTransactionNumber(e.target.value)} placeholder='Numéro de transaction'/>
                    }

                    { paymentMethod === "VIREMENT" &&
                      <>
                        <div className='w-full flex flex-col md:flex-row items-center space-x-3 justify-center'>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="" className='text-xs'>Bank de l'entité</label>
                                <select className="w-full" name="" id="" value={entityBank} onChange={e=>{
                                    setEntityBank(e.target.value);
                                    const account = bankEntity.filter(account => account?.bank.id === e.target.value);
                                    setEntityBankAccountNumbers(account[0]?.bank.bank_account);
                                    setDestinationAccount("");
                                }}>
                                {
                                    bankEntity.map(bank=><option key={bank?.bank.id} value={bank?.bank.id}>{bank?.bank.sigle}</option>)
                                }
                                </select>
                            </div>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="" className='text-xs'>Numéro du compte de la bank</label>
                                {/* Add a select bank and account for the external entity */}
                                <select name="" id="">
                                    {
                                        entityBankAccountNumbers.map(accountNumber =><option value={accountNumber?.id} key={accountNumber?.id}>{accountNumber?.account_number}</option>)
                                    }
                                </select>
                            </div>
                        </div>


                        {/* Entite extern */}
                        <label htmlFor="" className='text-xs'>Entitées externe</label>
                        <select name="" id="" value={externalEntity} onChange={e=>setExternalEntity(e.target.value)}>
                            {
                                externalEntities.map(entity =>
                                    <option value={entity?.external_entity.id}>{entity?.external_entity.name}</option>
                                )
                            }
                        </select>

                        {/*  */}
                        <div className='w-full flex flex-col md:flex-row items-center space-x-3 justify-center'>
                            <div className='flex flex-col w-1/2'>
                                <label htmlFor="" className='text-xs'>Choisir la banque du bénéficiaire</label>
                                <select className='w-full' value={beneficiaryBankAccount} onChange={e=>setBeneficiaryBankAccount(e.target.value)}>
                                {
                                    beneficiairyBanks?.map(beneficiairy => <option key={beneficiairy?.bank.id} value={beneficiairy?.bank.id}>
                                    {
                                        beneficiairy.bank.sigle
                                    }
                                    </option>)
                                }
                                </select>
                            </div>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <label htmlFor="" className='text-xs'>Bank de l'entité externe</label>
                                <select className="w-full" name="" id="" value={entityBankAccountNumber} onChange={e=>{
                                    setEntityBankAccountNumber(e.target.value);
                                    const account = bankEntity.filter(account => account?.bank.id === e.target.value);
                                        setAccountNumbers(account[0]?.bank.bank_account);
                                        setDestinationAccount("");
                                    }}>
                                    {
                                        beneficiaryBankAccountNumbers.map(bank=><option key={bank?.id} value={bank?.id}>{bank?.account_number}</option>)
                                    }
                              </select>
                            </div>
                        </div>
                      </>
                    }
                    <VerifyPermissions
                        expected={["guerrite_chef"]}
                        // received={userInfo?.role.name || userInfo?.Function.name}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name}
                    >
                        <select name="" id="" value={provenanceValue} onChange={e=>setProvenanceValue(e.target.value)}>
                            <option value="">Provenance</option>
                            <option value="INVOICE PAYMENT">Règlement facture</option>
                            <option value="TO BE INVOICED">A facturer</option>
                        </select>
                    </VerifyPermissions>
                    {
                    recipeType === "INVOICE PAYMENT" &&
                        <input value={totalAmount} onChange={e=>setTotalAmount(e.target.value)} type="number" placeholder='Montant total'/>
                    }
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-xs'>Choisir le site</label>
                        <select name="" id="" value={siteValue} onChange={e=>setSiteValue(e.target.value)}>
                            {
                                sites?.map(site => <option value={site?.id} key={site?.id}>{site?.name}</option>)
                            }
                        </select>
                    </div>
                    {/* {
                    recipeType === "INVOICE PAYMENT" &&
                    <input type="text" placeholder="Nom de l'entreprise " value={corporateName} onChange={e=>setCorporateName(e.target.value)}/>
                    } */}
                    {/* { 
                    recipeType === "INVOICE PAYMENT" &&
                    <input type="text" placeholder='Numéro de contribuable' value={uinClient} onChange={e=>setUinClient(e.target.value)}/>
                    } */}
                    <VerifyPermissions
                        expected={["gueritte_chef"]}
                        // received={userInfo?.role.name || userInfo?.Function.name}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name}
                    >
                        <div className='flex flex-col'>
                            <label htmlFor="" className='text-xs'>Choisir le controleur</label>
                            <select name="" id="" value={employeeController} onChange={e=>setEmployeeController(e.target.value)}>
                                {
                                employeesControllers
                                .map(controller=><option value={controller?.User?.id} key={controller?.User?.id}>{controller?.User?.name?.toUpperCase()}</option>)
                                }
                            </select>
                        </div>
                    </VerifyPermissions>
                    <VerifyPermissions
                        expected={["gueritte_chef"]}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name}
                    >
                        <div className='flex flex-col'>
                            <label htmlFor="" className='text-xs'>Choisir le shift</label>
                            <select name="" id="" value={shiftValue} onChange={e=>setShiftValue(e.target.value)}>
                                <option value="6h-15h">6h-15h</option>
                                <option value="15h-22h">15h-22h</option>
                                <option value="22h-6h">22h-6h</option>
                            </select>
                        </div>
                    </VerifyPermissions>
                    
                    <textarea name="" id="" className='' placeholder='Description' value={descriptionValue} onChange={e=>setDescriptionValue(e.target.value)}></textarea>
                </form>
                <div className="flex justify-end">
                <VerifyPermissions
                        expected={["accountant"]}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name}
                    >
                        <button className={`${requestLoading ? "bg-green-300" : "bg-green-500" } btn text-white text-sm shadow flex items-center`} onClick={handleCreateRecettes}> 
                            <span>{requestLoading ? "En cours..." : "Initier la recette"}</span>
                        </button>
                    </VerifyPermissions>
                    <VerifyPermissions
                        expected={["gueritte_chef"]}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name} 
                    >
                        <button className={`btn ${!enableNext ? "bg-green-500" :"bg-green-300 cursor-not-allowed"} text-white text-sm shadow flex items-center`} onClick={handleNextStep}> 
                            Suivant
                            <ChevronDoubleRightIcon className='text-white h-4 w-6'/>
                        </button>
                    </VerifyPermissions>
                    <VerifyPermissions
                        expected={["gueritte_chef"]}
                        roles={userInfo?.role?.name}
                        functions={userInfo?.Function?.name}
                        isExclude={true} 
                    >
                        <button className={`btn ${(nextIsEnabled || !requestLoading) ? "bg-green-500" :"bg-green-300 cursor-not-allowed"} text-white text-sm shadow flex items-center`}  onClick={handleCreateRecettes}> 
                            {requestLoading ? "En cours...":"Initier"}
                            <PlusIcon className='text-white h-4 w-6'/>
                        </button>
                    </VerifyPermissions>
                </div>
                </div> :
                currentStep === 1 &&
                <div className='flex flex-col space-y-3'>
                    <form className='flex flex-col space-y-3' onSubmit={()=>{}}>
                        {
                        isAddingOperation &&
                        <div>
                            <div className='flex items-center space-x-3 w-full justify-between'>
                                <select name="" id="" className='w-1/4' value={selectedOperationType} onChange={e=>{
                                        setSelectedOperationType(e.target.value);

                                        const price = products.find(product=> product.id == e.target.value);
                                        console.log(price)
                                        setUnitPrice(+price?.unit);
                                    }}>
                                    <option value="">Type d'opération</option>
                                    {
                                        products.map(product=><option key={product.id} value={product.id}>{product.name}</option>)
                                    }
                                    {/* <option value="NORMALE">Normale</option>
                                    <option value="HORS_PESEE">Hors pesée</option>
                                    <option value="TEST">Test</option> */}
                                </select>
                                {/* <input type="number" name="" id="" placeholder='Prix unitaire' className='w-1/4' value={unitPrice} onChange={e=>setUnitPrice(e.target.value)} disabled={true}/> */}
                                <div className='px-2 py-1 bg-gray-50 border-b-2 border-b-green-500'>
                                <p>{isNaN(unitPrice) ? 0 : unitPrice}</p>
                                </div>
                                <input type="number" name="" id="" placeholder='Qté' className='w-1/4' value={operationQuantity} onChange={e=>setOperationQuantity(e.target.value)}/>
                                <div className='px-2 py-1 bg-gray-50 border-b-2 border-b-green-500'>
                                <p>{isNaN(+operationQuantity * +unitPrice)?0 : (+operationQuantity * +unitPrice)}</p>
                                </div>
                                <div className="flex items space-x-2 w-1/4">
                                <button className='text-white p-2 text-sm bg-green-500 rounded-lg shadow' onClick={handleCreateOperation}>
                                    <span>Ajouter</span>
                                </button>
                                <button className='text-white p-2 text-sm bg-red-500 rounded-lg shadow' onClick={handleCancelOperationCreation}>
                                    <span>Annuler</span>
                                </button>
                                </div>
                            </div>
                            <p className='text-xs text-red-500'>{operationErrMsg}</p>
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
                            dataSource={operationDataSrc.reverse()}
                            scroll={{
                                y: "130px"
                            }}
                        />
                        <div className='flex justify-between items-center'>
                            <p>Total encaissé (XAF):</p>
                            <div className='bg-yellow-500 border-[1px] rounded-lg p-2'>
                            <p className='font-bold'>{numberWithCommas(allOperationsTotal)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        {
                            !requestLoading &&
                            <button className='btn btn-ptimary bg-green-500 text-white text-sm shadow flex items-center' onClick={handlePrevStep}>
                                <ChevronDoubleLeftIcon className='text-white h-4 w-4'/> 
                                <span>Precédent</span>
                            </button>
                        }
                        <button className={`${requestLoading ? "bg-green-300" : "bg-green-500" } btn text-white text-sm shadow flex items-center`} onClick={handleCreateRecettes}> 
                            <span>{requestLoading ? "En cours..." : "Initier la recette"}</span>
                        </button>
                    </div>
                </div>
            }
        </Modal>
        <Popup message={confirmModalText} icons={confirmModalIcon} isOpen={openConfirmModal}/>
    </>
  )
}

export default CreateRecetteForm