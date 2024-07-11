import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import useFetch from '../../hooks/useFetch';

function CaissePageHeader({cashBalance}) {

    const numberWithCommas=(x)=>{
        return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
    }

    let entityId = JSON.parse(localStorage.getItem("user"))?.entity.id;

    // useState
    const [expense, setExpense] = useState("");
    const [recipe, setRecipe] = useState("");
    const [expenses, setExpenses] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [recipeDataSrc, setRecipeDataSrc] = useState([]);
    const [recipeData, setRecipeData] = useState([]);

    const [expenseDataSrc, setExpenseDataSrc] = useState([]);
    const [expenseData, setExpenseData] = useState([]);

    const [tempRecipeTotal, setTempRecipeTotal] = useState("0");
    const [tempExpenseTotal, setTempExpenseTotal] = useState("0");

    // Hooks
    const { requestError, requestLoading, fetchData } = useFetch();


    // Side Effects
    useEffect(()=>{
      handleGetExpenses()
      handleGetCheckouts();
    }, []);

    useEffect(()=>{
      if(startDate != "" && endDate != ""){
        const filteredData = filterObjectsByDateRange(recipeDataSrc, startDate, endDate);
        const expenseFilteredData = filterObjectsByDateRange(expenseDataSrc, startDate, endDate);

        setRecipeData(filteredData);
        setExpenseData(expenseFilteredData);
        const expense = expenseFilteredData?.reduce((total, item)=>{
          return total + item.total_amount
        }, 0);
        
        const recipe = filteredData?.reduce((total, item)=>{
          return total + item.total_amount
        }, 0);
  
  
        setExpense(recipe);
        setRecipe(expense);
      }
      else{
        setExpense(tempExpenseTotal);
        setRecipe(tempRecipeTotal);
        
        setRecipeData(recipeDataSrc);
        setExpenseData(expenseDataSrc);
      }
    }, [startDate, endDate]);

    // Handlers
    /**
     * Get the recipe summary
     */
    const handleGetCheckouts= async ()=>{
      let url = `${import.meta.env.VITE_DAF_API}/recipesheet/summary_by_year/?year=2024&entity_id=${entityId}`;
      try {
        const response = await fetchData(url);
        let lastRecipeSum = response?.daily_sums[response?.daily_sums.length-1]?.total_amount;
        setRecipe(lastRecipeSum);
        setTempRecipeTotal(lastRecipeSum);
        setRecipeData(response?.daily_sums);
        setRecipeDataSrc(response?.daily_sums);
      } catch (error) {
        console.error("Error: ", error);
      }
    }

    /**
     * Get the expense summary
     */
    const handleGetExpenses= async ()=>{
      let url = `${import.meta.env.VITE_DAF_API}/expensesheet/summary_by_year/?year=2024&entity_id=${entityId}`;
      try {
        const response = await fetchData(url);
        let lastExpenseSum = response?.daily_sums[response?.daily_sums.length-1]?.total_amount;
        setExpense(lastExpenseSum);
        setTempExpenseTotal(lastExpenseSum);
        setExpenseData(response?.daily_sums)
        setExpenseDataSrc(response?.daily_sums)
      } catch (error) {
        console.error("Error: ", error);
      }
    }

    // Methods
    /**
     * Group by week
     * @param {Array} dailySums 
     * @returns {[]}
     */
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

    /**
     * Group by month
     * @param {Array} dailySums 
     * @returns {[]}
     */
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

    // Function to filter objects by date range
    /** 
     * @param {Array} objects 
     * @param {String} startDate
     * @param {String} endDate 
     * @returns {[]}
     */
    function filterObjectsByDateRange(objects, startDate, endDate) {
      const filteredObjects = objects?.filter(obj => {
        const objDate =new Date(obj.day.split("T")[0]).toLocaleDateString()?.replaceAll("/", "-")?.split("-")?.reverse()?.join("-");
        return objDate >= startDate && objDate <= endDate;
      });
      return filteredObjects;
    }

  return (
    <div>
      <div className='flex items-center space-x-2'>
        <input type="date" value={startDate} className='text-xs' onChange={e=>setStartDate(e.target.value)}/>
        <input type="date" value={endDate} className='text-xs' onChange={e=>setEndDate(e.target.value)}/>
      </div>
      <PageHeader>
          <div className='flex justify-between items-center w-full'>
              <div className='mt-2 md:mt-0 flex space-x-5'>
                <h3 className='text-xs'>
                  Solde caisse à la fermeture : <b className={`bg-yellow-300 p-2 rounded-lg`}>{numberWithCommas(cashBalance) || 0} XAF</b>
                </h3>
                <h3 className='text-xs'>
                  Solde caisse actuel : <b className={`bg-yellow-300 p-2 rounded-lg`}>{!isNaN(expense+recipe-cashBalance) ? numberWithCommas(""+(expense+recipe-cashBalance)) : 0} XAF</b>
                </h3>
                <h3 className="text-xs">
                  Sortie de caisse : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(expense) || 0} XAF</b>
                </h3>
                <h3 className="text-xs">
                  Entrée en caisse : <b className='bg-yellow-300 p-2 rounded-lg'>{numberWithCommas(recipe) || 0} XAF</b>
                </h3>
              </div>
              {/* <div className='flex space-x-2 items-center'>
                <div className="flex space-x-2 items-center">
                  <label htmlFor="" className='text-xs'>Du :</label>
                  <input type="date" className='text-xs'/>
                </div>
                <div className="flex space-x-2 items-center">
                  <label htmlFor="" className='text-xs'>Du :</label>
                  <input type="date" className='text-xs'/>
                </div>
              </div>    */}
          </div>
      </PageHeader>
    </div>
  )
}

export default CaissePageHeader