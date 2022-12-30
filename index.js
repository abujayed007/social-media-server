const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lugl172.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const postCollection = client.db("socialMedia").collection("postData");
        const userCollection = client.db("socialMedia").collection("user");

        app.get('/posts', async(req, res)=>{
            const query = {}
            const result = await postCollection.find(query).sort({_id: -1}).toArray()
            res.send(result)
        })


        app.get('/posts/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postCollection.findOne(query)
            res.send(result)
        })



        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        
        app.get('/users', async(req, res)=>{
            let query = {}
            if(req.query.email){
                query = {
                  email:  req.query.email
                }
            }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        });

        app.get('/users/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id : ObjectId(id)}
            const result = await userCollection.findOne(query)
            res.send(result)
        });

        app.put('/users/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id : ObjectId(id)}
            const user = req.body
            const option = {upsert:true}
            const updatedDoc = {
                $set:{
                    name:user.name,
                    email:user.email,
                    address:user.address,
                    university:user.university
                }
            }
            console.log(user);
            const result = await userCollection.updateOne(filter,updatedDoc, option)
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.log);


app.get('/', (req, res)=>{
    res.send('Server Running')
})

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`)
})