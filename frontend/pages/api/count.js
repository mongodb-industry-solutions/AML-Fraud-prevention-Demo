import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please send a POST request.' });
  }

  const { col, filter } = req.body;

  if (!filter) {
    return res.status(400).json({ error: 'Both col and filter parameters are required.' });
  }

  try {
    const dbName = process.env.NEXT_PUBLIC_MONGODB_DB;
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(col);

    const data = await collection.countDocuments(filter);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}