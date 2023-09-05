import express from 'express'
import { v4 as uuidv4 } from 'uuid';


const router = express.Router();


import { connectToMongoDB, getLoginCollection, closeMongoDBConnection } from '../connection.js'; 


router.get('/:email/:password', (req,res) => {
   
   const { email,password } = req.params
   connectToMongoDB()
  .then(() => {
    const LoginCollection = getLoginCollection();
    LoginCollection.find({ email ,password}).toArray()
      .then((result) => {
        console.log('Documents in the "Login" collection:', result);
        res.json(result);
      })
      .catch((err) => {
        console.error('Error querying "Login" collection:', err);
      })
      .finally(() => {
        closeMongoDBConnection();
      });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    closeMongoDBConnection();
  });

});

router.post('/', (req,res) => {
   
  const newLogin = req.body; 
    console.log(newLogin);
  
    if (!newLogin) {
      return res.status(400).json({ error: 'Request body is missing' });
    }
  
    connectToMongoDB()
      .then(() => {
        const LoginCollection = getLoginCollection();
        
        LoginCollection.insertOne(newLogin)
          .then((insertedLoginDetails) => {
            console.log("inserted")
            res.status(200).send("successfully inserted")
            
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
    
})

router.get('/', (req,res) => {
   
  connectToMongoDB()

 .then(() => {
   const LoginCollection = getLoginCollection();

     LoginCollection.find({}).toArray()
     .then((result) => {
       console.log('Credentials in the authorised database are:', result);
       res.json(result);
     })
     .catch((err) => {
       console.error('error quering authorization database', err);
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



export default router;