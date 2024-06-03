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
  const [path, setPath] = useState("appro");
  const {userInfo} = useContext(AUTHCONTEXT);
  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;
  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();

  // Approvisionement
  const [openApproModal, setOpenApproModal] = useState(false);
  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }

  const APPRO_COLUMNS = [
    {
      title:"#",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Numéro ref",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Initiateur",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Provenance",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Destination",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Montant",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Site",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Entite",
      dataIndex:"",
      key:"",
      width: "200px",
    },
    {
      title:"Actions",
      dataIndex:"",
      key:"",
      width: "200px",
      render:(text, record)=><p></p>
    },
  ];

  const CASH_DESK_COLUMNS = [
    {
      title:"Numéro de référence",
      dataIndex:"reference_number",
      key:"reference_number",
      width: "200px",
    },
    {
      title:"Caisse enregistreuse",
      dataIndex:"cash_register",
      key:"cash_register",
      width: "200px",
    },
    {
      title:"Monnaie",
      dataIndex:"currency",
      key:"currency",
      width: "200px",
    },
    {
      title:"Employer initiateur",
      dataIndex:"employee_initiator",
      key:"employee_initiator",
      width: "200px",
      render: (text, record)=>employees.find(benef=> benef?.User.id === text)?.User.name.toUpperCase()
    },
    {
      title:"Montant Total",
      dataIndex:"total_amount",
      key:"total_amount",
      width: "200px",
    },
    {
      title:"État des caisses actuel",
      dataIndex:"current_step_cash_state",
      key:"current_step_cash_state",
    },
    {
      title:"Site",
      dataIndex:"site",
      key:"site",
      width: "200px",
      render: (text, record)=>{
        const site = sites?.find(site=>site.id === record.site)
        return <>{site?.name != undefined? site?.name :text }</>
      }
    },
    {
      title:"Entites",
      dataIndex:"entity",
      key:"entity",
      width: "200px",
      render: (text, record)=>entities.find(entity=> entity?.id === text)?.Sigle.toUpperCase()
    },
    // {
    //   title:"Actions",
    //   dataIndex:"",
    //   key:"",
    //   render:(text, record)=><p></p>
    // },
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

  const [sites, setSites] = useState([]);
  const handleGetSite=async()=>{
    let response = await fetchData(import.meta.env.VITE_USER_API+"/sites");
    if(!requestError){
      setSites(response);
    }
  }

  const [employees, setEmployees] = useState([]);
  const handleGetEmployees = async()=>{
      try {
        const benef = await fetchData(import.meta.env.VITE_USER_API+"/employees");
        setEmployees(benef);
      } catch (error) {
        console.log(error.message);
      }
  }

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
          <Tab
            title={<p>Appro caisse</p>}
            isActive={path === "appro"}
            onClick={()=>handleTabClick("appro")}
          />
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
              <h3>Appro caisse</h3>
              <PageHeader>
                <div className='flex items-center justify-between w-full'>
                  <input type="search" className='text-sm' placeholder='Recherche'/>
                  <VerifyPermissions
                      expected={["cashier"]}
                      roles={userInfo?.role?.name}
                      functions={userInfo?.Function?.name}
                  >
                    <button 
                      className='btn bg-green-500 text-white text-sm'
                      onClick={()=>setOpenApproModal(true)}
                    >Initier un appro.
                    </button>
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
    </LoginLayout>
  )
}

export default Caisse