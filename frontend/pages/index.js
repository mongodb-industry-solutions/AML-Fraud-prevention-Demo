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
import Head from 'next/head';
import ExpandableCard from '@leafygreen-ui/expandable-card';
import ReactMarkdown from 'react-markdown';


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

  const markdownText = `This demo showcases how MongoDB vector search can enhance fraud and AML detection accuracy by instantly identifying suspicious activity.
  
  ## Fraud and AML Detection Workflow
  Using artificially generated test data [1] for payment fraud and AML, incoming transactions are evaluated based on the percentage of previous transactions with similar characteristics that have failed due to suspicious activity. This is achieved through the use of OpenAI vector embeddings [2] and Atlas Vector search.
  
  ## Dashboard Features
  - **My Transactions**: A read-only display of all previous transactions of the user.
  - **New Transaction Screen**: Allows users to simulate a transaction.
  
  ## How to Simulate a Transaction
  1. Provide counterparty details (Originator and Beneficiary). Only the Beneficiary Name and transaction amount are required.
  2. Click submit to see Atlas vector search in action.
  3. The submitted transaction is processed for both fraud detection and AML.
  
  ## Outcome of Transaction Processing
  - **If flagged for fraud**: The transaction request is declined.
  - **If not flagged**: The transaction is completed successfully, and a confirmation message is shown.
  
  For rejected transactions, users can contact case management services with the transaction reference number for details. No action is needed for successful transactions.
  
  ---
  
  ### Footer notes:
  [1] Artificially generated using Python  
  [2] A vector embedding is a way of organizing data that makes it easier to identify similarities and relationships between different pieces of information. In this demo, the fraud embedding is based on a logical combination of text with transaction and counterparty data. The AML vector combines transactions, relationships between counterparties, and their risk profiles information.
  `;

  const markdownTextLines = markdownText.split('\n').map((line, index) => {
    const boldText = line.match(/\*\*(.*?)\*\*/g);
    if (boldText) {
      boldText.forEach((match) => {
        const bold = match.replace(/\*\*/g, '');
        line = line.replace(match, `<strong>${bold}</strong>`);
      });
    }
    line = line.replace(/\t/g, '&emsp;');
    return (
      <p key={index} style={{ margin: '0', padding: '0.5em 0' }}>
        <div dangerouslySetInnerHTML={{ __html: line }} />
      </p>
    );
  });

  return (
    <>
    <Head>
        <title>Vector AML Fraud demo</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div>
      <Header />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <>{toggleButton}</>
      <div style={{margin: isSidebarOpen ? '75px 0 0 570px' : '70px 0 0 80px', transition: 'left 0.3s ease' }}>
        <div style={{ marginBottom: '20px' }}>
            <ExpandableCard
              title="Instructions"
              darkMode={false}
              style={{ margin: '10px 5px 15px', marginTop: '30px' }}>
                <ReactMarkdown>{markdownText}</ReactMarkdown>
            </ExpandableCard>
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
    </>
  );
};

export default HomePage;