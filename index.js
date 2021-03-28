const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkcgo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 3005



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  //demo 
  app.get('/', (req, res) => {
    res.send('Hello ema john!')
  })

  //create data
  app.post('/addProduct', (req, res) => {
      const products = req.body;
      // console.log(products);
      productsCollection.insertOne(products)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })

  //read data
  app.get('/products', (req, res) => {
    productsCollection.find({}).limit(20)
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })
  //read single product
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key}).limit(20)
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })
  //read multiple keys
  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys } })
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  //Add Orders
   app.post('/addOrder', (req, res) => {
    const orderInfo = req.body;
    ordersCollection.insertOne(orderInfo)
    .then(result => {
       res.send(result.insertedCount > 0)
    })
  })
});

app.listen(process.env.PORT || port)