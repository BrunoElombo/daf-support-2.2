import React from 'react'

function Tab(props) {
  return (
    <li
        className={`${props.className} px-4 text-gray-800 font-semibold py-2 rounded-t border-t border-r border-l cursor-pointer ${props.isActive? "border-t border-r border-l -mb-px bg-gray-50 ":"bg-gray-200 border-b"}`}
        isActive={props.isActive}
        // className={`${props.className} cursor-pointer relative flex items-center p-2 border-t-[1px] border-l-[1px] border-r-[1px] border-${props.borderColor}-500 rounded-t-md`}
        onClick={props.onClick}
    >
        <div className='text-xs'>
        {props.icon}
        </div>
        {" "}
        <p className='font-semibold text-xs'>
        {props.title}
        </p>
        {props.children}
    </li>
  )
}

export default Tab