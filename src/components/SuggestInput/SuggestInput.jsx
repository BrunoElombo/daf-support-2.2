import React, { useState } from 'react';

const SuggestInput = ({ 
  dataList, 
  inputValue, 
  setInputValue,
  displayValue,
  requestedValue, 
  key,
  placeholder 
}) => {
//   const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filteredSuggestions = dataList.filter(item => item?.account_number.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    // <div className='relative w-full'>
    //   <input
    //     type="text"
    //     value={inputValue}
    //     onChange={handleChange}
    //     placeholder={placeholder}
    //     className={`${className}`}
    //     list="account-numbers"
    //   />
    //   <ul className='absolute -bottom-10 w-full' id='account-numbers'>
    //     {
    //       suggestions.map((suggestion) => (
    //         <li className="bg-white p-2 shadow-sm" key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion.account_number)}>
    //           {suggestion.account_number}
    //         </li>
    //       ))
    //     }
    //   </ul>
    // </div>
    <div className='w-full relative flex flex-col'>
      <input 
        type="text" 
        className='w-full'
        value={inputValue} 
        onChange={handleChange}
        placeholder={placeholder}
      />
      {
        showSuggestions && suggestions &&
        <ul className={`${showSuggestions && 'hidden'} absolute -bottom-[60px] bg-white shadow-sm rounded-lg w-full z-100 overflow-y-scroll max-h-[60px]`}>
            {
              suggestions?.map((item, index) =>(
                <li 
                  className='text-xs text-gray-500 hover:bg-gray-100 p-2 w-full' 
                  key={index} 
                  value={item?.name}
                >
                  {item?.displayName}
                </li>
              ))
            }
        </ul>
      }
  </div>
  );
};

export default SuggestInput;
