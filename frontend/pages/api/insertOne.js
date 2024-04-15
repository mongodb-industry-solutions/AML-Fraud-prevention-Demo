// pages/api/insertOne.js

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { col, insert } = req.body;
    //console.log(req.body);
    const client = await clientPromise;
    const dbName = process.env.NEXT_PUBLIC_MONGODB_DB;
    const db = client.db(dbName);
    const coll = db.collection(col);

    const data = await coll.insertOne(insert);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
