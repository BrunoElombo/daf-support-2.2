import React from 'react'

function PageHeader(props) {
  return (
    <div className='border-[1px] border-gray-100 w-full p-3 rounded-md flex justify-between items-center'>
        {props.children}
    </div>
  )
}

export default PageHeader