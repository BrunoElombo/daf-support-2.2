import React, { useState } from 'react';

const SuggestInput = ({ dataList, inputValue, setInputValue, className }) => {
//   const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setInputValue(value);
    console.log(dataList)
    const filteredSuggestions = dataList.filter(item => item?.account_number.toLowerCase().includes(value.toLowerCase())
    //   item.toLowerCase().includes(value.toLowerCase())
);
    console.log(filteredSuggestions);
    setSuggestions(filteredSuggestions);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className='relative w-full md:w-1/2'>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type to search..."
        className={`${className}`}
        list="account-numbers"
      />
      <datalist className='absolute -bottom-10 w-full' id='account-numbers'>
        {suggestions.map((suggestion) => (
          <option className="bg-white p-2 shadow-sm" key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion.account_number)}>
            {suggestion.account_number}
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default SuggestInput;
