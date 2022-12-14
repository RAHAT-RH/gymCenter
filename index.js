const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const ObjectID = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;


// Middle Ware
app.use(cors());
app.use(express.json());

//  password : XPTcedQDXZaGxFxi
// username: dbuser1 Rahat
// const collection = client.db("test").collection("devices");


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@gym.rjr1akr.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tp0x4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const equipmentCollection = client.db("allEquipment").collection("equipments");

    //   add Equipment
    app.post('/addEquipment', async (req, res) => {
      const newEquipment = req.body;
      const result = await equipmentCollection.insertOne(newEquipment);
      res.send(result);
    })

    //Get read all data
    app.get('/allEquipments', async (req, res) => {
      // console.log('query', req.query)
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const query = {};
      let result;
      const cursor = equipmentCollection.find(query)
      if (page || size) {
        result = await cursor.skip(page * size).limit(size).toArray();
      }
      else {
        result = await cursor.toArray();
      }

      res.send(result);
    })


    // Single Equipment find
    app.get('/equipments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await equipmentCollection.findOne(query)
      res.send(result);
    })

    // Update Equipment Update

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const updateEquipment = req.body;
      const filter = { _id: ObjectID(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updateEquipment.name,
          img: updateEquipment.img,
          categories: updateEquipment.categories,
          quantity: updateEquipment.quantity,
          country: updateEquipment.country,
          details: updateEquipment.details,
        }
      };
      const result = await equipmentCollection.updateOne(filter, updatedDoc, options)
      res.send(result);

    })

    app.put('/updateQuantity/:id', async (req, res) => {
      const id = req.params.id;
      const updateEquipment = req.body;
      const filter = { _id: ObjectID(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updateEquipment.quantity,
        }
      };
      const result = await equipmentCollection.updateOne(filter, updatedDoc, options)
      res.send(result);

    })

    // // read Equipment
    // // app.get('/equipments', async (req, res) => {
    // //   const page = parseInt(req.query.page);
    // //   const size = parseInt(req.query.size);

    // //   console.log('query', req.query)
    // //   const query = {};
    // //   const cursor = equipmentCollection.find(query);
    // //   const result = await cursor.toArray();
    // //   res.send(result);
    // // })

    // get count

    app.get('/equipmentCount', async (req, res) => {
      const query = {};
      const cursor = equipmentCollection.find(query);
      const count = await cursor.count();
      res.send({ count });
    })

    // Delete Equipment
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await equipmentCollection.deleteOne(query);
      res.send(result)
    })

  } finally {
    //   await client.close();
  }
}


run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("It's Okay man");
})

app.listen(port, console.log("Listing port", port))
