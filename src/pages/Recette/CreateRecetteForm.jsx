import React, {useState, useEffect, useContext} from 'react'
import { AUTHCONTEXT } from '../../context/AuthProvider';
import { Modal, Table, notification } from 'antd'
import { PlusIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import useFetch from '../../hooks/useFetch';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import Popup from '../../components/Popup/Popup';
import { v4 as uuid } from 'uuid'
import SuggestInput from '../../components/SuggestInput/SuggestInput';

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
    const [paymentMethod, setPaymentMethod] = useState("ESPECES");
    const [totalAmount, setTotalAmount] = useState("");
    const [provenanceValue, setProvenanceValue] = useState("INVOICE PAYMENT");

    const [entityBankAccountNumber, setEntityBankAccountNumber] = useState("");
    const [bankExternalEntity, setBankExternalEntity] = useState([]);
    

    const [entityBankAccountNumbers, setEntityBankAccountNumbers] = useState([]);
    const [externalEntityBankAccountNumbers, setExternalEntityBankAccountNumbers] = useState([]);
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
        // const rowId = operations.indexOf(record);
        // const updatedOperations = operations.slice(rowId, 1);
        // const updatedOperations = operations.filter((op) => rowId !== record.id);
        const updatedOperations = operations?.filter(operation => operation?.id !== record.id);
        setOperationDataSrc(updatedOperations);
        setOperations(updatedOperations);
    };

    const [beneficiaryBankAccount, setBeneficiaryBankAccount] = useState("");
    const [beneficiairyBanks, setBeneficiairyBanks] = useState([]);
    const [beneficiaryBankAccountNumbers, setBeneficiaryBankAccountNumbers] = useState([]);
    const [beneficiaryBankAccountNumber, setBeneficiaryBankAccountNumber] = useState("");
      
    const handleBeneficiaryBankAccount= async (id)=>{
        let url = import.meta.env.VITE_USER_API+`/external_entities/${id}/banks`;
        try {
        const response = await fetchData(url);
        if(response.length > 0) {
            setBeneficiairyBanks(response);
            setExternalEntityBankAccountNumbers(response[0]?.bankAccounts);
        }
        } catch (error) {
            openNotification("ECHEC", "Impossible dóbtenir les informations des bank\n du bénéficiaire");
        }
    }

    const operationCol = [
        {
          title: 'Type d\'opération',
          dataIndex: 'label',
          key: '1',
        //   render:(text, record)=>(<>{products.find(product => product.id === text)?.displayName}</>)
        },
        {
          title: 'P.U',
          dataIndex: 'unit_price',
          key: '2',
          render:(text, record)=><>{numberWithCommas(text)}</>
        },
        {
          title: 'Qté',
          dataIndex: 'quantity',
          key: '3',
          render:(text, record)=><>{numberWithCommas(text)}</>
        },
        {
          title: 'Total',
          dataIndex: 'total_price',
          key: '4',
          render: (text, record)=>(
            <>{numberWithCommas(record.total_price)}</>
          )
        },
        {
          title: 'Action',
          render: (text, record)=>(
            <div className='flex items-start space-x-2 text-xs'>
              {/* <span className='text-green-500 cursor-pointer'>Éditer</span> */}
              <span className='text-red-500 cursor-pointer' onClick={()=>handleDelete(record)}>Supprimer</span>
            </div>
          )
        }
    ]

    const handleClearRecipeForm = () => {
        setEmployeeController(employeesControllers[0]?.User.id);
        setPaymentMethod("ESPECES");
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
        
    const [mobileAccounts, setMobileAccounts] = useState([]);
    const [mobileAccount, setMobileAccount] = useState("");
    const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
    const [mobileAccountsSuggestions, setMobileAccountsSuggestions] = useState([]);

    const handleSuggestions = (e) =>{
        setExternalEntityBankAccountNumber(e.target.value);
        let suggestions = mobileAccounts?.filter(account=>account?.name?.includes(e.target.value))
        setMobileAccountsSuggestions(suggestions);
        if(suggestions.length > 0){
            setShowMobileSuggestions(true);
            return;
        }
        setShowMobileSuggestions(false);
    }
    
    const handleCardSuggestions = (e) =>{
        setExternalEntityBankAccountNumber(e.target.value);
        let suggestions = externalEntityBankAccountNumbers?.filter(account=>account?.cardNumber?.includes(e.target.value));
        setMobileAccountsSuggestions(suggestions);
        if(suggestions?.length > 0){
            setShowMobileSuggestions(true);
            return;
        }
        setShowMobileSuggestions(false);
    }

    const handleGetMobileAccounts= async () => {
        try {
            const response = await fetchData(import.meta.env.VITE_USER_API+"/account?type=mobile");
            console.log(response);
            if(!requestError){
                setMobileAccounts(response);
                return;
            }
        } catch (error) {
            openNotification("ECHEC", "Une erreur ")
        }
    }

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
        if(requestError === ""){
            setBankEntity(banks);
            setEntityBankAccountNumbers(banks[0]?.bankAccounts)
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
        // setSelectedOperationType(products[0]?.id);
        setOperationQuantity("");
        setUnitPrice(products[0]?.unit);
        setSelectedOperationType(products[0]?.id);
    }

    const handleCreateOperation = async (e)=>{
        e.preventDefault();
        if(selectedOperationType !== "" && operationQuantity !== "" && unitPrice !== ""){
            const total = +operationQuantity * +unitPrice;
            const label = products?.find(product=>product?.id == selectedOperationType)?.displayName;
            console.log(label);
            const data = {
                id: uuid(),
                "label": label,
                "unit_price": unitPrice,
                "quantity": operationQuantity,
                "total_price": total
            };
            setOperations([data, ...operations]);
            setOperationDataSrc([data, ...operations]);
            setAllOperationsTotal(operationsTotal([data, ...operations]));
            clearOperationsForm();
            setIsAddingOperation(false);
            return;
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

    useEffect(()=>{
        const selectedBank = bankEntity.find(bank=> bank.bank.id === entityBank);
        if(paymentMethod == "VIREMENT"){
            setEntityBankAccountNumbers(selectedBank?.bankAccounts);
            setExternalEntityBankAccountNumber(selectedBank?.bankAccounts[0].id);
            return
        }
        setEntityBankAccountNumber("");
    }, [entityBank]);

    const handleCancelOperationCreation= (e) =>{
        e.preventDefault();
        setIsAddingOperation(false);
        setOperationDataSrc([]);
        setOperations([]);
        clearOperationsForm();
    }

    function operationsTotal(operations) {
        if (!Array.isArray(operations)) {
            throw new TypeError('Input must be an array');
        }
        return operations.reduce((acc, current) => {
            const total = typeof current.total_price === 'number' ? current.total_price : +current.total_price;
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
            "payment_method": [paymentMethod],
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
            setCurrentStep(0);
            setIsOpen(false);
            handleClearRecipeForm();
            openNotification("SUCCESS", "Recette créer avec success.");
            return;
            
            // handleOpenModal("Recette créer avec success.", (<CheckCircleIcon className='text-green-500 h-8 w-8'/>))
        } catch (error) {
            openNotification("ECHEC", "Echec de creation de la recette.");
            // handleOpenModal("Echec de creation de la recette.",(<XMarkIcon className='text-red-500 h-8 w-8'/>))
            console.error("Error creating recipe:", error);
        }
    }
    
    const handleCreateRecettesAndContinue = async (e) =>{
        e.preventDefault();
        const url = import.meta.env.VITE_DAF_API+"/recipesheet/?entity_id="+entityValue;
        const data = {
            "recipe_type": recipeType,
            "employee_controller": employeeController,
            "payment_method": [paymentMethod],
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
            setCurrentStep(0);
            // setIsOpen(false);
            handleClearRecipeForm();
            openNotification("SUCCESS", "Recette créer avec success.");
            return;
            
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
            setUnitPrice(response[0]?.unit)
            setSelectedOperationType(response[0]?.id);
            
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

    // Cancel recipe creation
    const handleCancelRecipeCreation = async () => {
        handleClearRecipeForm();
        handleCreateOperation();
        setOperationDataSrc([]);
        setOperations([]);
        setIsOpen(false);
    };

    useEffect(()=>{
        if(paymentMethod != "VIREMENT"){
            setExternalEntityBankAccountNumber("");
            return;
        }
        setExternalEntityBankAccountNumbers(bankEntity[0]?.bankAccounts);
        setExternalEntityBankAccountNumber(bankEntity[0]?.bankAccounts[0].id);
    }, [paymentMethod]);

    useEffect(()=>{
        handleGetController();
        handleGetSites();
        handleGetallProducts();
        handleExternalEntity();
        handleGetBank();
        handleGetExternalBank();
        handleGetAllEntities();
        handleGetMobileAccounts();
        handleBeneficiaryBankAccount();
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
                        <select name="" id="" value={paymentMethod} onChange={e=>{
                            setPaymentMethod(e.target.value)
                            }}>
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
                        paymentMethod==="PAIMENT MOBILE" &&
                        <div className='w-full flex space-x-2'>
                            <div className='w-full flex flex-col'>
                                <div className='w-full relative flex flex-col'>
                                    <input type="text" value={externalEntityBankAccountNumber} onChange={handleSuggestions} />
                                    {externalEntityBankAccountNumber &&
                                        <ul className={`absolute top-10 bg-white shadow-sm rounded-lg w-full z-100 overflow-y-scroll max-h-[60px]`}>
                                            {
                                                (showMobileSuggestions) &&
                                                mobileAccountsSuggestions.map(account=><li className='text-xs hover:bg-gray-100 p-2 w-full' 
                                                onClick={()=>{
                                                    setExternalEntityBankAccountNumber(account?.name);
                                                    setShowMobileSuggestions(false);
                                                }}>
                                                    {`${account?.name} (${account?.displayName})`}
                                                </li>)
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {
                        (paymentMethod === "CHEQUE" || paymentMethod === "PAIMENT MOBILE") &&
                        <input type="text" value={transactionNumber} onChange={e=>setTransactionNumber(e.target.value)} placeholder='Numéro de transaction'/>
                    }

                    <>
                    { paymentMethod === "VIREMENT" &&
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
                                <select name="" id="" value={entityBankAccountNumber} onChange={e=>setEntityBankAccountNumber(e.target.value)}>
                                    {
                                        entityBankAccountNumbers?.map(accountNumber =><option value={accountNumber?.id} key={accountNumber?.id}>{accountNumber?.account_number}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                    }

                    {
                        (paymentMethod === "VIREMENT" || paymentMethod === "CARTE")&&
                        <VerifyPermissions
                            expected={["accountant"]}
                            // received={userInfo?.role.name || userInfo?.Function.name}
                            roles={userInfo?.role?.name}
                            functions={userInfo?.Function?.name}
                        >
                            {/* Entite extern */}
                            <label htmlFor="" className='text-xs'>Entitées externe</label>
                            <select name="" id="" value={externalEntity} onChange={e=>setExternalEntity(e.target.value)}>
                                {
                                    externalEntities.map(entity =>
                                        <option value={entity?.external_entity.id}>{entity?.external_entity.name}</option>
                                    )
                                }
                            </select>
                        </VerifyPermissions>
                    }
                    {
                        (paymentMethod === "CARTE") &&
                        <div className='w-full flex space-x-2'>
                            <div className='flex flex-col w-1/2'>
                                <label htmlFor="" className='text-xs'>Choisir la banque du client</label>
                                <select className='w-full' value={externalEntityBankAccountNumber} onChange={e=>{
                                    let cardNumbers = beneficiairyBanks?.find(bank=>bank?.bank?.id === e.target.value);
                                    setExternalEntityBankAccountNumbers(cardNumbers)
                                    setBeneficiaryBankAccount(e.target.value);
                                }}>
                                {
                                    beneficiairyBanks?.map(beneficiairy => <option key={beneficiairy?.bank.id} value={beneficiairy?.bank.id}>
                                    {
                                        beneficiairy.bank.sigle
                                    }
                                    </option>)
                                }
                                </select>
                            </div>
                            <div className='w-1/2 flex flex-col'>
                                <div className='w-full relative flex flex-col'>
                                    <label htmlFor="" className='text-xs'>Numéro de la carte :</label>
                                    <input type="text" value={externalEntityBankAccountNumber} onChange={handleCardSuggestions}/>
                                    {   externalEntityBankAccountNumber &&
                                        <ul className={`absolute top-10 bg-white shadow-sm rounded-lg w-full z-100 overflow-y-scroll max-h-[60px]`}>
                                            {
                                                (showMobileSuggestions) &&
                                                mobileAccountsSuggestions.map(card=>
                                                <li 
                                                    className='text-xs  hover:bg-gray-100 p-2 w-full' 
                                                    onClick={()=>{
                                                        setExternalEntityBankAccountNumber(card?.cardNumber);
                                                        setShowMobileSuggestions(false);
                                                    }}
                                                >
                                                    {`${card?.cardNumber}`}
                                                </li>)
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>
                        </div>
                    }

                        
                        {
                            paymentMethod === "VIREMENT" &&
                            <div className='w-full flex flex-col md:flex-row items-center space-x-3 justify-center'>
                            <div className='flex flex-col w-1/2'>
                                <label htmlFor="" className='text-xs'>Choisir la banque du client</label>
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
                                <label htmlFor="" className='text-xs'>Numéro de compte</label>
                                <select className="w-full" name="" id="" value={externalEntityBankAccountNumber} onChange={e=>{
                                    setExternalEntityBankAccountNumber(e.target.value);
                                    // const account = bankEntity.filter(account => account?.bank.id === e.target.value);
                                    //     setAccountNumbers(account[0]?.bank.bank_account);
                                    //     setDestinationAccount("");
                                    }}>
                                    {
                                        externalEntityBankAccountNumbers.map(bank=><option key={bank?.id} value={bank?.id}>{bank?.account_number}</option>)
                                    }
                              </select>
                            </div>
                            </div>
                        }
                      </>
                    
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
                                        setUnitPrice(+price?.unit);
                                    }}>
                                    {
                                        products.map(product=><option key={product?.id} value={product?.id}>{product?.displayName}</option>)
                                    }
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
                            dataSource={operationDataSrc}
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
                        <div className='flex items-center space-x-2'>
                            {
                                !requestLoading &&
                                <button className='btn text-red-500' onClick={handleCancelRecipeCreation}>
                                    Annuler
                                </button>
                            }
                            <button className={`${requestLoading ? "text-gray-500" : "text-green-500" } btn text-sm flex items-center`} onClick={handleCreateRecettesAndContinue}> 
                                <span>{requestLoading ? "En cours..." : "Initier et continue"}</span>
                            </button>
                            <button className={`${requestLoading ? "bg-green-300" : "bg-green-500" } btn text-white text-sm shadow flex items-center`} onClick={handleCreateRecettes}> 
                                <span>{requestLoading ? "En cours..." : "Initier la recette"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </Modal>
        <Popup message={confirmModalText} icons={confirmModalIcon} isOpen={openConfirmModal}/>
    </>
  )
}

export default CreateRecetteForm