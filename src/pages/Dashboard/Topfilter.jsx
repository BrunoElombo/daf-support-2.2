import React from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();
const currentDate = today.toLocaleDateString("en-CA", { year: 'numeric', month: '2-digit', day: '2-digit' });
console.log(currentDate)

const months = [
  {
    number: 1,
    label: 'Jan',
  },
  {
    number: 2,
    label: 'Feb',
  },
  {
    number: 3,
    label: 'Mars',
  },
  {
    number: 4,
    label: 'Apr',
  },
  {
    number: 5,
    label: 'May',
  },
  {
    number: 6,
    label: 'June',
  },
  {
    number: 7,
    label: 'Jul',
  },
  {
    number: 8,
    label: 'Aug',
  },
  {
    number: 9,
    label: 'Sept',
  },
  {
    number: 10,
    label: 'Oct',
  },
  {
    number: 11,
    label: 'Nov',
  },
  {
    number: 12,
    label: 'Dec',
  },
];

function Topfilter() {
  return (
    <div className='flex items-center space-x-2 justify-end w-full'>
        <p className='text-sm'>Mois :</p>
        <select name="" id="" className='text-xs'>
          {
            months.map(month => <option key={month.number} value={month.number}>{month.label}</option>)
          }
        </select>
        <p className='text-sm'>Année :</p>
        <input type="text" value={new Date().getFullYear()} className='text-xs'/>
        {/* <RangePicker
            defaultValue={[dayjs(currentDate, dateFormat), dayjs(currentDate, dateFormat)]}
            format={dateFormat}
        /> */}
    </div>
  )
}

export default Topfilter