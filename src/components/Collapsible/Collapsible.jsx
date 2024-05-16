import React, {useState} from 'react'

function Collapsible(props) {
    const [collapseIsCollapsed, setIsCollapsed] = useState(props.isOpenned || false);
  return (
    <div>
      <div className='flex flex-col justify-between items-center p-2 border-[1px] rounded-md border-gray-200 bg-gray-100' onClick={() => setIsCollapsed(!collapseIsCollapsed)}>
        <span className='text-md'>{props.title}</span>
        {/* <button
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2"
          
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button> */}
      
      </div>
      {/* <div className={`${className} overflow-y-auto m-y-2 ${collapseIsCollapsed ? 'hidden' : 'block'} max-h-96 `} style={{ maxHeight: '300px' }}> */}
      <div className={`${props.className} m-y-2 ${collapseIsCollapsed ? 'hidden' : 'block'} space-y-2`}>
        {!props.children ? <span className='text-bold italic text-xs text-gray-500 text-center'>No data</span> : props.children}
      </div>
    </div>
  )
}

export default Collapsible