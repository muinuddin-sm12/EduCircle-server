const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 7000
const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://educircle-b9a11.web.app',
        'https://educircle-b9a11.firebaseapp.com'
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ff1pkvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const assignmentsCollection = client.db('assignmentsDB').collection('assignments')

    // save a assignment in dataBase
    app.post('/assignments', async(req, res) => {
        const assignmentData = req.body
        const result = await assignmentsCollection.insertOne(assignmentData)
        res.send(result)
    })
    // get all assignment from dataBase
    app.get('/assignments', async(req, res) => {
        const result = await assignmentsCollection.find().toArray()
        res.send(result)
    })

    // get single assignment by id
    app.get('/assignments/:id', async (req, res) => {
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await assignmentsCollection.findOne(query)
      res.send(result)
    })
    app.delete('/assignments/:id', async(req,res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await assignmentsCollection.deleteOne(query)
      res.send(result)
    })
    // update a assignment in dataBase
    app.put('/assignments/:id', async(req, res) => {
      const id = req.params.id 
      const assignmentData = req.body
      const query = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateDoc = {
        $set: {
          ...assignmentData
        }
      }
      const result = await assignmentsCollection.updateOne(query, updateDoc, options)
      res.send(result)
      })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello from EduCircle Server....')
}) 
app.listen(port, () => console.log(`Server running on port ${port}`))
