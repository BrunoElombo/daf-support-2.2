import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart({data}) {

  const [selectedMonth, setSelectedMonth] = useState(null);
  
  const filteredData = () => {
    if (!selectedMonth) return data; // Return all data if no month selected

    const monthIndex = data?.labels.indexOf(selectedMonth); // Get index of selected month
    if (monthIndex === -1) return null; // Handle invalid month selection

    const filteredDatasets = data?.datasets.map(dataset => ({
      ...dataset,
      data: dataset?.data.slice(monthIndex, monthIndex + 1), // Extract data for selected month
    }));

    return {
      labels: [data?.labels[monthIndex]], // Update labels with only selected month
      datasets: filteredDatasets,
    };
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const chartOptions = {
    height: 200, // Set max height
    plugins: {
        legend: {
            display: true,
            labels: {
                color: '#000'
            }
        }
    },
    scales: {
        yAxes: [{
          ticks: {
            min: Math.min(...data.datasets[0].data) - 1,
            max: Math.max(...data.datasets[0].data) + 1,
          }
        }]
      },
      responsive:true,
      maintainAspectRatio:true,
      aspectRatio:2
  };
  return (
    <div>
        <div className='flex justify-between items-center'>
            <h3>Toutes les recettes</h3>
            <select value={selectedMonth} onChange={handleMonthChange} className='text-sm'>
                <option value="">All Months</option>
                {data.labels.map(month => (
                <option key={month} value={month}>
                    {month}
                </option>
                ))}
            </select>
        </div>
        <Line 
            style={{maxHeight: "200px"}}
            options={chartOptions}
            datasetIdKey='id'
            data={filteredData() || {}}
        />
    </div>
  )
}

export default Chart