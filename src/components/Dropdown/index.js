import React, { useState } from 'react';
import './DropdownLang.css'; // Import the CSS file for styling

const DropdownLang = ({onClick}) => {
  const [selectedOption, setSelectedOption] = useState('English');

  const handleOptionChange = (e) => {
    onClick(e.target.value)
    setSelectedOption(e.target.value);
  };


  
  return (
    <div className="dropdown-container" style={{ paddingRight: '30%' }}>
      <select value={selectedOption} onChange={handleOptionChange} className="dropdown-select">
        <option id="englishOption" value="English">🇺🇸 English</option>
        <option id="spanishOption" value="Spanish">🇪🇸 Spanish</option>
      </select>
    </div>
  );
};

export default DropdownLang;
