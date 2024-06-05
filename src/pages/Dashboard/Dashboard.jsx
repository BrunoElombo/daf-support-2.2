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
  // const [chartDataSrc, setChartDataSrc] = useState({});
  
  const [path, setPath] = useState("recipes")


  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();

  const [yearlyRecipeTotal, setYearlyRecipeTotal] = useState("0");
  const [yearlyExpenseTotal, setYearlyExpenseTotal] = useState("0");
  
  const  [recipeDataSrc, setRecipeDataSrc] = useState([]);
  const [recipeData, setRecipeData] = useState([]);

  const  [expenseDataSrc, setExpenseDataSrc] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  const [recipePredictions, setRecipePredictions] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

  const handleTabClick = (selectedPath) =>{
    setPath(selectedPath);
  }

  // const handleGellAllExpenses = async() =>{
  //   const response = await fetchData(import.meta.env.VITE_DAF_API+"/expensesheet/");
  //   setExpenseDataSrc(response?.result);
  //   setExpenseData(response?.result);
  // }

  const handleGetRecipeSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/recipesheet/summary_by_year/?year="+actualYear+"&entity_id="+entityId);
      if (response && response?.daily_sums) {
        setRecipeData(response?.daily_sums)
        setRecipeDataSrc(response?.daily_sums)
        setChartData(response);

        setYearlyRecipeTotal(response?.annual_sums[0]?.total_amount)
        // setChartDataSrc(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetRecipeSummaryPrediction = async ()=>{
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/recipesheet/summary_prediction_by_year/?year="+actualYear+"&entity_id="+entityId)
      const values = response?.daily_predictions;
      setRecipePredictions(values)
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleGetExpenseSummary = async () => {
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/expensesheet/summary_by_year/?year="+actualYear+"&entity_id="+entityId);
      if (response && response?.daily_sums) {
        setExpenseData(response?.daily_sums)
        setExpenseDataSrc(response?.daily_sums)
        setChartData(response);
        setYearlyExpenseTotal(response?.annual_sums[0]?.total_amount)
        // setChartDataSrc(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetExpenseSummaryPrediction = async ()=>{
    let url = import.meta.env.VITE_DAF_API;
    const actualYear = new Date().getFullYear();
    try {
      const response = await fetchData(url+"/expensesheet/summary_prediction_by_year/?year="+actualYear+"&entity_id="+entityId)
      const values = response?.daily_predictions;
      setRecipePredictions(values)
    } catch (error) {
      console.log(error);
    }
  }

  function sumMontants(response) {
    if (!response || !response || response?.length === 0) {
      return 0; // Return 0 if response or daily_sums array is empty
    }
  
    // Calculate the sum of total_amount
    const totalSum = response?.reduce(
      (accumulator, current) => accumulator + current?.total_amount,
      0
    );
  
    return totalSum;
  }

  const numberWithCommas=(x)=>{
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  }

  useEffect(()=>{
    // handleGellAllExpenses();

    handleGetRecipeSummary();
    // handleGetRecipeSummaryPrediction();

    handleGetExpenseSummary();
    // handleGetExpenseSummaryPrediction();
  }, []);

  // Function to filter objects by date range
  function filterObjectsByDateRange(objects, startDate, endDate) {
    const filteredObjects = objects?.filter(obj => {
      const objDate =new Date(obj.day.split("T")[0]).toLocaleDateString()?.replaceAll("/", "-")?.split("-")?.reverse()?.join("-");
      return objDate >= startDate && objDate <= endDate;
    });
    return filteredObjects;
  }

  useEffect(()=>{
    if(startDate.length > 0 && endDate.length > 0){
      const filteredData = filterObjectsByDateRange(recipeData, startDate, endDate);
      const expenseFilteredData = filterObjectsByDateRange(expenseData, startDate, endDate);
      setRecipeData(filteredData);
      setExpenseData(expenseFilteredData);
      console.log(filteredData,expenseFilteredData);
    }else{
      setRecipeData(recipeDataSrc);
      setExpenseData(expenseDataSrc);
    }
  }, [startDate, endDate]);

  return (
    <LoginLayout>
      <div className='w-full h-full overflow-y-auto flex flex-col p-5'>
        <div className='border-[1px] border-gray-100 my-2 p-2 rounded-lg flex items-center space-x-2'> 
          {/* <Topfilter /> */}
          <input type="date" value={startDate} className='text-sm' onChange={e => setStartDate(e.target.value)}/>
          <input type="date" value={endDate} className='text-sm' onChange={e => setEndDate(e.target.value)}/>
        </div>
        <div className='h-1/4 flex flex-col md:flex-row items-center justify-evenly space-y-2 md:space-x-2'>

          <div className='bg-gradient-to-r from-green-500 to-green-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Recettes</h3>
            <p className='text-sm'>
            Total : <b> {numberWithCommas(sumMontants(recipeData))} XAF</b>
            </p>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Dépenses</h3>
            <p className='text-sm'>
            Total : <b> {numberWithCommas(sumMontants(expenseData))} XAF</b>
            </p>
          </div>
          <div className='bg-gradient-to-r from-green-600 to-green-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Recette de l'année</h3>
            <p className='text-sm'>
              Total : <b>{numberWithCommas(yearlyRecipeTotal)} XAF</b>
            </p>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-4 w-full md:w-1/4 text-white'>
            <h3>Dépenses de l'année</h3>
            <p className='text-sm'>
              Total : <b>{numberWithCommas(yearlyExpenseTotal)} XAF</b>
            </p>
          </div>

        </div>
        <div className='h-3/4 flex flex-col space-y-3'>
          <TabsComponent >
            <Tab 
              title={<p className='text-md'>Recettes</p>}
              isActive={path === "recipes"}
              onClick={()=>handleTabClick("recipes")}
            />
            <Tab 
              title={<p className='text-md'>Depenses</p>}
              isActive={path === "expenses"}
              onClick={()=>handleTabClick("expenses")}
            />
          </TabsComponent>
          <div className=''>
            {/* Graph body */}
            <div className='max-h-[250px] h-[250px] w-full overflow-y-auto md:p-2'>
              {/* <LineChart chartData={userData} /> */}
              <Chart data={path === "recipes" ? recipeData : expenseData} predictions={recipePredictions}/>
            </div>

          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default Dashboard