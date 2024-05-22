import React, {useContext, useEffect, useState} from 'react'
import { Drawer, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLongLeftIcon, BanknotesIcon, BellIcon, ChartBarIcon, CogIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, HomeIcon } from "@heroicons/react/24/outline";
import { AUTHCONTEXT } from '../../context/AuthProvider';
import VerifyPermissions from '../Permissions/VerifyPermissions';

function DashboardHeader() {

  const locataion = useLocation();
  const { pathname } = location;
  const {userInfo, setIsLoggedIn, defaultEntity, setDefaultEntity, allEntities, setUserInfo, setAllEntities} = useContext(AUTHCONTEXT);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetUserInfo =async ()=>{
    let userData = await fetchData(import.meta.env.VITE_DAF_API+"/users/account");
    console.log(userData);
    if(userData){
      setUserInfo(userData.result);
    }
}

const handleGetEntities =async ()=>{
  let entities = await fetchData(import.meta.env.VITE_DAF_API+"/users/account");
    console.log(entities);
    if(entities){
      setAllEntities(entities.result);
    }
}

const handleChangedEntity=async (id)=>{
    console.log(id)
    let selectedEntity = allEntities.find(entity => entity.id === id);
    setDefaultEntity(selectedEntity);    
    localStorage.setItem("entity", JSON.stringify(selectedEntity));
}

  useEffect(()=>{

    if(!userInfo){
        handleGetUserInfo();
    }

    if(!allEntities){
        handleGetEntities();
    }

    // console.log(userInfo);
    // console.log(defaultEntity);
    // console.log(allEntities);
  }, [])

  const onClose=()=>{
    setIsOpen(false);
  }

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className='bg-green-500 shadow-md fixed w-full'>
        <div className='flex justify-between py-3 items-center px-5 border-b-[1px] border-white'>
            <div className='flex items-center space-x-2'>
                {/* <ArrowLongLeftIcon className="h-6 w-6 text-white" /> */}
                <b className='text-white'>DAFSUPPORT</b>
            </div>
            <div className='flex items-center space-x-3'>
                <div className='relative'>
                    <div className='bg-red-500 w-3 h-3 rounded-full absolute right-0 -top-1'>{}</div>
                    <BellIcon className="text-white h-6 w-6" />
                </div>
                <p onClick={()=>{setIsOpen(true)}} className='text-white text-sm bold cursor-pointer p-2 hover:bg-green-700'>Hi, {userInfo?.User.name}</p>
            </div>
        </div>
        <div className='pt-5 px-5'>
            <ul className='space-x-4 flex text-sm text-white'>
                <VerifyPermissions
                    expected={["department_manager", "general_manager", "president", "operations_manager"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link to={"/dashboard"} className={`${(pathname.includes("dashboard") || pathname === "/") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`}>
                            <HomeIcon className="text-white h-6 w-6" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                    <li>
                        <Link to={"/recette"} className={`${pathname.includes("recette") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`}>
                            <DocumentArrowDownIcon className="text-white h-6 w-6" />
                            <span>Fiche de recette</span>
                        </Link>
                    </li>
                {/* <VerifyPermissions
                    expected={["department_manager", "general_manager", "president", "paymaster_general", "gueritte_chef"]}
                    roles={userInfo?.role.name}
                    functions={userInfo?.Function.name}
                >
                </VerifyPermissions> */}
                <VerifyPermissions
                    expected={["department_manager", "general_manager", "president", "operations_manager", "paymaster_general", "coordinator", "chief_financial_officer"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("expense") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/expense"}>
                            <DocumentArrowUpIcon className="text-white h-6 w-6" />
                            <span>Fiche de dépense</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                {/* <li>
                    <Link className={`${pathname.includes("caisse") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/caisse"}>
                        <BanknotesIcon className="text-white h-6 w-6" />
                        <span>Caisse</span>
                    </Link>
                </li>
                <li>
                    <Link className={`${pathname.includes("reporting") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/reporting"}>
                        <ChartBarIcon className="text-white h-6 w-6" />
                        <span>Reporting</span>
                    </Link>
                </li> */}
                <VerifyPermissions
                    expected={["chief_financial_officer", "general_manager", "president", "operations_manager"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("settings") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/settings"}>
                            <CogIcon className="text-white h-6 w-6" />
                            <span>Parametres</span>
                        </Link>
                    </li>
                </VerifyPermissions>
            </ul>
        </div>
        <Drawer
        title={
            <div className='flex items-center justify-between'>
                <p>Détail de l'utilisateur</p>
                <button onClick={handleLogout} className='text-sm btn text-red-500 hover:text-white hover:bg-red-300'>Deconnexion</button>
            </div>
        }
        placement={"right"}
        width={500}
        onClose={onClose}
        open={isOpen}
        extra={
          <Space>
           
          </Space>
        }
      >
        <div className='flex flex-col space-y-3'>
            <div>
                <p><b>Nom d'utilisateur :</b></p>
                <div className='p-2 bg-gray-200 border-gray-300 border-[1px] rounded-lg'>
                   <p className='text-md'>{userInfo?.User?.name}</p> 
                </div>
            </div>
            <div>
                <p><b>Role / Function :</b></p>
                <div className='p-2 bg-gray-200 border-gray-300 border-[1px] rounded-lg'>
                   <p className='text-md'>{userInfo?.role?.name || userInfo?.Function?.name}</p> 
                </div>
            </div>
            <div>
                <p><b>Entité :</b></p>
                {/* <hr /><br /> */}
                <div className='p-2 bg-gray-200 border-gray-300 border-[1px] rounded-lg'>
                    <p>{userInfo?.entity.raison_social}</p>
                </div>
                {/* <select name="" id="" className='w-full mt-2' onChange={(e)=>handleChangedEntity(e.target.value)}>
                    {
                        allEntities?.map(entity=>(
                            <option value={entity.id} key={entity.id} >{entity.name}</option>
                        ))
                    }
                </select> */}
            </div>
        </div>
        </Drawer>
    </div>
  )
}

export default DashboardHeader