import React, {useState, useContext } from 'react'
import avatar from "../../assets/images/avatar.png"
import { Modal } from 'antd'
import { Link } from 'react-router-dom'
import UpdateUserForm from '../updateUserForm/UpdateUserForm'
import { AUTHCONTEXT } from '../../context/AuthProvider';


function UserInfo({data}) {
    const {userInfo, setIsLoggedIn, defaultEntity, setDefaultEntity, allEntities, setUserInfo, setAllEntities} = useContext(AUTHCONTEXT);
    const [isChangePassword, setIsChangePassword] = useState(false)
  return (
    <div className='w-full p-3 border-[1px] border-gray-150 rounded-md flex flex-col justify-center mb-3'>
        <div className='w-full flex justify-center flex-col items-center mb-3'>
            <img src={data?.avatar || avatar} alt=""className='w-[100px] h-[100px] flex justify-center items-center rounded-full' />
            <button className="text-xs text-blue-500 hover:text-blue-300" onClick={()=>setIsChangePassword(!isChangePassword)}>
                {isChangePassword ? "Annuler":"Modifier les informations"}
            </button>
        </div>
        {
            isChangePassword ?
            <UpdateUserForm />:
            <div className='flex flex-col space-y-3'>
            <div>
                <p><b>Nom d'utilisateur :</b></p>
                <div className='p-2 bg-gray-200 border-gray-300 border-[1px] rounded-lg'>
                   <p className='text-md capitalize'>{userInfo?.User?.displayName || "Anonymous"}</p> 
                </div>
            </div>
            <div>
                <p><b>Role / Function :</b></p>
                <div className='p-2 bg-gray-200 border-gray-300 border-[1px] rounded-lg'>
                   <p className='text-md'>{`${userInfo?.role?.displayName || userInfo?.Function?.displayName}`}</p> 
                </div>
            </div>
            <div>
                <p><b>Entité :</b></p>
                {/* <hr /><br /> */}
                <div className='p-2 bg-gray-200 border-gray-300 border-[1px] rounded-lg'>
                    <p className='capitalize'>{userInfo?.entity?.raison_social}</p>
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
        }
    </div>
  )
}

export default UserInfo