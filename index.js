const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;




//using middlewire
app.use(cors());
app.use(express.json())


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

//!mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrgzzke.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    //setting data on mongodb
    // const db = client.db("toyCorner");
    // const toyInformationCollection = db.collection("toyinfo")

    // const dataBase = client.db('toyCorner');
    // const showDataCollection = dataBase.collection("loadedData")
    const toyInformationCollection = client.db('toyCorner').collection('toyinfo');




    app.post('/toyinfo', async (req, res) => {
      const info = req.body;
      console.log(info);
      const result = await toyInformationCollection.insertOne(info);
      res.send(result);
    });


    app.get('/toyinfo', async (req, res) => {
      const cursor = toyInformationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })





    app.get("/toyinfo/:id", async (req, res) => {
      const id = req.params.id;
      // const query = { _id: new ObjectId(id) };
      const query = { _id: new ObjectId(id) };
      const result = await toyInformationCollection.findOne(query);
      res.send(result);

    })

    //for delete
    app.delete("/toyinfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyInformationCollection.deleteOne(query);
      res.send(result);
    })

    app.get("/toyEmail/:email", async (req, res) => {
      console.log(req.params.id);
      const jobs = await toyInformationCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(jobs);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//for taking  data in the body
app.get('/', (req, res) => {
  res.send('Toy center is loading')
})

//for the port
app.listen(port, () => {
  console.log(`running Site on: ${port}`);
})