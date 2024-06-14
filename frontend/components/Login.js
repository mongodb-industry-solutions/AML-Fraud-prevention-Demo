import React, { useState } from 'react';
import { PasswordInput } from '@leafygreen-ui/password-input';
import TextInput from '@leafygreen-ui/text-input';
import { H2 } from '@leafygreen-ui/typography';
import { MongoDBLogoMark } from '@leafygreen-ui/logo';
import { Body }  from '@leafygreen-ui/typography';
import Button  from '@leafygreen-ui/button';

const LoginPage = () => {
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');

  const handleClientIdChange = (event) => {
    setClientId(event.target.value);
    setPassword(event.target.value);
  };

  const check = async (acc_id) => {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col: 'accounts', 
        pipeline: [{"$match": { _id: acc_id }}
                  ,{"$project":{ name: 1 ,address: "$contact_information.address", risk:1,entity_type:1 } }] }) 
    });
    const responseData = await response.json();
    return responseData;
  };

  const handleLogin = async () => {
    console.log(clientId);
    const exi = await check(Number(clientId));
    console.log("risk",exi[0].risk);
    if (clientId.trim() === '' || password.trim() === '') {
      alert('Please enter both Client ID and Password');
      return;
    }else if(exi.length<1) {
      alert('Client ID does not exist');
      return;
    } else {
      localStorage.setItem('_id', clientId);
      localStorage.setItem('name', exi[0].name);
      localStorage.setItem('address', exi[0].address);
      localStorage.setItem('risk', exi[0].risk);
      localStorage.setItem('entity_type', exi[0].entity_type);
      window.location.href = '/';
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    loginBox: {
      background: '#FFFFFF', 
      border: '10px', 
      borderRadius: '10px', 
      boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '50px', 
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: { textAlign: 'left', width: '200px', },
    button: { margin: '10px' },
  };

  return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <form style={styles.form}>
            <MongoDBLogoMark />
            <H2 style={styles.button}>AML and Fraud prevention</H2>
            <TextInput
              label="Client ID"
              placeholder="48172"
              onChange={handleClientIdChange}
              value={clientId}
              style={{position: 'relative', top: '0px', left: '-10px',  width: '180px', boxSizing: 'border-box',  padding: '5px',}}
            />
            <PasswordInput
              label="Enter Password"
              id="new-password"
              onChange={handleClientIdChange}
              value={password}
              style={{position: 'relative', top: '0px', left: '14px',  width: '180px',}}
            />
            <Button size={'default'} onClick={handleLogin} style={{marginTop: '10px',}} > Login </Button>
          </form>
      </div>
    </div>
  );
};

export default LoginPage;
