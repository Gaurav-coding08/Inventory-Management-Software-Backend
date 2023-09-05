import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

const router = express.Router();


import { connectToMongoDB, getRequestCollection, closeMongoDBConnection } from '../connection.js'; 
router.get('/', (req,res) => {
   connectToMongoDB()
  .then(() => {
    const RequestCollection = getRequestCollection();
    RequestCollection.find({}).toArray()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error('Error querying "Login" collection:', err);
      })
      // .finally(() => {
      //   closeMongoDBConnection();
      // });
  })
  
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    closeMongoDBConnection();
  });

});


router.post('/',(req,res) =>{

    const newRequest = req.body; 
    console.log(newRequest);
  
    if (!newRequest) {
      return res.status(400).json({ error: 'Request body is missing' });
    }
  
    connectToMongoDB()
      .then(() => {
        const RequestCollection = getRequestCollection();
        RequestCollection.insertOne(newRequest)
          .then((insertedProduct) => {
            console.log("inserted")
            res.status(200).send("successfully inster")      
          })
          .catch((error) => {
            console.error('Error inserting product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          })
          .finally(() => {
            closeMongoDBConnection();
          });
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
})

router.delete('/', async (req, res) => {
  try {
    const newRequestId = req.body['id'];

    if (!newRequestId) {
      res.status(400).json({ error: 'Invalid request: Missing id in request body' });
      return;
    }
    
    await connectToMongoDB();
    const RequestCollection = getRequestCollection();

    const filter = { _id: new ObjectId(newRequestId) };

    const result = await RequestCollection.deleteOne(filter);

    console.log(result)

    if (result.deletedCount === 1) {
      console.log('Document deleted successfully');
      res.status(200).json({ message: 'Document deleted successfully' });
    } else {
      console.log('Document not found');
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;