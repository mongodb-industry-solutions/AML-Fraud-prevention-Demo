import React, { useState } from 'react';
import { NumberInput } from '@leafygreen-ui/number-input';
import TextInput from '@leafygreen-ui/text-input';
import { DatePicker } from '@leafygreen-ui/date-picker';
import Button  from '@leafygreen-ui/button';
import Popup from '../components/Popup';
import styles from '../styles/form.module.css';

const FormComponent = () => {
  
  const account = {originator_id: Number(localStorage.getItem('_id')),originator_type:localStorage.getItem('name'), reported_originator_address: localStorage.getItem('address'), transaction_date: new Date()
    , beneficiary_id: '', beneficiary_type: '', transaction_amount: '',  fraud_vectors:[], fraud_text:"", AML_text:"", AML_vectors:[]}
  
  const formData = [
    
    { label: "Originator Entity Type", type: "text", name: "or_acc_type", disabled: true, value: localStorage.getItem('entity_type')},
    { label: "Originator Entity Name", type: "text", name: "originator_type", disabled: true, value: account.originator_type},
    { label: "Reported Originator Address", type: "text", name: "reported_originator_address" ,disabled: false, value: ""},//account.reported_originator_address
    { label: "Originator Risk", type: "text", name: "risk" ,disabled: true, value: localStorage.getItem('risk') },
    
    { label: "Beneficiary Entity Type", type: "text", name: "be_acc_type" ,disabled: true, value:"" },
    //{ label: "Beneficiary ID", type: "number", name: "beneficiary_id" ,disabled: true, value:"" },
    { label: "Originator Entity Name", type: "text", name: "beneficiary_type" ,disabled: false , value:"" },
    { label: "Reported Beneficiary Address", type: "text", name: "reported_beneficiary_address" ,disabled: false, value:""  },
    { label: "Beneficiary Risk", type: "text", name: "risk" ,disabled: true, value: ""},
    { label: "Transaction Amount", type: "number", name: "transaction_amount" ,disabled: false, value: ""  },
    { label: "Transaction Date/Time", type: "date", name: "transaction_date", disabled: true, value: ""},
  ];

  const [formState, setFormState] = useState(account);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState({"acknowledged": false, "insertedId": ""}); 
  const [verificationLoading, setverificationLoading] = useState(true); 
  const [sanction, setSanction] = useState(); 
  const [AML, setAML] = useState(); 
  const [fraud, setFraud] = useState(); 

  const handleClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleChange = async (event, dataType, fieldName) => {
    let value = event.target.value;
    switch (dataType) {
      case 'number':
        value = Number(value);
        break;
      case 'text':
        value = String(value);
        break;
      case 'date':
        value = Date(value);
        break;
      default:
        break;
    }
    setFormState({ ...formState, [fieldName]: value });
    if (fieldName === 'beneficiary_type') {
       const pipeline = [ { "$match":{ name: value }}, { "$project": { _id: 1, address: "$contact_information.address", risk:1,entity_type:1 }} ]
       const benef_id= await fetchData(pipeline)
       if (benef_id.length > 0) {
        setFormState({ ...formState, [fieldName]: value, beneficiary_id: benef_id[0]._id, reported_beneficiary_address: benef_id[0].address, risk: benef_id[0].risk, be_acc_type: benef_id[0].entity_type});
       } else {
        setFormState({ ...formState, [fieldName]: value, beneficiary_id: '', reported_beneficiary_address: '', risk: '', be_acc_type:'' });
       }
    }
  };

  const fetchData = async (pipeline) => {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col: 'accounts', 
        pipeline: pipeline })
    });
    const responseData = await response.json();
    return responseData;
  };

  const check = async (benef_id) => {
    const response = await fetch('/api/count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col: 'accounts', 
        filter: { _id: benef_id } }) 
    });
    const responseData = await response.json();
    return responseData;
  };

  const renderInput = (field) => {
    const fieldValue = field.value !== "" ? field.value : formState[field.name] || '';
    switch (field.type) {
      case 'text':
        return <TextInput label={field.label} sizeVariant={'small'} disabled={field.disabled} placeholder={field.type} value={fieldValue} onChange={(event) => handleChange(event, field.type, field.name)} />;
      case 'number':
        return <NumberInput label={field.label} size={'small'} disabled={field.disabled} placeholder={field.type} value={fieldValue} onChange={(event) => handleChange(event, field.type, field.name)} />;
      case 'date':
        return <DatePicker label={field.label} size={'small'} disabled={field.disabled} placeholder={field.type} value={fieldValue} onChange={(event) => handleChange(event, field.type, field.name)} />;
      default:
        return null;
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    const exists = await check(formState['beneficiary_id']);

    if (!formState['transaction_amount'] || !formState['beneficiary_id'] || !formState['beneficiary_type']) {
        alert(`Fields 'Transaction Amount', 'Beneficiary ID', 'Beneficiary Type' are required.`);
        console.error(`Fields 'Transaction Amount', 'Beneficiary ID', 'Beneficiary Type' are required.`);
        return;
    } else if (formState['transaction_amount'] < 0) {
        alert(`Field 'Transaction Amount' must be a positive number.`);
        console.error(`Field 'Transaction Amount' must be a positive number.`);
        return;
    } else if (formState['beneficiary_id'] === formState['originator_id']) {
        alert(`Field 'Beneficiary ID' must be different from 'Originator ID'.`);
        console.error(`Field 'Beneficiary ID'  must be different from 'Originator ID'.`);
        return;
    } else if (exists<1) {
        alert(`Field 'Beneficiary ID' Doesn't exist.`);
        return;
    }
    event.preventDefault();
    handleClick();
    const sanctioned = await KYC([formState['originator_type'], formState['beneficiary_type']]);
    const sanct = sanctioned.document.length>0 ? 1 : 0;
    const { risk,be_acc_type, ...updateDoc } = formState;
    //console.log("updateDoc",updateDoc);
    updateDoc.sanctioned = sanct;
    setSanction(sanct>0 ? sanctioned.document[0].entity_name : []);
    await updateData(updateDoc);
    setverificationLoading(false);
    setLoading(false);
  };

  const updateData = async (updateDoc) => {
    updateDoc.transaction_date= new Date()

    const response = await fetch('/api/insertOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col: 'transactions', insert: updateDoc, }) 
    });
    const data = await response.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    await fetch(`${apiUrl}/embedings?_id=${data.insertedId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' } });

    const resp = await fetch(`${apiUrl}/verification?_id=${data.insertedId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' } });
    
    const responseData = await resp.json();

    await setAML(responseData.aml);
    await setFraud(responseData.fraud);
    setData(data);
    return data;
  };

  const KYC = async (partiesInvolved) => {
    const kycURL = process.env.NEXT_PUBLIC_FUZZY_URL;
    const req = JSON.stringify({"col": "sanctioned", "pipeline": 
      [ { "$search":
          { "index": "Sanctions",
            "text": {
              "query": partiesInvolved,
              "path": "entity_name",
              "fuzzy": { "maxEdits": 2 }
          } }}
      , { "$project": {
          "_id": 1,
          "entity_name": 1,
          "score": { "$meta": "searchScore" }
        } }
      , { "$match": { "score": { "$gt": 2.5} } }
      ] } ) 
    const response = await fetch(kycURL, {
      method: 'POST',
      body: req
    });
    const data = await response.json();
    return data;
  };

  return (
    <div>
        <form style={{ display: 'flex', flexWrap: 'wrap',  }}>
        {Object.values(formData).map((field, index) => (
            <div key={index} style={{ flex: '1 0 21%', margin: '15px', }}>{renderInput(field)}</div>
        ))}
        </form>
        <Button size={'default'} baseFontSize={16} onClick={handleSubmit}> Submit </Button>
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup} loading={loading}>
          {loading ? (
            <div className={styles.container}>
              Please do not close this window while your payment request is being saved.
            </div>
          ) : !data.acknowledged ? (
            <div className={styles.container}>
              Your payment request faced some technical problems. Please try again, if the issue persist contact IT support.
            </div>
          ) : (
            <div className={styles.container}>
              Congratulations, your payment request has been completed successfully. Please copy your reference number for future reference: {data.insertedId} 
              {verificationLoading ? (
                <div className={styles.message}>
                  Verification is in process...
                </div>
              ) : sanction.length > 0  || AML || fraud ? (
                <div className={styles.message}>
                  {sanction.length > 0  ? <div>Your payment request has been declined because the beneficiary is a sanctioned entity.</div> : null}
                  {AML === 1 ? <div>Your payment request has been declined due to potential anti-money laundering (AML) activity.</div> : null}
                  {fraud === 1 ? <div>Your payment request has been declined due to potential fraud activity.</div> : null}
                  <br />Please contact the Case Management team with your payment reference number to learn the exact reasons for this decline
                </div>
              ) : (
                <div className={styles.message}>
                  Verification complete. Transaction successful.
                </div>
              )}
            </div>
          )}
        </Popup>
    </div>
  );
};
export default FormComponent;
