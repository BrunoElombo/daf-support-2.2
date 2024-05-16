import React from 'react'
import { useNavigate } from 'react-router-dom'

function EntityCard(props) {
    const navigate = useNavigate();
    
  return (
    <div 
        className='p-2 bg-white shadow shadow-gray-400 flex space-x-2 min-w-[300px] mx-3 rounded-lg cursor-pointer'
        onClick={props.onClick}
    >
        <div className='flex rounded-full justify-center items-center bg-green-100 w-[50px] h-[50px] overflow-hidden'>
            <img src={props.logo} alt="" />
        </div>
        <div>
            <h4 className='bold'>{props.name}</h4>
            <p className='text-sm text-gray-600'>{props.tagline}</p>
        </div>
    </div>
  )
}

export default EntityCard