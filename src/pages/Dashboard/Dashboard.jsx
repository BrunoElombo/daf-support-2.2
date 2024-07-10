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
import moment from 'moment';
// ChartJS.register(LineElement, ArcElement, Title, Tooltip);


function Dashboard() {
  const [chartData, setChartData] = useState({});
  // const [chartDataSrc, setChartDataSrc] = useState({});
  
  const [path, setPath] = useState("recipes")


  const {requestLoading, fetchData, postData, requestError, updateData} = useFetch();

  const [yearlyRecipeTotal, setYearlyRecipeTotal] = useState("0");
  const [yearlyExpenseTotal, setYearlyExpenseTotal] = useState("0");

  const [recipeTotal, setRecipeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const [tempRecipeTotal, setTempRecipeTotal] = useState("0");
  const [tempExpenseTotal, setTempExpenseTotal] = useState("0");
  
  const  [recipeDataSrc, setRecipeDataSrc] = useState([]);
  const [recipeData, setRecipeData] = useState([]);

  const  [expenseDataSrc, setExpenseDataSrc] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  
  const  [treasuryDataSrc, setTreasuryDataSrc] = useState([]);
  const [treasuryData, setTreasuryData] = useState([]);

  const [cummulativeSrc, setCummulativeSrc] = useState([]);
  const [cummulative, setCummulative] = useState([]);

  const [recipePredictions, setRecipePredictions] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [step, setStep] = useState("");

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

        let recipeTotal = response?.annual_sums?.find(sum => sum.year?.split("-")[0] == new Date().getFullYear())?.total_amount
        // let recipeTotal = response?.daily_sums?.reduce((total, item)=>{
        //   return total + item.total_amount
        // }, 0)
        setRecipeTotal(recipeTotal);
        setTempRecipeTotal(recipeTotal);

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

        let expenseTotal = response?.annual_sums?.find(sum => sum.year?.split("-")[0] == new Date().getFullYear())?.total_amount

        setExpenseTotal(expenseTotal);
        setTempExpenseTotal(expenseTotal);
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

  const groupByWeek = (dailySums) => {
    const weeklySums = {};
    
    dailySums.forEach(item => {
        const week = moment(item.day).startOf('isoWeek').format('YYYY-MM-DD');
        
        if (!weeklySums[week]) {
            weeklySums[week] = 0;
        }
        
        weeklySums[week] += item.total_amount;
    });
    
    return Object.keys(weeklySums).map(week => ({
        day: week,
        total_amount: weeklySums[week]
    }));

  };

  const groupByMonth = (dailySums) => {
      const monthlySums = {};
      
      dailySums.forEach(item => {
          const month = moment(item?.day).startOf('month').format('YYYY-MM');
          
          if (!monthlySums[month]) {
              monthlySums[month] = 0;
          }
          
          monthlySums[month] += item.total_amount;
      });
      
      return Object.keys(monthlySums).map(month => ({
          day: month,
          total_amount: monthlySums[month]
      }));
  };

  function sumMontants(response) {
    if (response == ""|| response === 0 || response?.length === 0) {
      return 0; // Return 0 if response or daily_sums array is empty
    }
  
    // Calculate the sum of total_amount
    const totalSum = +response?.reduce(
      (accumulator, current) => accumulator + current?.total_amount,
      0
    );  
    return totalSum;
  };

  const numberWithCommas=(x)=>{
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  };

  const handleCompare=(listA, listB)=>{
    // if(listA?.length != listB?.length) throw new Error("Both objects must have the same length");
    const formatedList = [];

    if(listA.length === listB.length){
      for(let i=0; i<listA.length; i++){
        let date1 = listA[i]?.day;
        let date2 = listB[i]?.day;
  
        if(date1[0] === date2[0]){
          let value1 = listA[i]?.total_amount;
          let value2 = listB[i]?.total_amount;
  
          let actualDate = date1;
          let difference = +value1 - +value2;

          let data ={
            "day": actualDate,
            "total_amount": difference
          }
          formatedList[i] = data;
        }
      }

      return formatedList;
    }

    if(listA.length > listB.length){
      listB.forEach(itemB =>{
        let correspondingDate = listA.find(itemA=>itemA?.day === itemB?.day);
        let actualDate = correspondingDate?.day;
        let difference = correspondingDate?.total_amount - itemB?.total_amount

        let data = {
          "day": actualDate,
          "total_amount": difference
        }
        formatedList.push(data);
        console.log(2)
      })

      return formatedList;
    }
    
    if(listA.length < listB.length){
      listA.forEach(itemA =>{
        let correspondingDate = listB.find(itemB=>itemB?.day === itemA?.day);
        let actualDate = correspondingDate?.day;
        let difference = correspondingDate?.total_amount - itemA?.total_amount

        let data = {
          "day": actualDate,
          "total_amount": difference
        }
        formatedList.push(data);
      })

      return formatedList;
    }
    else{
      let data = {
        "day": new Date().getDay(),
        "total_amount": 0
      }
      formatedList.push(data);
      console.log(4)
      return formatedList;
    }

  };

  /**
   * 
   */ 
  const handleFetchCumulative=async()=>{
    let url = `${import.meta.env.VITE_DAF_API}/accumulated_cash_flow/summary_cash_flow/?entity_id=${entityId}`;
    try {
      let response = await fetchData(url);
      setCummulative(response?.daily_sums);
      setCummulativeSrc(response?.daily_sums);
    } catch (error) {
      console.log(error);
    }
  }
    useEffect(()=>{
    let comparisons = handleCompare(recipeData, expenseData);
    setTreasuryData(comparisons);
    setTreasuryDataSrc(comparisons);

  }, [recipeData, expenseData]);

  useEffect(()=>{
    // handleGellAllExpenses();

    handleGetRecipeSummary();
    // handleGetRecipeSummaryPrediction();

    handleGetExpenseSummary();
    // handleGetExpenseSummaryPrediction();

    handleFetchCumulative();
  }, []);

  useEffect(()=>{
    switch(step){
      
      case "WEEK" :        
        let weeklyRecipes = groupByWeek(recipeDataSrc);
        let weeklyExpenses = groupByWeek(expenseDataSrc);
        let weeklyCummulative = groupByWeek(cummulativeSrc);
        let weeklyTreasury = handleCompare(weeklyRecipes, weeklyExpenses);
        
        setExpenseData(weeklyExpenses);
        setRecipeData(weeklyRecipes);
        setTreasuryData(weeklyTreasury);
        setCummulative(weeklyCummulative);
        return

      case "MONTH":
        let monthlyRecipes = groupByMonth(recipeDataSrc);
        let monthlyExpenses = groupByMonth(expenseDataSrc);
        let monthlyCummulative = groupByWeek(cummulativeSrc);
        let monthlyTreasury = handleCompare(monthlyRecipes, monthlyExpenses);


        console.log(monthlyCummulative);
        setExpenseData(monthlyExpenses);
        setRecipeData(monthlyRecipes);
        setCummulative(monthlyCummulative);
        setTreasuryData(monthlyTreasury);
        return

      default :
        setExpenseData(expenseDataSrc);
        setRecipeData(recipeDataSrc);
        setCummulative(cummulativeSrc);
        setTreasuryData(treasuryDataSrc);
      return

    }
  }, [step]);

  // Function to filter objects by date range
  function filterObjectsByDateRange(objects, startDate, endDate) {
    const filteredObjects = objects?.filter(obj => {
      const objDate =new Date(obj.day.split("T")[0]).toLocaleDateString()?.replaceAll("/", "-")?.split("-")?.reverse()?.join("-");
      console.log(objDate);
      return objDate >= startDate && objDate <= endDate;
    });
    return filteredObjects;
  }

  useEffect(()=>{
    if(startDate != "" && endDate != ""){
      const filteredData = filterObjectsByDateRange(recipeDataSrc, startDate, endDate);
      const expenseFilteredData = filterObjectsByDateRange(expenseDataSrc, startDate, endDate);
      const cummulativeFilteredData = filterObjectsByDateRange(cummulativeSrc?.daily_sums, startDate, endDate);

      setRecipeData(filteredData);
      setExpenseData(expenseFilteredData);
      setCummulative(cummulativeFilteredData);

      const expense = expenseFilteredData?.reduce((total, item)=>{
        return total + item.total_amount
      }, 0);
      
      const recipe = filteredData?.reduce((total, item)=>{
        return total + item.total_amount
      }, 0);


      setRecipeTotal(recipe);
      setExpenseTotal(expense);
      
    }
    else{
      setExpenseTotal(tempExpenseTotal);
      setRecipeTotal(tempRecipeTotal);
      
      setRecipeData(recipeDataSrc);
      setExpenseData(expenseDataSrc);
    }
  }, [startDate, endDate]);

  return (
    <LoginLayout>
      <div className='w-full h-full overflow-y-auto flex flex-col p-5'>
        <div className='border-[1px] border-gray-100 my-2 p-2 rounded-lg flex items-center space-x-2'> 
          
          <input type="date" value={startDate} className='text-xs' onChange={e => setStartDate(e.target.value)}/>
          <input type="date" value={endDate} className='text-xs' onChange={e => setEndDate(e.target.value)}/>
        </div>
        <div className='h-1/4 flex flex-col md:flex-row items-center justify-evenly space-y-2 md:space-x-2'>

          <div className='bg-gradient-to-r from-green-500 to-green-400 rounded-lg shadow-lg p-4 w-full md:w-1/3 text-white'>
            <h3>Recettes</h3>
            <p className='text-sm'>
            Total : <b> {numberWithCommas(recipeTotal)} XAF</b>
            {/* Total : <b> {numberWithCommas(sumMontants(recipeData))} XAF</b> */}
            </p>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-4 w-full md:w-1/3 text-white'>
            <h3>Dépenses</h3>
            <p className='text-sm'>
            Total : <b> {numberWithCommas(expenseTotal)} XAF</b>
            {/* Total : <b> {numberWithCommas(sumMontants(expenseData))} XAF</b> */}
            </p>
          </div>
          <div className='bg-gradient-to-r from-green-600 to-green-400 rounded-lg shadow-lg p-4 w-full md:w-1/3 text-white'>
            <h3>Trésorerie</h3>
            <p className='text-sm'>
              Total : <b>{numberWithCommas(recipeTotal - expenseTotal)} XAF</b>
            </p>
          </div>

        </div>
        <div className='h-3/4 flex flex-col space-y-3'>
        <div className=''>
          <TabsComponent>
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
            <Tab 
              title={<p className='text-md'>Trésoreries</p>}
              isActive={path === "treasury"}
              onClick={()=>handleTabClick("treasury")}
            />
          </TabsComponent>
          <div className='flex w-auto justify-end items-center space-x-2 mt-2'>
            <label htmlFor="" className='text-xs'>Choisir le pas :</label>
            <select className='text-xs' value={step} onChange={e=>setStep(e.target.value)}>
              <option value="">Jour</option>
              <option value="WEEK">Semain</option>
              <option value="MONTH">Mois</option>
            </select>
          </div>
        </div>
          <div className=''>
            {/* Graph body */}
            <div className='max-h-[250px] h-[250px] w-full overflow-y-auto md:p-2'>
              {/* <LineChart chartData={userData} /> */}
              <Chart 
                data={
                  path === "recipes" ? recipeData : 
                  path === "expenses"? expenseData : 
                  treasuryData
                } 
                predictions={path === "treasury" ? cummulative : []}
              />
            </div>

          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default Dashboard