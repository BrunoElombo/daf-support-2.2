import React from 'react'

function Card1(props) {
  return (
    <div className={`flex flex-col w-full p-3 rounded-lg shadow-md border-[1px] border-${props.borderColor}-600 bg-${props.bgColor}-500 relative text-${props.textColor}`}>
        {props.children}
    </div>
  )
}

export default Card1