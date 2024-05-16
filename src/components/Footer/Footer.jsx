import React from 'react'

function Footer(props) {
  return (
    <div className='absolute bottom-0 p-2 w-full'>
        {props.content}
    </div>
  )
}

export default Footer