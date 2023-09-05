import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

const router = express.Router();


import { connectToMongoDB, getInventoryCollection, closeMongoDBConnection } from '../connection.js'; 

router.get('/', (req,res) => {
   
    // const { email,password } = req.params
    connectToMongoDB()
 
   .then(() => {
     const InventoryCollection = getInventoryCollection();

     InventoryCollection.find({}).toArray()
       .then((result) => {
         console.log('Documents in the "Inventory" collection:', result);
         res.json(result);
       })
       .catch((err) => {
         console.error('Error querying "Inventory" collection:', err);
       })
      //  .finally(() => {
      //    closeMongoDBConnection();
      //  });
   })
   
   .catch((err) => {
     console.error('Error connecting to MongoDB:', err);
     closeMongoDBConnection();
   });
 
 });


router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body; // Assuming you send the updated data in the request body
    console.log(productId)
    console.log(updatedData)

    connectToMongoDB()
      .then(() => {
        const InventoryCollection = getInventoryCollection();
        // Use findOneAndUpdate to update the product by ID

        InventoryCollection.findOneAndUpdate(
          { _id: new ObjectId(productId) }, // Query to find the product by its ID
          { $set: updatedData }, // Data to update
          { new: true } // Return the updated product
        )
          .then((updatedProduct) => {
            res.json(updatedProduct); // Send the updated product as a response
          })
          .catch((error) => {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          })
          // .finally(() => {
          //   console.log("here in finally")
          //   closeMongoDBConnection();
          // });
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  
router.post('/', (req, res) => {
    const newProduct = req.body; // Assuming you send the new product data in the request body
    console.log(newProduct);
  
    if (!newProduct) {
      return res.status(400).json({ error: 'Request body is missing' });
    }
  
    connectToMongoDB()
      .then(() => {
        const InventoryCollection = getInventoryCollection();
        
        // Generate a new product ID (you can use a library like 'uuid' for this)
        // newProduct._id = uuidv4(); 
        
        // Insert the new product into the collection
        InventoryCollection.insertOne(newProduct)
          .then((insertedProduct) => {
            console.log("inserted")
            res.status(200).send("successfully inster")
            
          })
          .catch((error) => {
            console.error('Error inserting product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          })
          // .finally(() => {
          //   closeMongoDBConnection();
          // });
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  

router.delete('/', async (req, res) => {
      try {
        const newRequestId = req.body['id'];
    
        if (!newRequestId) {
          // Check if the id is provided in the request body
          res.status(400).json({ error: 'Invalid request: Missing id in request body' });
          return;
        }
        
        // Connect to MongoDB
        await connectToMongoDB();
        const RequestCollection = getInventoryCollection();
    
        // Construct the filter
    
        const filter = { _id: new ObjectId(newRequestId) };
    
        // Attempt to delete the document
        const result = await RequestCollection.deleteOne(filter);
    
        // const result = await RequestCollection.findOneAndDelete(newRequestId);
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