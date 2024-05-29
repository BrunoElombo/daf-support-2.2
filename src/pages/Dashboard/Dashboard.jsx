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
  const [chartData, setChartData] = useState({});


  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();
  const  [expenseDataSrc, setExpenseDataSrc] = useState([]);
  const [recipePredictions, setRecipePredictions] = useState({});

  const handleGellAllExpenses = async() =>{
    const response = await fetchData(import.meta.env.VITE_DAF_API+"/expensesheet/");
    setExpenseDataSrc(response?.result);
    console.log(response)
    
  }


  const handleGetRecipeSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/recipesheet/summary_by_year/?year="+actualYear);
      if (response && response.daily_sums) {
  
        setChartData(response);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetRecipeSummaryPrediction = async ()=>{
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/recipesheet/summary_prediction_by_year/?year="+actualYear)
      const values = response?.daily_predictions;
      setRecipePredictions(values)
    } catch (error) {
      console.log(error);
    }
  }

  function sumMontants(response) {
    if (!response || !response.daily_sums || response.daily_sums.length === 0) {
      return 0; // Return 0 if response or daily_sums array is empty
    }
  
    // Calculate the sum of total_amount
    const totalSum = response.daily_sums.reduce(
      (accumulator, current) => accumulator + current.total_amount,
      0
    );
  
    return totalSum;
  }
  const numberWithCommas=(x)=>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }


  useEffect(()=>{
    handleGellAllExpenses();
    handleGetRecipeSummary();
    handleGetRecipeSummaryPrediction();
  }, []);

  return (
    <LoginLayout>
      <div className='w-full h-full overflow-y-auto flex flex-col p-5'>
        <div className='border-[1px] border-gray-100 my-2 p-2 rounded-lg flex items-center'> 
          <Topfilter />
        </div>
        <div className='h-1/4 flex flex-col md:flex-row items-center justify-evenly space-y-2 md:space-x-2'>

          <div className='bg-gradient-to-r from-green-500 to-green-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Recettes du mois</h3>
            <p className='text-sm'>
            Total : <b> {numberWithCommas(sumMontants(chartData))} XAF</b>
            </p>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Dépenses du mois</h3>
            <p className='text-sm'>
            Total : <b> {expenseDataSrc?.length>0 ? numberWithCommas(sumMontants(expenseDataSrc)):"---"} XAF</b>
            </p>
          </div>
          <div className='bg-gradient-to-r from-green-600 to-green-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Recette de l'année</h3>
            <p className='text-sm'>
              <b>Total :</b> ---- XAF
            </p>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
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
            {/* <Tab 
              title={<p className='text-md'>Depenses</p>}
              isActive={false}
            /> */}
          </TabsComponent>
          <div className=''>
            {/* Graph body */}
            <div className='max-h-[250px] h-[250px] w-full overflow-y-auto md:p-2'>
              {/* <LineChart chartData={userData} /> */}
              <Chart data={chartData} predictions={recipePredictions}/>
            </div>

          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default Dashboard