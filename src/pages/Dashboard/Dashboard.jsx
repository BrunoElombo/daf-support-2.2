import React, {useState, useEffect} from 'react'
import LoginLayout from '../../Layout/LoginLayout'
import LineChart from '../../components/LineChart'
import {UserData} from '../../utils/Data'
import { EllipsisVerticalIcon, PrinterIcon } from '@heroicons/react/24/outline';
import TabsComponent from '../../components/TabsComponents/TabsComponent';
import Tab from '../../components/TabsComponents/Tab';
import useFetch from '../../hooks/useFetch';
import Chart from '../../components/Chart';
import Topfilter from './Topfilter';
// ChartJS.register(LineElement, ArcElement, Title, Tooltip);


function Dashboard() {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Recettes",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });


  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();
  const  [expenseDataSrc, setExpenseDataSrc] = useState([]);

  const handleGellAllExpenses = async() =>{
    const response = await fetchData(import.meta.env.VITE_DAF_API+"/expensesheet/");
    console.log(response)
    if(!requestError){
      setExpenseDataSrc(response?.result);
    }
  }
  function sumMontants(objects) {
    // Initialize a variable to store the sum
    let total = 0;

    // Loop through each object in the list
    for (const obj of objects) {
      // Check if the object has a `montant` attribute
      if (obj.hasOwnProperty('amount')) {
        // Get the value of the `montant` attribute
        const montant = obj.amount;

        // Ensure montant is a number before adding
        if (typeof montant === 'number') {
          total += montant;
        } else {
          console.warn("Skipping object with non-numeric 'montant' attribute");
        }
      }
    }

    // Return the calculated sum
    return total;
  }
  const numberWithCommas=(x)=>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mars', 'April', 'May', 'Jun', 'Jul', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        id: 1,
        label: 'Recettes actuel',
        data: [2,5,3,8,9,9,7,6,3,5,8],
      },
      {
        id: 1,
        label: 'Previsions',
        data: [2,5,3,8,9,9,7,6,3,5,8].reverse(),
      },
    ],
  };

  useEffect(()=>{
    handleGellAllExpenses();
  }, []);
  return (
    <LoginLayout>
      <div className='w-full h-full overflow-y-auto flex flex-col p-5'>
        <div className='border-[1px] border-gray-100 my-2 p-2 rounded-lg flex items-center'> 
          <Topfilter />
        </div>
        <div className='h-1/4 flex items-center justify-evenly space-x-2'>

          <div className='bg-gradient-to-r from-green-500 to-green-400 rounded-lg shadow-lg p-4 w-1/4 text-white'>
            <h3>Recettes du mois</h3>
            <p className='text-sm'>
              <b>Total :</b> ---- XAF
            </p>
          </div>
          <div className='bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg shadow-lg p-4 w-1/4 text-white'>
            <h3>Dépenses du mois</h3>
            <p className='text-sm'>
            Total : <b> {expenseDataSrc ? numberWithCommas(sumMontants(expenseDataSrc)):"---"} XAF</b>
            </p>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-4 w-1/4 text-white'>
            <h3>Recette de l'année</h3>
            <p className='text-sm'>
              <b>Total :</b> ---- XAF
            </p>
          </div>
          <div className='bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg shadow-lg p-4 w-1/4 text-white'>
            <h3>Dépenses de l'année</h3>
            <p className='text-sm'>
              <b>Total :</b> ---- XAF
            </p>
          </div>

        </div>
        <div className='h-3/4 flex flex-col space-y-3'>
          <TabsComponent >
            <Tab 
              title={<p className='text-md'>Recettes</p>}
              isActive={true}
            />
            <Tab 
              title={<p className='text-md'>Depenses</p>}
              isActive={false}
            />
          </TabsComponent>
          <div className=''>
            {/* Graph body */}
            <div className='max-h-[250px] h-[250px] w-full overflow-y-auto p-2'>
              {/* <LineChart chartData={userData} /> */}
              <Chart data={chartData}/>
            </div>

          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default Dashboard