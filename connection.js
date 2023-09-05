import { MongoClient } from 'mongodb';
const uri = 'mongodb+srv://gauravcoding:o4oqY7t4PibERLja@cluster0.obeqo1y.mongodb.net/?retryWrites=true&w=majority'; 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

export function getInventoryCollection() {
  const database = client.db('Inventory_Information'); 
  const collection = database.collection('Inventory'); 
  return collection;
}

export function getLoginCollection() {
    const database = client.db('Login_Information'); 
    const collection = database.collection('Credentials'); 
    return collection;
  }

  export function getRequestCollection() {
    const database = client.db('Requests_Information'); 
    const collection = database.collection('Requests'); 
    return collection;
  }

export async function closeMongoDBConnection() {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  }

