import React from 'react'

function PageHeader(props) {
  return (
    <div className='border-[1px] border-gray-100 w-full p-3 rounded-md flex flex-col md:flex-row justify-between items-center space-y-2'>
        {props.children}
    </div>
  )
}

export default PageHeader