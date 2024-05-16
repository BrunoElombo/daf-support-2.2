import React, { useState } from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import Collapsible from '../../components/Collapsible/Collapsible'

function SettingsPage() {

  // Department settings
  const [departements, setDepartements] = useState([]);
  const [departement, setDepartement] = useState("");
  const [budget, setBudget] = useState("");

  const handleAllocateBudget = async() =>{
    const data = {
      budget, departement
    }
    console.log(data)
    handleClearAllocationForm()
  }

  const handleClearAllocationForm = async() =>{
    setDepartement("");
    setBudget("");
  }

  const [] = useState("");

  return (
    <LoginLayout>
      <div className='px-5 space-y-3'>
          <Collapsible 
            title={"Parametres entités"}
          >
          </Collapsible>
          <Collapsible 
            title={"Parametres departements"}
            isOpenned={false}
          >
            <div>
              <h3 className='text-sm my-2'>
                Budget
              </h3>
              <hr />
            </div>
            <div className='flex space-x-3'>
              <select name="" id="" className='text-sm' value={departement} onChange={e=>setDepartement(e.target.value)}>
                <option value="">Choisir le département</option>
                <option value="RH">Resource humain</option>
                <option value="IT">IT</option>
                <option value="COMPTA">Contabilité</option>
              </select>
              <input type="number" className='text-sm' placeholder='Budget' value={budget} onChange={e=>setBudget(e.target.value)}/>
              <button className='btn text-sm bg-green-500 text-white shadow-sm' onClick={handleAllocateBudget}>Alouer le budget</button>
            </div>
          </Collapsible>
          <Collapsible 
            title={"Parametres entités"}
          >
          </Collapsible>
          <Collapsible 
            title={"Parametres entités"}
          >
          </Collapsible>
      </div>
    </LoginLayout>
  )
}

export default SettingsPage