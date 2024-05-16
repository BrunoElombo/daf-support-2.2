import React, {useEffect, useState} from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import TabsComponent from '../../components/TabsComponents/TabsComponent'
import Tab from '../../components/TabsComponents/Tab'
import { Table, Popover, Drawer, Space } from 'antd'
import {BarsArrowDownIcon, EllipsisHorizontalIcon, FunnelIcon, CheckIcon, XMarkIcon, PencilIcon, TrashIcon} from  '@heroicons/react/24/outline'
import useFetch from '../../hooks/useFetch'

function ReportingPage() {
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
  const [expensesData, setExpensesData] = useState([]);

  const [beneficiaires, setBeneficiaires] = useState([]);
  const [sites, setSites] = useState([]);

  const [selectedMonth, setSelectedMonth] =useState("");
  const [to, setTo] =useState("");

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
    if(!requestError){
      setSites(response?.result.results);
    }
  }

  const handleBenef = async()=>{
    const benef = await fetchData(import.meta.env.VITE_USER_API+"/users");
    if(!requestError){
      let result = benef?.result.results;
      setBeneficiaires(result);
    }

  }

  const handleFetchAllRecettes =async ()=>{
    const url = import.meta.env.VITE_DAF_API+"/expensesheet/";
    const response = await fetchData(url);
    if(!requestError){
      setExpensesData(response?.result);
      setExpensesDataSource(response?.result);
    }
    console.log("Failed to fetch")
  }


  useEffect(()=>{
    handleFetchAllRecettes();
    handleGetSite();
    handleBenef();
  }, []);

  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }

  const content = (
    <div>
      <select name="" id=""className='w-full'>
        <option value="">Date </option>
        <option value="">Shift </option>
        <option value="">Provenance </option>
      </select>
    </div>
  );

  const recetteCol = [
    {
      title: 'No de références',
      dataIndex: 'ref_number',
      key: 'ref_number',
    },
    {
      title: 'Jour',
      dataIndex: 'controler',
      key: 'controler',
    },
    {
      title: 'Shift',
      dataIndex: 'origin',
      key: 'origin',
    },
    {
      title: 'Pont',
      dataIndex: 'date_init',
      key: 'date_init',
    },
    {
      title: 'Nombre de pesées',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'Type de pesées',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'Montant',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'Actions',
      render: ()=>(
        <EllipsisHorizontalIcon className='text-gray-500 h-6 w-6 cursor-pointer' onClick={()=>setOpen(true)}/>
        // <button className='btn btn-primary bg-green-500 text-white text-sm'>Valider</button>
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
        console.log(beneficiaire)
        return <>{!beneficiaire?text:beneficiaire?.first_name}</>
       
      }
    },
    {
      title: 'Montant (XAF)',
      dataIndex: 'amount',
      key: 'amount',
      render:(text, record)=><>{numberWithCommas(text)}</>
    },
    {
      title: 'Status',
      render:(text, record)=>(
        <div className='flex space-x-2'>
          <div 
            className={`${record.dop_validated ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DEX</div>
          <div className={`${record.daf_validated ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DAF</div>
          <div className={`${record.dg_validated ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>DG</div>
          <div className={`${record.pre_validated ?"bg-green-500":"bg-red-500 "} w-1/4 text-xs h-3 rounded-full text-white flex justify-center items-center`}>PRE</div>
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
        <h3>REPORTING</h3>
        <PageHeader>
          <div className='flex items-center space-x-2'>
              <Popover
                 content={content} trigger="click" placement="bottomLeft"
              >
                <div className='shadow p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center'>
                  <FunnelIcon className='w-4 h-4'/>
                </div>
              </Popover>
            <div className='shadow p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center'>
              <BarsArrowDownIcon className='w-4 h-4'/>
            </div>
          </div>
          <div className='flex space-x-3 items-center'>
            <h3 className='text-sm'>Filtre par mois:</h3>

            <select value={selectedMonth} onChange={handleChange} className='text-sm'>
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {/* <select name="" id="" className='text-sm' value={to} onChange={e=>setTo(e.target.value)}>
              <option value="">Au</option>
              <option value="01">Janvier</option>
              <option value="02">Février</option>
              <option value="03">Mars</option>
              <option value="04">Avril</option>
              <option value="05">Mai</option>
              <option value="06">Juin</option>
              <option value="07">Juillet</option>
              <option value="08">Aout</option>
              <option value="09">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Decembre</option>
            </select> */}

            <input type="search" placeholder='Recherche' className='text-sm'/>
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
                <p>Total : <b className='bg-yellow-300 p-2 rounded-lg'>{expensesData?.length > 0 ? numberWithCommas(sumMontants(expensesData)):"0"} XAF</b></p>
              </div>
            )}
            scroll={{
              y: "150px",
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
