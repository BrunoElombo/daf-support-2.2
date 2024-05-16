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


function Topfilter() {
  return (
    <div className='flex items-center space-x-2 justify-end w-full'>
        <p className='text-sm'>Filtre :</p>
        <RangePicker
            defaultValue={[dayjs(currentDate, dateFormat), dayjs(currentDate, dateFormat)]}
            format={dateFormat}
        />
    </div>
  )
}

export default Topfilter