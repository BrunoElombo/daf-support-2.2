import React, {useState} from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const [selectedDate, setSelectedDate] = useState("");
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const currentDate = new Date();
console.log(`${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`)


function Topfilter() {
  return (
    <div className='flex items-center space-x-2 justify-end w-full'>
        <p className='text-sm'>Filtre :</p>
        <RangePicker
            defaultValue={[dayjs(currentDate, dateFormat), dayjs(currentDate, dateFormat)]}
            format={dateFormat}
            value={selectedDate}
        />
    </div>
  )
}

export default Topfilter