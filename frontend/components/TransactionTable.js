import React, { useEffect, useState } from 'react';
import '../styles/tableStyles.css';

const TransactionTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      const ID = Number(localStorage.getItem('_id'))
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ col: 'transactions', 
        pipeline: [ { "$match": { "$or":[{"beneficiary_id":ID}, {"originator_id":ID}] } }, 
                    { "$project": { _id: 0,
                        "transaction_date":1,
                        "originator_id":1,
                        "originator_type":1,
                        "reported_originator_address":1,
                        "beneficiary_id":1,
                        "beneficiary_type":1,
                        "reported_beneficiary_address":1,
                        "transaction_amount":1,
                        "status": {$cond: { if: { $or: [ { $eq: ["$fraud", 1] }, { $eq: ["$aml", 1] }, { $eq: ["$sanctioned", 1] } ] }, 
                          then: "Failed", else: {
                            "$cond": {
                              "if": { "$or": [ { "$eq": [{ "$ifNull": ["$fraud", 1] }, 1] }, { "$eq": [{ "$ifNull": ["$aml", 1] }, 1] }, { "$eq": [{ "$ifNull": ["$sanctioned", 1] }, 1] } ] },
                              "then": "Pending",
                              "else": "Successful"
                            }
                        } } }
                        }},
                    { "$sort": { "transaction_date": -1 } }, 
                  ]
            } ) 
      });
      const data = await response.json();
      //console.log(data);
      setData(data);
      setLoading(false);
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatFieldName = (fieldName) => {
    return fieldName.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  };
  
  return (
    <div className="table-wrapper">
        {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',fontSize: '19px', fontFamily: 'sans-serif', marginTop:'15px' }}>
            Loading...
        </div>
        ) : (
            <table className="table-container">
                <thead>
                    <tr>
                    {columns.map((column, index) => (
                        <th key={index} className={column === 'reported_originator_address' || column === 'reported_beneficiary_address' ? 'min-width-column' : ''}>
                          {formatFieldName(column)}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                    <tr key={rowIndex} >
                        {columns.map((column, columnIndex) => (
                        <td key={columnIndex}>{row[column]}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  );
};

export default TransactionTable;