import React, {useContext, useEffect, useState} from 'react'
import { Drawer, Space } from 'antd';
import useFetch from '../../hooks/useFetch';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLongLeftIcon, 
    BanknotesIcon, 
    Bars3Icon,
    BellIcon, 
    ChartBarIcon, 
    CogIcon, 
    DocumentArrowDownIcon, 
    DocumentArrowUpIcon, 
    HomeIcon,
    CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { AUTHCONTEXT } from '../../context/AuthProvider';
import VerifyPermissions from '../Permissions/VerifyPermissions';
import UserInfo from '../userInfo/UserInfo';

function DashboardHeader() {

  const locataion = useLocation();
  const { pathname } = location;
  const { postData } = useFetch();
  const {userInfo, setIsLoggedIn, defaultEntity, setDefaultEntity, allEntities, setUserInfo, setAllEntities} = useContext(AUTHCONTEXT);
  const [isOpen, setIsOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

//   const [] = useState();
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

  }, [])

  const onClose=()=>{
    setIsOpen(false);
  }

  const handleLogout = async ()=>{
      localStorage.clear();
      navigate("/");
      setIsLoggedIn(false);
    //   try {
    //       let response = await postData(import.meta.env.VITE_USER_API+"/api/login");
    //       if(response.statut == 200){
    //         // localStorage.removeItem("token");
    //         setIsLoggedIn(false);
    //     }
    // } catch (error) {
    //     alert("Echec de deconnexion")
    // }
  };

  return (
    <div className='bg-green-500 shadow-md fixed w-full z-[999]'>
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
                <p onClick={()=>{setIsOpen(true)}} className='text-white text-sm bold cursor-pointer p-2 hover:bg-green-700'>Hi, <span className='capitalize'>{userInfo?.User?.displayName || "Anonymous"}</span></p>
            </div>
        </div>
        <div className='md:pt-5 md:px-5 flex items-center'>
            <div className='flex md:hidden items-center justify-end w-full p-3'>
                <button className='p-2 bg-green-600 rounded-lg' onClick={()=>{setMenuIsOpen(true)}}>
                    <Bars3Icon className='text-white h-6 w-6'/>
                </button>
            </div>
            <ul className='space-x-4 text-sm text-white overflow-x-auto hidden md:flex'>
                <VerifyPermissions
                    expected={["chief_financial_officer","paymaster_general","management_controller", "accountant", "department_manager", "general_manager", "president", "operations_manager"]}
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
                        <span>Recettes</span>
                    </Link>
                </li>

                {/* <VerifyPermissions
                    expected={["department_manager", "general_manager", "president", "paymaster_general", "gueritte_chef"]}
                    roles={userInfo?.role.name}
                    functions={userInfo?.Function.name}
                >
                </VerifyPermissions> */}

                <VerifyPermissions
                    expected={["accountant", 
                        "department_manager", 
                        "general_manager", 
                        "president", 
                        "operations_manager", 
                        "paymaster_general",
                        "chief_financial_officer",
                        "cashier",
                        "management_controller",
                        "rop",
                    ]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("expense") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/expense"}>
                            <DocumentArrowUpIcon className="text-white h-6 w-6" />
                            <span>Dépenses</span>
                        </Link>
                    </li>
                </VerifyPermissions>

                <VerifyPermissions
                    expected={["chief_financial_officer","management_controller", "general_manager", "president", "operations_manager", "paymaster_general"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("treasury") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/treasury"}>
                            <CurrencyDollarIcon className="text-white h-6 w-6" />
                            <span>Trésorerie</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                
                <VerifyPermissions
                    expected={["chief_financial_officer","management_controller", "general_manager", "president", "cashier", "operations_manager", "bank_mandate", "paymaster_general"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("caisse") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/caisse"}>
                            <BanknotesIcon className="text-white h-6 w-6" />
                            <span>Caisse</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                {/* <VerifyPermissions
                    expected={["chief_financial_officer", "general_manager", "president", "operations_manager"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("reporting") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/reporting"}>
                            <ChartBarIcon className="text-white h-6 w-6" />
                            <span>Reporting</span>
                        </Link>
                    </li>
                </VerifyPermissions> */}


                {/* <VerifyPermissions
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
                </VerifyPermissions> */}
            </ul>
        </div>

        {/* User information drawer */}
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
        <UserInfo />
        
        </Drawer>

        {/* Main menu drawer */}
        <Drawer
            title={
                <div className='flex items-center justify-between'>
                    <p>Ménu</p>
                </div>
            }
            placement={"right"}
            width={500}
            onClose={()=>setMenuIsOpen(false)}
            open={menuIsOpen}
            extra={
            <Space>
            
            </Space>
            }
        >
            <ul className='space-y-4 text-sm text-green-500 flex flex-col md:flex overflow-y-auto'>
                <VerifyPermissions
                    expected={["accountant", "department_manager", "general_manager", "president", "operations_manager", "paymaster_general"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link to={"/dashboard"} className={`${(pathname.includes("dashboard") || pathname === "/") && 'border-b-[3px] border-green-500'} cursor-pointer flex items-center space-x-2 py-2`}>
                            <HomeIcon className="text-green-500 h-6 w-6" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                    <li>
                        <Link to={"/recette"} className={`${pathname.includes("recette") && 'border-b-[3px] border-green-500'} cursor-pointer flex items-center space-x-2 py-2`}>
                            <DocumentArrowDownIcon className="text-green-500 h-6 w-6" />
                            <span>Fiche de recette</span>
                        </Link>
                    </li>
                <VerifyPermissions
                    expected={["accountant", "department_manager", "general_manager", "president", "operations_manager", "paymaster_general", "coordinator", "chief_financial_officer", "paymaster_general"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("expense") && 'border-b-[3px] border-green-500'} cursor-pointer flex items-center space-x-2 py-2`} to={"/expense"}>
                            <DocumentArrowUpIcon className="text-green-500 h-6 w-6" />
                            <span>Fiche de dépense</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                <VerifyPermissions
                    expected={["chief_financial_officer", "general_manager", "president", "operations_manager", "paymaster_general"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("reporting") && 'border-b-[3px] border-green-500'} cursor-pointer flex items-center space-x-2 py-2`} to={"/reporting"}>
                            <ChartBarIcon className="text-green-500 h-6 w-6" />
                            <span>Reporting</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                <VerifyPermissions
                    expected={["chief_financial_officer", "general_manager", "president", "cashier", "operations_manager", "paymaster_general"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("caisse") && 'border-b-[3px] border-white'} cursor-pointer flex items-center space-x-2 py-2`} to={"/caisse"}>
                            <BanknotesIcon className="text-white h-6 w-6" />
                            <span>Caisse</span>
                        </Link>
                    </li>
                </VerifyPermissions>
                {/* <VerifyPermissions
                    expected={["chief_financial_officer", "general_manager", "president", "operations_manager"]}
                    roles={userInfo?.role?.name}
                    functions={userInfo?.Function?.name}
                >
                    <li>
                        <Link className={`${pathname.includes("settings") && 'border-b-[3px] border-green-500'} cursor-pointer flex items-center space-x-2 py-2`} to={"/settings"}>
                            <CogIcon className="text-green-500 h-6 w-6" />
                            <span>Parametres</span>
                        </Link>
                    </li>
                </VerifyPermissions> */}
            </ul>
        </Drawer>
    </div>
  )
}

export default DashboardHeader