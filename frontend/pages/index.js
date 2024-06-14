import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormComponent from '../components/Form';
import Icon from '@leafygreen-ui/icon';
import styles from '../styles/Home.module.css';
import { H2, Body }  from '@leafygreen-ui/typography';
import { Tabs, Tab } from '@leafygreen-ui/tabs';
import TransactionTable from '../components/TransactionTable';
import { useRouter } from 'next/router';

const HomePage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      let clientId = router.query.clientid;
      localStorage.setItem('login', clientId);
      console.log('clientId', clientId)
      if (!clientId) {
        clientId = localStorage.getItem('_id');
        console.log('login', clientId)
      } 
      check(parseInt(clientId, 10));
    }
  }, [router.isReady, router.query]);

  const check = async (acc_id) => {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col: 'accounts', 
        pipeline: [{"$match": { _id: acc_id }}
                  ,{"$project":{ name: 1 ,address: "$contact_information.address", risk:1,entity_type:1 } }] }) 
    });
    const responseData = await response.json();
    //console.log('here',!responseData || responseData.length === 0);
    if (!responseData || responseData.length === 0) {
      console.log('Client ID does not exist');
      router.push('/login');
      return;
    }
    console.log(responseData);
    localStorage.setItem('_id', acc_id);
    localStorage.setItem('name', responseData[0].name);
    localStorage.setItem('address', responseData[0].address);
    localStorage.setItem('risk', responseData[0].risk);
    localStorage.setItem('entity_type', responseData[0].entity_type);
    //window.location.href = '/';
    return responseData;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleButton = (
    <button onClick={toggleSidebar}
        style={{ position: 'fixed', top: '70px', left: isSidebarOpen ? '520px' : '40px', zIndex: 2, width: '40px',
          height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #ccc', display: 'flex',
          justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'left 0.3s ease',}}
      > {isSidebarOpen ? <Icon glyph="ChevronLeft" /> : <Icon glyph="ChevronRight" />}
      </button>
  );

  return (
    <div>
      <Header />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <>{toggleButton}</>
      <div style={{margin: isSidebarOpen ? '75px 0 0 570px' : '70px 0 0 80px', transition: 'left 0.3s ease' }}>
        <div style={{ marginBottom: '20px' }}>
          <H2>My Dashboard</H2>
        </div>
        <Tabs setSelected={setSelected} selected={selected} baseFontSize={16}>
          <Tab name="My Transactions" disabled={false}>
            <TransactionTable />
          </Tab>
          <Tab name="New Transaction" styles={{zIndex:'0'}} >
            <FormComponent/>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default HomePage;