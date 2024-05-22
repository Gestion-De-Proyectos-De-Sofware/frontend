import React, { useState } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './DropdownLang.css'; // Import the CSS file for styling

const DropdownLang = ({onClick}) => {
  const [selectedOption, setSelectedOption] = useState('English');

  const handleMenuClick = (e) => {
    setSelectedOption(e.key);
    onClick(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="English">
      <img src="/images/estados-unidos.png" alt="US flag" className="flag-icon" /> English
      </Menu.Item>
      <Menu.Item key="Spanish">
      <img src="/images/colombia.png" alt="Colombia flag" className="flag-icon" /> Spanish
      </Menu.Item>
    </Menu>
  );
  
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        {selectedOption === 'English' 
        ? <><img src="/images/estados-unidos.png" alt="US flag" className="flag-icon" /> English</>
        : <><img src="/images/colombia.png" alt="Colombia flag" className="flag-icon" /> Spanish</>
        } <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default DropdownLang;
