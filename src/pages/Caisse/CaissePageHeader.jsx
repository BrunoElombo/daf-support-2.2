import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'

function CaissePageHeader({data}) {
    const numberWithCommas=(x)=>{
        return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
    }
  return (
    <PageHeader>
        <div className='flex justify-between items-center w-full'>
            <div className='mt-2 md:mt-0 flex space-x-5'>
              <h3 className='text-xs'>
                Solde caisse : <b className={`bg-yellow-300 p-2 rounded-lg`}>{numberWithCommas(0)} XAF</b>
              </h3>
              <h3 className="text-xs">
                Sortie de caisse : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(0)} XAF</b>
              </h3>
              <h3 className="text-xs">
                Entrée en caisse : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(0)} XAF</b>
              </h3>
            </div>
            <div className='flex space-x-2 items-center'>
              <label htmlFor=""></label>
              <select name="" id="" className="text-xs">
                <option value="">Jour</option>
                <option value="week">Semain</option>
                <option value="month">Mois</option>
              </select>
            </div>   
        </div>
    </PageHeader>
  )
}

export default CaissePageHeader