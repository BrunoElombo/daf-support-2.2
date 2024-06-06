import React, { useState, useContext, useEffect } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import { AUTHCONTEXT } from '../../context/AuthProvider'
import TabsComponent from '../../components/TabsComponents/TabsComponent'
import VerifyPermissions from '../../components/Permissions/VerifyPermissions'
import Tab from '../../components/TabsComponents/Tab'
import PageHeader from '../../components/PageHeader/PageHeader'
import useFetch from '../../hooks/useFetch'
import { Modal, Table } from 'antd'
import ApproForm from '../Reporting/ApproForm'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

function Caisse() {
  const [path, setPath] = useState("billeterie");
  const {userInfo} = useContext(AUTHCONTEXT);
  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();

  // Approvisionement
  const [openApproModal, setOpenApproModal] = useState(false);

  // Billeterie
  const  [billeterieFormIsOpen, setBilleterieFormIsOpen] = useState(false);
  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }

  const APPRO_COLUMNS = [
    { title: "#", dataIndex: "id", key: "id", width: "200px" },
    { title: "Numéro ref", dataIndex: "ref_number", key: "ref_number", width: "200px" },
    { title: "Initiateur", dataIndex: "initiator", key: "initiator", width: "200px" },
    { title: "Provenance", dataIndex: "origin", key: "origin", width: "200px" },
    { title: "Destination", dataIndex: "destination", key: "destination", width: "200px" },
    { title: "Montant", dataIndex: "amount", key: "amount", width: "200px" },
    { title: "Site", dataIndex: "site", key: "site", width: "200px" },
    { title: "Entite", dataIndex: "entity", key: "entity", width: "200px" },
    { title: "Actions", dataIndex: "", key: "actions", width: "200px", render: () => <p></p> }
  ];

  const CASH_DESK_COLUMNS = [
    { title: "Numéro de référence", dataIndex: "reference_number", key: "reference_number" },
    { title: "Caisse enregistreuse", dataIndex: "cash_register", key: "cash_register" },
    { title: "Monnaie", dataIndex: "currency", key: "currency" },
    {
      title: "Employer initiateur",
      dataIndex: "employee_initiator",
      key: "employee_initiator",
      render: (text) => employees.find(emp => emp?.User.id === text)?.User.name.toUpperCase()
    },
    { title: "Montant Total", dataIndex: "total_amount", key: "total_amount" },
    { title: "État des caisses actuel", dataIndex: "current_step_cash_state", key: "current_step_cash_state" },
    {
      title: "Site",
      dataIndex: "site",
      key: "site",
      render: (text, record) => {
        const site = sites?.find(site => site.id === record.site);
        return site?.name || text;
      }
    },
    {
      title: "Entites",
      dataIndex: "entity",
      key: "entity",
      render: (text) => entities.find(entity => entity?.id === text)?.Sigle.toUpperCase()
    }
  ];

  const [cashDeskStateData, setCashDeskStateData] = useState([]);
  const [cashDeskState, setCashDeskState] = useState([]);

  //   Get the cashdsk state data
  const handleGetCashDeskState= async ()=>{
      try {
          const url = import.meta.env.VITE_DAF_API+"/cash_desk_state/?entity_id="+entityId
          const response = await fetchData(url);
          console.log(response?.results)
          setCashDeskStateData(response?.results);
          setCashDeskState(response?.results);
      } catch (error) {
          console.log(error)
      }
  }

  // Get the sites
  const [sites, setSites] = useState([]);
  const handleGetSite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites/all");
    if(!requestError){
      setSites(response);
    }
  }

  // Get the employees
  const [employees, setEmployees] = useState([]);
  const handleGetEmployees = async()=>{
      try {
        const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees");
        setEmployees(benef);
      } catch (error) {
        console.log(error.message);
      }
  }

  // Get the entities
  const [entities, setEntities] = useState([]);
  const handleGetAllEntities = async ()=>{
    try {
      const benef = await fetchData(import.meta.env.VITE_USER_API+"/entities/all");
      setEntities(benef);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    handleGetCashDeskState();
    handleGetSite();
    handleGetEmployees();
    handleGetAllEntities();
  }, [])

  
  return (
    <LoginLayout>
        <TabsComponent>
          {/* <Tab
            title={<p>Appro caisse</p>}
            isActive={path === "appro"}
            onClick={()=>handleTabClick("appro")}
          /> */}
          <Tab
            title={<p>Billeterie</p>}
            isActive={path === "billeterie"}
            onClick={()=>handleTabClick("billeterie")}
          />
          <Tab
            title={<p>Trésorerie</p>}
            isActive={path === "tresorerie"}
            onClick={()=>handleTabClick("tresorerie")}
          />
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
                      <button 
                        className='btn bg-green-500 text-white text-sm'
                        onClick={()=>setBilleterieFormIsOpen(true)}
                      >
                        Enregistrer l'etat
                      </button>
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
                  columns={path === "appro" ? APPRO_COLUMNS : path === "billeterie" ? CASH_DESK_COLUMNS:[]}
                  dataSource={path === "appro" ? [] : path === "billeterie" ? cashDeskState:[]}
                  footer={()=>(
                    <div></div>
                  )}
                  loading={requestLoading}
                  pagination={{
                    pageSize: 50,
                  }}
                  scroll={{
                    x: 500,
                    y: "80vh"
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
            <ApproForm /> 
          </div>
        </Modal>
        

        {/* Modal de la billieterie */}
        <Modal
          open={billeterieFormIsOpen}
          onCancel={()=>setBilleterieFormIsOpen(false)}
          title={<p className='flex items-center space-x-2'>
            <ArrowsRightLeftIcon className='text-gray-500 h-6 w-6'/>
            <span></span>
          </p>}
          footer={()=>{}}
        >
          <div className='pt-5'>
          </div>
        </Modal>
    </LoginLayout>
  )
}

export default Caisse