import React, { useState, useContext, useEffect } from 'react';
import LoginLayout from '../../Layout/LoginLayout';
import { AUTHCONTEXT } from '../../context/AuthProvider';
import TabsComponent from '../../components/TabsComponents/TabsComponent';
import VerifyPermissions from '../../components/Permissions/VerifyPermissions';
import Tab from '../../components/TabsComponents/Tab';
import { FunnelIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader/PageHeader';
import useFetch from '../../hooks/useFetch';
import { Drawer, Modal, Table, Popover } from 'antd';
import ApproForm from '../Treasury/ApproForm';
import { ArrowsRightLeftIcon, CheckIcon, XMarkIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import StateForm from '../../components/caisse/StateForm';
import CaissePageHeader from './CaissePageHeader';
import MandatoryForm from './MandatoryForm';
import SupplyFilter from './SupplyFilter';

function Caisse() {
  const [path, setPath] = useState("supply");
  const {userInfo} = useContext(AUTHCONTEXT);
  /**
   * Commas to numbers
   */
  const numberWithCommas=(x)=>{
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();

  // UseState
  const [mandateFormIsOpen, setMandateFormIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");

  const [cashBalance, setCashBalance] = useState("");

  const [banks, setBanks] = useState([]);
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [entities, setEntities] = useState([]);
  const [cashDesks, setCashDesks] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Approvisionement
  const [openApproModal, setOpenApproModal] = useState(false);

  // State
  const  [billeterieFormIsOpen, setBilleterieFormIsOpen] = useState(false);
  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }


  //   Get the cashdsk state data
  const handleGetSupply= async ()=>{
    try {
        const url = import.meta.env.VITE_DAF_API+"/cash_desk_movement/?entity_id="+entityId
        const response = await fetchData(url);
        setSupplyDataSrc(response);
        setSupplyData(response);
    } catch (error) {
        console.log(error)
    }
  } 

  const handleGetCashDeskMovement= async ()=>{
    try {
        const url = import.meta.env.VITE_DAF_API+"/cash_desk_state/?entity_id="+entityId
        const response = await fetchData(url);
        setCashBalance(response?.results[0])
        setCashDeskState(response?.results);
        setCashDeskStateSrc(response?.results);
    } catch (error) {
        console.log(error)
    }
  } 

// Get the sites
const handleGetSite=async()=>{
  let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/");
  if(!requestError){
    setSites(response);
  }
}

// Get the employees
const handleGetEmployees = async()=>{
    try {
      const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees");
      setEmployees(benef);
    } catch (error) {
      console.log(error.message);
    }
}

// Get the entities
const handleGetAllEntities = async ()=>{
  try {
    const benef = await fetchData(import.meta.env.VITE_USER_API+"/entities");
    setEntities(benef);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Get entity banks
 */
const handleGetBank= async()=>{
  try {
      const response = await fetchData(import.meta.env.VITE_USER_API+"/banks/entity_banks");
      setBanks(response);
  } catch (error) {
      console.error("Get banks:", error);
  }
}

/**
 * Get all the cash desk
 */
const handleGetCashDesk= async()=>{
  const response = await fetchData(import.meta.env.VITE_USER_API+"/cash-desk");
  if(!requestError){
      setCashDesks(response);
  }
}

/**
 * Highlight the 
 */
const highlightText = (text) => {
  if (!searchValue) return text;

  const regex = new RegExp(searchValue, 'gi');
  return <span dangerouslySetInnerHTML={{ __html: text.replace(
    new RegExp(searchValue, 'gi'),
    (match) => `<mark style="background-color: yellow;">${match}</mark>`
  )}} />
};

/**
 * Multi criterial filtering
 */



  const SUPPLY_COLUMNS = [
    { title: "#", key: "1", width: "50px", render: (text, record)=><>{supplyData.indexOf(record)+1}</>},
    { 
      title: "Numéro ref", 
      dataIndex: "reference_number", 
      key: "2", 
      width: "200px",
      render:(text, record)=>{
        return <>{highlightText(text)}</>
      } 
    },
    { 
      title: "Compte bancaire", 
      dataIndex: "bank_account", 
      key: "3", 
      width: "200px",
      render: (text, record)=><>{highlightText(text)}</>
    },
    { 
      title: "Caisse", 
      dataIndex: "cash_register", 
      key: "4", 
      width: "200px",
      render:(text, record)=>{
        let deskName = cashDesks.find(desk=> desk?.id === text)?.name;
        return <>{highlightText(deskName)}</>
      } 
    },
    { 
      title: "Mandataire", 
      dataIndex: "bank_mandate", 
      key: "3", 
      width: "200px",
      render:(text, record)=>{
        let convertedEmployeeIds = employees?.find
        (employee=>employee?.User?.id == text)
        return <p className='capitalize'>{highlightText(convertedEmployeeIds?.User?.name)}</p>
      }
    },
    { 
      title: "Montant", 
      dataIndex: "amount", 
      key: "amount", 
      width: "200px",
      render:(text, record)=>{
        let amount = numberWithCommas(text);
      return <>{highlightText(amount)}</>
    }
    },
    { 
      title: "Statut", 
      dataIndex: "status", 
      key: "status", 
      width: "200px",
      render:(text, record)=><span className={`p-1 ${record.statut !== "EXECUTED" ? "bg-red-500": "bg-green-500"} text-center text-white text-xs rounded-full px-3`}>Mandataire</span>
    },
    { 
      title: "Action", 
      dataIndex: "status", 
      key: "status", 
      width: "200px",
      render:(text, record)=>(
        <div className='flex space-x-2 items-center'>
          {
            record.statut != "EXECUTED" &&
            <div className='hover:bg-gray-200 p-2 rounded-md cursor-pointer'>
              <PencilIcon 
                className='text-gray-500 h-4 w-4' 
                onClick={()=>{
                  setSelectedRow(record);
                  setMandateFormIsOpen(true);
                }}
              />
            </div>
          }
          <EyeIcon className='text-gray-500 h-4 w-4'/>
        </div>
      )
    },
    // { title: "Montant total", dataIndex: "total_amount", key: "amount", width: "200px", render:(text)=><>{numberWithCommas(text)}</>},
    { title: "Entité", dataIndex: "entity", 
      width: "200px",
      render:(text, record)=>{
        let entityName = entities.find(entity => entity.id === text)?.Sigle;
        return <>{entityName}</>
      }
    },
    { 
      title: "Site", 
      dataIndex: "site", 
      key: "site", 
      width: "200px",
      render:(text)=>{
        let siteName = sites.find(site=>site?.id  == text)?.name;
        return <p className='capitalize'>{siteName}</p>
      } 
    },
  ];

  const CASH_DESK_COLUMNS = [
    { title: "Numéro de référence", dataIndex: "reference_number", key: "1" },
    { 
      title: "Caisse enregistreuse", 
      dataIndex: "cash_register", 
      key: "2",
      width: "200px",
      render:(text, record)=>{
        let deskName = cashDesks.find(desk=> desk?.id === text)?.name;
        return <>{deskName || "N/A"}</>
      }  
    },
    { title: "Monnaie", dataIndex: "currency", key: "3" },
    { title: "Montant", dataIndex: "total_amount", key: "4",
      render:(text, record)=>{
        return <p className={`${+text < 0 && "p-1 bg-red-100 border-[1px] border-red-500 rounded-lg" }`}>{numberWithCommas(text)}</p>
      }
    },
    { title: "État de caisse", dataIndex: "current_step_cash_state", key: "5"},
    { title: "Entité", dataIndex: "entity", key: "7",
      render:(text, record)=>{
        let entityName = entities.find(entity => entity.id === text)?.Sigle;
        return <>{entityName}</>
      }
    },
  ];

  const [supplyDataSrc, setSupplyDataSrc] = useState([]);
  const [supplyData, setSupplyData] = useState([]);
  const [cashDeskState, setCashDeskState] = useState([]);
  const [cashDeskStateSrc, setCashDeskStateSrc] = useState([]);


  useEffect(()=>{
    handleGetSupply();
    handleGetCashDeskMovement();
    handleGetSite();
    handleGetEmployees();
    handleGetAllEntities();
    handleGetBank();
    handleGetCashDesk();
  }, []);

  useEffect(()=>{
    if(path === 'supply'){
      if(searchValue.length > 0){
        const search = supplyDataSrc?.filter((item) => {
            const searchTextLower = searchValue.toLowerCase();
            return(
              item?.reference_number.toString().toLowerCase().includes(searchTextLower) ||
              item?.amount.toString().toLowerCase().includes(searchTextLower) ||
              item?.currency.toString().toLowerCase().includes(searchTextLower) ||
              item?.bank_account.toString().toLowerCase().includes(searchTextLower) ||
              employees?.find(employee => employee?.User.id == item?.bank_mandate)?.User?.name?.toLowerCase().includes(searchTextLower) ||
              sites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower) ||
              cashDesks.find(desk=> desk?.id === item?.cash_register)?.name.toLowerCase().includes(searchTextLower)
            )
        })
        setSupplyData(search)
      }else{
        setSupplyData(supplyDataSrc);
      }
    }

    if(path === 'state'){
      if(searchValue?.length > 0){
        const search = cashDeskState?.filter((item) => {
          const searchTextLower = searchValue.toLowerCase();
        return(
          item?.reference_number.toString().toLowerCase().includes(searchTextLower) ||
          item?.amount.toString().toLowerCase().includes(searchTextLower) ||
          item?.currency.toString().toLowerCase().includes(searchTextLower) ||
          // employees?.find(employee => employee?.User.id == item?.employee_controller)?.User?.name?.toLowerCase().includes(searchTextLower) ||
          sites?.find(site => site?.id == item?.site)?.name.toLowerCase().includes(searchTextLower) 
        )
      })
        // setRecetteDataSrc(search)
      }else{
        // setRecetteDataSrc(filteredData);
      }
    }
  
  }, [searchValue]);


  
  return (
    <LoginLayout>
        <CaissePageHeader 
          cashBalance={cashBalance?.total_amount}
        />
        <TabsComponent>
          <Tab
            title={<p>Appro caisse</p>}
            isActive={path === "supply"}
            onClick={()=>handleTabClick("supply")}
          />
          <Tab
            title={<p>État de caisse</p>}
            isActive={path === "state"}
            onClick={()=>handleTabClick("state")}
          />
          {/* <Tab
            title={<p>Trésorerie</p>}
            isActive={path === "tresorerie"}
            onClick={()=>handleTabClick("tresorerie")}
          /> */}
        </TabsComponent>
        <div className='p-3'>
            <div>
              <h3>{path == "supply" ? "Supply caisse" : path == "state" ? "State" :path == "tresorerie" && "Tresorerie"}</h3>
              <PageHeader>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center space-x-2'>
                    <input type="search" className='text-sm' placeholder='Recherche' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
                    <Popover content={path === 'supply' ? <SupplyFilter setSupplyData={setSupplyData}/>: <></>} title="Filtre" trigger="click">
                        <button className='w-auto text-sm text-white btn bg-green-500 p-2 rounded-lg shadow-sm flex items-center'>
                          <FunnelIcon className='text-white w-4 h-4'/>
                          Filtre
                        </button>
                    </Popover>
                  </div>
                  <VerifyPermissions
                      expected={["cashier"]}
                      roles={userInfo?.role?.name}
                      functions={userInfo?.Function?.name}
                  >
                    {
                      path == "state"?
                      <></>
                      :
                      <button 
                        className='btn bg-green-500 text-white text-sm'
                        onClick={()=>setOpenApproModal(true)}
                      >
                        Initier un appro.
                      </button>
                    }
                </VerifyPermissions>
                </div>
              </PageHeader>
              <div className='border-[1px] border-gray-100 p-3 rounded-lg mt-3'>
                <Table 
                  dataSource={path == "supply" ?supplyData : path == "state" ? cashDeskState : path == "tresorerie" && []}
                  columns = {path == "supply" ? SUPPLY_COLUMNS : path == "state" ? CASH_DESK_COLUMNS :path == "tresorerie" && []}
                  footer={()=>(
                    <div></div>
                  )}
                  loading={requestLoading}
                  pagination={{
                    pageSize: 50,
                  }}
                  scroll={{
                    x: 500,
                    y: "50vh"
                  }}
                />
              </div>
            </div>
        </div>

        {/* Initiation d'supply */}
        <Modal
          open={openApproModal}
          onCancel={()=>setOpenApproModal(false)}
          title={<p className='flex items-center space-x-2'>
            <ArrowsRightLeftIcon className='text-gray-500 h-6 w-6'/>
            <span>Initier un approviationement</span>
          </p>}
          footer={()=>{}}
        >
          <div className='pt-5'>
            <ApproForm 
              onSubmit={
                ()=>{
                  setOpenApproModal(false);
                  handleGetSupply();
                }
              }
            /> 
          </div>
        </Modal>
        

        {/* Modal de la billieterie */}
        <Modal
          open={billeterieFormIsOpen}
          onCancel={()=>setBilleterieFormIsOpen(false)}
          title={<p className='flex items-center space-x-2'>
            <ArrowsRightLeftIcon className='text-gray-500 h-6 w-6'/>
            <span>État de caisse</span>
          </p>}
          footer={()=>{}}
        >
          <div className='pt-5'>
            <StateForm onSubmit={()=>{
              handleGetSupply();
              setBilleterieFormIsOpen(false);
            }}/>
          </div>
        </Modal>

        {/* Madate form */}
        <Modal
          title="Observation du mandataire"
          onClose={()=>setMandateFormIsOpen(false)}
          onCancel={()=>setMandateFormIsOpen(false)}
          open={mandateFormIsOpen}
          footer={()=>{}}
        >
          <MandatoryForm 
            selected={selectedRow}
            onSubmit={()=>{
              setMandateFormIsOpen(false);
              handleGetSupply();
            }}
          />
        </Modal>

        <Drawer
          title={<p>Détails de la state</p>}
          placement={"bottom"}
          width={500}
          height={"90vh"}
          onClose={false}
          open={false}
          extra={
            <>

            </>
          }
        >

        </Drawer>

    </LoginLayout>
  )
}

export default Caisse