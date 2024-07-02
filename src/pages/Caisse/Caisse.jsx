import React, { useState, useContext, useEffect } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import { AUTHCONTEXT } from '../../context/AuthProvider'
import TabsComponent from '../../components/TabsComponents/TabsComponent'
import VerifyPermissions from '../../components/Permissions/VerifyPermissions'
import Tab from '../../components/TabsComponents/Tab'
import PageHeader from '../../components/PageHeader/PageHeader'
import useFetch from '../../hooks/useFetch'
import { Drawer, Modal, Table } from 'antd'
import ApproForm from '../Reporting/ApproForm'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import StateForm from '../../components/caisse/StateForm'

function Caisse() {
  const [path, setPath] = useState("appro");
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
  const [] = useState()
  // Approvisionement
  const [openApproModal, setOpenApproModal] = useState(false);

  // Billeterie
  const  [billeterieFormIsOpen, setBilleterieFormIsOpen] = useState(false);
  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }


  const [banks, setBanks] = useState([]);
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [entities, setEntities] = useState([]);
  const [cashDesks, setCashDesks] = useState([]);

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
        setCashDeskState(response?.results);
        setCashDeskStateSrc(response?.results);
    } catch (error) {
        console.log(error)
    }
  } 

// Get the sites
const handleGetSite=async()=>{
  let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
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
    const benef = await fetchData(import.meta.env.VITE_USER_API+"/entities/all");
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



  const SUPPLY_COLUMNS = [
    { title: "#", key: "1", width: "50px", render: (text, record)=><>{supplyData.indexOf(record)+1}</>},
    { title: "Numéro ref", dataIndex: "reference_number", key: "2", width: "200px" },
    { 
      title: "Provenance", 
      dataIndex: "bank_account_listing", 
      key: "3", 
      width: "200px",
      onCell: (_, index)=>{
        console.log("129", index, _)
      },
      render:(text, record)=>{
        //Convert each item to corresponding bank
        let convertedBanksIds = record.bank_account_listing.map(bank=>{
          let bankAcronyme = banks.find(item=>item?.bank.id == bank)?.bank?.Acronyme
          return bankAcronyme;
        }
        )
        return <>{convertedBanksIds.join(", ")}</>
      }
    },
    { 
      title: "Destination", 
      dataIndex: "cash_registers_listing", 
      key: "4", 
      width: "200px",
      render:(text, record)=>{
        let convertedCashDesk = record.cash_registers_listing.map(regDesk=>{
          let deskName = cashDesks.find(desk=> desk.id === regDesk)?.name;
          console.log(deskName);
          return deskName;
        });
        console.log(convertedCashDesk)
        return <>{convertedCashDesk?.join(", ")}</>
      } 
    },
    { 
      title: "Montant", 
      dataIndex: "amount_brakdown", 
      key: "amount_brakdown", 
      width: "200px",
      render: (text, record)=>{
        let convertData = record?.amount_brakdown.map(amount=>numberWithCommas(amount))
        return <p>{convertData.join("; ")}</p>
      } 
    },
    { title: "Montant total", dataIndex: "total_amount", key: "amount", width: "200px", render:(text)=><>{numberWithCommas(text)}</>},
    { 
      title: "Site", 
      dataIndex: "site", 
      key: "site", 
      width: "200px",
      render:(text)=>{
        let siteName = sites.find(site=>site.id  == text)?.name;
        return <>{siteName}</>
      } 
    }
  ];

  const CASH_DESK_COLUMNS = [
    { title: "Numéro de référence", dataIndex: "reference_number", key: "1" },
    { title: "Caisse enregistreuse", dataIndex: "cash_register", key: "2" },
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
  }, [])

  
  return (
    <LoginLayout>
        <TabsComponent>
          <Tab
            title={<p>Appro caisse</p>}
            isActive={path === "appro"}
            onClick={()=>handleTabClick("appro")}
          />
          <Tab
            title={<p>État de caisse</p>}
            isActive={path === "billeterie"}
            onClick={()=>handleTabClick("billeterie")}
          />
          {/* <Tab
            title={<p>Trésorerie</p>}
            isActive={path === "tresorerie"}
            onClick={()=>handleTabClick("tresorerie")}
          /> */}
        </TabsComponent>
        <div className='p-3'>
            <div>
              <h3>{path == "appro" ? "Appro caisse" : path == "billeterie" ? "Billeterie" :path == "tresorerie" && "Tresorerie"}</h3>
              <PageHeader>
                <div className='flex items-center justify-between w-full'>
                  <input type="search" className='text-sm' placeholder='Recherche'/>
                  <VerifyPermissions
                      expected={["cashier"]}
                      roles={userInfo?.role?.name}
                      functions={userInfo?.Function?.name}
                  >
                    {
                      path == "billeterie"?
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
                  dataSource={path == "appro" ?supplyData : path == "billeterie" ? cashDeskState : path == "tresorerie" && []}
                  columns = {path == "appro" ? SUPPLY_COLUMNS : path == "billeterie" ? CASH_DESK_COLUMNS :path == "tresorerie" && []}
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

        {/* Initiation d'appro */}
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

        <Drawer
          title={<p>Détails de la billeterie</p>}
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