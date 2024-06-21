import React, {useEffect, useState} from 'react'
import useFetch from '../../hooks/useFetch'

function createRecipeForm({onSubmit}) {
    // Global variables

    // Hooks
    const { fetchData, postData, requestError, requestLoading } = useFetch();

    // States
    const [externalEntities, setExternalEntities] = useState([]);
    const [sites, setSites] = useState([]);
    const [entityBanks, setEntitiesBanks] = useState([]);
    const [externalEntitiesBanks, setExternalEntitiesBanks] = useState([]);
    const [entityBankAccounts, setEntitiesBankAccounts] = useState([]);
    const [externalEntitiesBankAccounts, setExternalEntitiesBankAccounts] = useState([]);
    const [products, setProducts] = useState([]);


    // {
    //     "recipe_type": recipeType,
    //     "employee_controller": employeeController,
    //     "payment_method": [paymentMethod],
    //     "total_amount": totalAmount,
    //     "provenance": provenanceValue,
    //     "description": descriptionValue,
    //     "shift": shiftValue,
    //     "file_number": fileNumber,
    //     "corporate_name": corporateName,
    //     "uin_client": uinClient,
    //     "bank_account_number": entityBankAccountNumber,
    //     "client_bank_account_number": externalEntityBankAccountNumber,
    //     "it_is_a_cash_desk_movement": false,
    //     "transaction_number": transactionNumber,
    //     "cash_desk_number": cashDeskNumber,
    //     "site": siteValue,
    //     "entity": entityValue,
    //     "operation_types" : operations
    // }

    // *****Recipe states
    const [recipeType, setRecipeType] = useState("");
    const [controller, setController] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [totalAmount, setTotalAmount] = useState("");
    const [origin, setOrigin] = useState("");
    const [desription, setDescription] = useState("");
    const [shift, setShift] = useState("");
    const [fileNumber, setFileNumber] = useState("");
    const [corporateName, setCorporateName] = useState("");
    const [uinClient, setUinClient] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [clientBankAccountNumber, setClientBankAccountNumber] = useState("");
    const [isCashDeskMovement, setIsCashDeskMovement] = useState(false);
    const [transactionNumber, setTransactionNumber] = useState("");
    const [cashDeskNumber, setCashDeskNumber] = useState("");
    const [site, setSize] = useState("");
    const [operations, setOperations] = useState([]);

    // *****Operations States
    const [product, setProduct] = useState("");
    const [amount, setAmount] = useState("");
    const [qty, setQty] = useState("");
    const [OperationsTotalAmount, setOperationsTotalAmounts] = useState("");
    // Handlers

    // Methods
    /**
     * Get the all related external entities
    */
   const getAllExternalEntities = async ()=>{
    let url = import.meta.env.VITE_USER_API+"/external_entities";
    try {
        let response = await fetchData(url);
        if(!requestError){
            setExternalEntities(response);
            return;
        }

    } catch (error) {
        console.warn(error.message);
    }
   }

   /**
    * Get all sites realted to the entity
    */
   const getAllSites = async ()=>{
    let url = import.meta.env.VITE_USER_API+"/sites";
    try {
        let response = await fetchData(url);
        if(!requestError){
          setSiteValue(response[0]?.id);
          setSites(response);
        }
    } catch (error) {
        console.warn(error);
    }
   }

   
    // SideEffects
    useEffect(()=>{
        getAllSites();
        getAllExternalEntities();
    }, []);

  return (
    <form >

    </form>
  )
}

export default createRecipeForm