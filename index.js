const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gwegko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const eventsCollection = client.db("athleticClub").collection("sports");


        app.post('/events', async (req, res) => {
            const eventData = req.body; // <-- এইটা React থেকে আসা ডেটা
            console.log('Received Event:', eventData); // দেখতে পারবেন টার্মিনালে

            const result = await eventsCollection.insertOne(eventData); // MongoDB তে Insert
            res.send(result); // React এ পাঠিয়ে দিন response
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






app.get('/', (req, res) => {
    res.send('Athletic Club organize')
})


app.listen(port, () => {
    console.log(`Athletic Club Server is running on port ${port}`)

})