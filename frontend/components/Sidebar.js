// components/Sidebar.js
import React, { useEffect, useState } from 'react';
import styles from '../styles/sidebar.module.css';
import { H2,Body,Subtitle }  from '@leafygreen-ui/typography';


const Sidebar = ({ isOpen, toggleSidebar }) => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchData = async () => {

    const ID = localStorage.getItem('_id')
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col: 'accounts', 
        pipeline: [ { "$match":{ _id: Number(ID) }}, 
                    { "$project": { _id: 0,name: 1
                      ,address: "$contact_information.address" 
                      ,phone_number: "$contact_information.phone_number"
                      ,email: "$contact_information.email" }}
                  ] }) 
    });
    const responseData = await response.json();
    const firstElement = responseData.length > 0 ? responseData[0] : {};
    setData(firstElement);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatFieldName = (fieldName) => {
    return fieldName.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles['sidebar-content']}>
        <H2>My Profile</H2>
        <img className={styles.profileImage} src={'/images/userAvatar.png'} alt="Profile" />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {Object.keys(data).map((key, index) => (
              <div className={styles.profileItem}>
                <Subtitle>{formatFieldName(key)}:&nbsp;</Subtitle>
                <Body baseFontSize={16}>{data[key]}</Body>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
