import React from 'react'

function Header(props) {
  return (
    <div className={`p-3 shadow-md bg-${props.bgColor}-400 w-full text-${props.textColor}-500 ${props.className} flex justify-between items-center`}>
        <div className='flex justify-center items-center'>
            {props.left}
        </div>
        <div>
            {props.right}
        </div>
    </div>
  )
}

export default Header