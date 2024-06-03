import React, {useEffect, useState} from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import TabsComponent from '../../components/TabsComponents/TabsComponent'
import Tab from '../../components/TabsComponents/Tab'
import { Table, Popover, Drawer, Space } from 'antd'
import {BarsArrowDownIcon, EllipsisHorizontalIcon, FunnelIcon, CheckIcon, XMarkIcon, PencilIcon, TrashIcon} from  '@heroicons/react/24/outline'
import useFetch from '../../hooks/useFetch'

function ReportingPage() {
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

  const [beneficiaires, setBeneficiaires] = useState([]);
  const [sites, setSites] = useState([]);

  const [selectedMonth, setSelectedMonth] =useState("");
  const [to, setTo] =useState("");

  const [cashBalance, setCashBalance] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [recipeTotal, setRecipeTotal] = useState(0);

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
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  const handleGetSite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
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
        console.log(response.annual_sums)
        setExpenseTotal(response.annual_sums[0].total_amount)
      }
      
    } catch (error) {
      console.log(error);
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
      console.log(response)
      setExpensesData(response?.results);
      setExpensesDataSource(response?.results);
    } catch (error) {
      console.error(error)
    }
  }


  // Get the solde the trésorerie
  const handleSoldeTresorerie = async ()=>{

  }

  useEffect(()=>{
    handleFetchAllRecettes();
    handleFetchAllExpenses();
    handleGetSite();
    handleSoldeTresorerie();
    handleBenef();
    handleGetExpenseSummary();
    handleGetRecipeSummary();
  }, []);


  useEffect(()=>{
    setCashBalance(+recipeTotal - +expenseTotal)
  }, [expenseTotal, recipeTotal]);

  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }

  // const content = (
  //   <div>
  //     <select name="" id=""className='w-full'>
  //       <option value="">Date </option>
  //       <option value="">Shift </option>
  //       <option value="">Provenance </option>
  //     </select>
  //   </div>
  // );

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
        <>{beneficiaires.find(employee=>employee?.User?.id === text)?.User?.name?.toUpperCase()}</>
      )
    },
    {
      title: 'Provenance',
      dataIndex: 'provenance',
      key: 'provenance',
      width:  "200px",
    },
    {
      title: 'Pont',
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
      title: 'Type de pesées',
      dataIndex: 'shift',
      key: 'shift',
      width:"200px",
    },
    {
      title: 'Montant',
      dataIndex: 'shift',
      key: 'shift',
      width:"200px",
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
    },
  ]

  const expensesCol = [
    {
      title: 'Numéro de références',
      dataIndex: 'reference_number',
      key: 'reference_number',
      width:  "200px",
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
      width:  "200px",
      render: (text, record)=>{
        const site = sites?.find(site=>site.id === record.site)
        return <>{site?.name != undefined? site?.name :text }</>
      }
    },
    {
      title: 'Beneficiaire',
      dataIndex: 'employee_beneficiary',
      key: 'employee_beneficiary',
      width:  "200px",
      render: (text, record)=>beneficiaires.find(benef=> benef?.User.id === text)?.User.name.toUpperCase()
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      width:  "200px",
      render: (text)=><>{numberWithCommas(text)} XAF</>
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
    console.log(selectedMonth)
    const filteredExpenses = expensesData.filter(expense=>expense?.reference_number.split('/')[1] == selectedMonth);
    console.log(filteredExpenses)
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
          <div className='mt-2 md:mt-0'>
            <h3 className='text-sm'>
              Solde trésorerie : <b className={`btn bg-yellow-300`}>{numberWithCommas(cashBalance)} XAF</b>
            </h3>
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
                <p>Total : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(path === "recettes" ? recipeTotal : expenseTotal)} XAF</b></p>
              </div>
            )}
            scroll={{
              y: "50vh",
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

export default ReportingPage
