import React from 'react'

function DetailCard(props) {
  return (
    <div className={`${props.className} border-r-[1px] border-b-[1px] border-t-[1px] border-l-[5px] border-l-${props.leftBorderColor}-500 border-t-gray-100 border-r-gray-100 border-b-gray-100 p-3 my-1`}>
        <div>
            {props.header}
        </div>
        <div>
            {props.content}
        </div>
        <div>
            {props.footer}
        </div>
    </div>
  )
}

export default DetailCard