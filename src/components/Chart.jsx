import React, {useState} from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
const { RangePicker } = DatePicker;

function Chart({ data, legendBorderColor, legendBgColor, predictions }) {
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const chartData = {
    labels: data?.map(item => new Date(item?.day?.split("T")[0])?.toLocaleDateString()),
    datasets: [
      {
        label: 'Trésoreries',
        data: data?.map(item => item?.total_amount),
        borderColor: "",
        backgroundColor: "",
      },
      // {
      //   label: 'Cummule de trésorerie',
      //   data: predictions?.map(item => item?.total_amount),
      //   borderColor: "",
      //   backgroundColor: "",
      // },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
        labels: {
          color: '#000',
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
        },
      ],
      
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Total Amount (Fcfa)',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
  };

  return (
    <div>
      <Line
        style={{ maxHeight: "200px" }}
        options={chartOptions}
        datasetIdKey='id'
        data={chartData}
      />
    </div>
  );
}

export default Chart;
