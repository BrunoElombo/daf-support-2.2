import React, { useState } from 'react'

function ApproForm() {

    const [typeApprove, setTypeAppro] = useState("");
    
  return (
    <form className='flex flex-col space-y-3'>
        <select name="" id="" value={typeApprove} onChange={e=>setTypeAppro(e.target.value)} className='w-full'>
            <option value="">Type d'approvisionement</option>
            <option value="CAISSE">Approvisionement caisse</option>
            <option value="BANK">Approvisionement bank</option>
        </select>
        {
            typeApprove === "BANK" ?
            <>
                <select name="" id="">
                    <option value="">Choisir les caisse</option>
                    <option value="caisse 1">Caisse 1</option>
                    <option value="caisse 2">Caisse 2</option>
                    <option value="caisse 3">Caisse 3</option>
                </select>
                <br />
                <label htmlFor="#multiple_bank"><b>Choisir la bank :</b></label>
                <select name="" id="" multiple>
                    <option value="">(UBA) 1000-4444-5555-999</option>
                    <option value="">(Afriland) 9999-8888-7777-666</option>
                    <option value="">(Ecobank) 1000-4444-5555-999</option>
                </select>
            </>:
            typeApprove === "CAISSE" &&
            <>
                <select name="" id="multiple_bank">
                    <option value="">Choisir la bank</option>
                    <option value="">UBA</option>
                    <option value="">Afriland</option>
                    <option value="">Ecobank</option>
                </select>
                <br />
                <label htmlFor="#multiple_caisse"><b>Choisir les caisse :</b></label>
                <select name="" id="multiple_caisse" multiple>
                    <option value="caisse 1">Caisse 1</option>
                    <option value="caisse 2">Caisse 2</option>
                    <option value="caisse 3">Caisse 3</option>
                </select>
            </>
        }
        <div>
            <button className='btn bg-green-500 text-white'>Approvisioner</button>
        </div>
    </form>
  )
}

export default ApproForm