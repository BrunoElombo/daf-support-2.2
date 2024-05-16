import React, { useState } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import TabsComponent from '../../components/TabsComponents/TabsComponent'
import Tab from '../../components/TabsComponents/Tab'
import PageHeader from '../../components/PageHeader/PageHeader'
import { Modal, Table } from 'antd'
import ApproForm from '../Reporting/ApproForm'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

function Caisse() {
  const [path, setPath] = useState("appro");

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
    },
    {
      title:"Numéro ref",
      dataIndex:"",
      key:"",
    },
    {
      title:"Initiateur",
      dataIndex:"",
      key:"",
    },
    {
      title:"Provenance",
      dataIndex:"",
      key:"",
    },
    {
      title:"Destination",
      dataIndex:"",
      key:"",
    },
    {
      title:"Montant",
      dataIndex:"",
      key:"",
    },
    {
      title:"Site",
      dataIndex:"",
      key:"",
    },
    {
      title:"Entite",
      dataIndex:"",
      key:"",
    },
    {
      title:"Actions",
      dataIndex:"",
      key:"",
      render:(text, record)=><p></p>
    },
  ];

  const CASH_DESK_COLUMNS = [
    
  ];
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
          {
            path === "appro" &&
            <div>
              <h3>Appro caisse</h3>
              <PageHeader>
                <div className='flex items-center justify-between w-full'>
                  <input type="search" className='text-sm' placeholder='Recherche'/>
                  <button 
                    className='btn bg-green-500 text-white text-sm'
                    onClick={()=>setOpenApproModal(true)}
                  >Initier un appro.
                  </button>
                </div>
              </PageHeader>
              <div className='border-[1px] border-gray-100 p-3 rounded-lg mt-3'>
                <Table 
                  columns={APPRO_COLUMNS}
                  dataSource={[]}
                  footer={()=>(
                    <div></div>
                  )}
                  pagination={{
                    pageSize: 50,
                  }}
                  // scroll={{
                  //   y: "150px",
                  //   x:500
                  // }}
                />
              </div>
            </div>
          }
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