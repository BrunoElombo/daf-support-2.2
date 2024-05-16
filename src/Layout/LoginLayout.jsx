import React from 'react'
import DashboardHeader from '../components/DashboardHeader/DashboardHeader'

function LoginLayout(props) {
  return (
    <div className='w-full h-screen'>
      <DashboardHeader />
      <div className='overflow-y-auto pt-32'>
        <div className={`p-2 ${props.className} overflow-y-auto `}>
            {props.children}
        </div>
      </div>
    </div>
  )
}

export default LoginLayout