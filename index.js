import express from "express";
import cors from 'cors'; 


import bodyParser from 'body-parser';
import loginRoutes from './routes/login.js'
import inventoryRoutes from './routes/inventory.js'
import requestsRoutes from './routes/requests.js'

const app =express()
app.use(cors());
const PORT = 8080;

import { connectToMongoDB, getInventoryCollection, closeMongoDBConnection } from './connection.js'; 

app.use(bodyParser.json())
app.use('/login', loginRoutes)
app.use('/inventory', inventoryRoutes)
app.use('/requests', requestsRoutes)

app.get('/', (req,res) =>{
    res.send('Backend Application ...')
})

app.listen(PORT, () => console.log("server running..."))