import React, { useState } from 'react';

const SuggestInput = ({ dataList, inputValue, setInputValue, className, placeholder }) => {
  console.log(dataList)
//   const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filteredSuggestions = dataList.filter(item => item?.account_number.toLowerCase().includes(value.toLowerCase())
);
    setSuggestions(filteredSuggestions);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className='relative w-full'>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
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
