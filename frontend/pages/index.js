import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormComponent from '../components/Form';
import Icon from '@leafygreen-ui/icon';
import styles from '../styles/Home.module.css';
import { H2, Body }  from '@leafygreen-ui/typography';
import { Tabs, Tab } from '@leafygreen-ui/tabs';
import TransactionTable from '../components/TransactionTable';


const HomePage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _id = localStorage.getItem('_id');
      const name = localStorage.getItem('name');
      const address = localStorage.getItem('address');
      if (!_id || !name || !address) {
        window.location.href = '/login';
        return;
      }
    } 
  }, []);

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