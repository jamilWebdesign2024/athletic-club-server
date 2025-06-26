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
        const bookingsCollection = client.db("athleticClub").collection("bookings");


       // ✅ 1. Create New Event
        app.post('/events', async (req, res) => {
            const eventData = req.body;
            const result = await eventsCollection.insertOne(eventData);
            res.send(result);
        });

        // ✅ 2. Get Single Event by ID
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const event = await eventsCollection.findOne(query);
            res.send(event);
        });

        // ✅ 3. Book an Event (with user_email)
        app.post('/bookings', async (req, res) => {
            const bookingData = req.body;
            if (!bookingData?.user_email) {
                return res.status(400).send({ success: false, message: "User email required." });
            }

            const result = await bookingsCollection.insertOne(bookingData);
            res.send({ success: true, insertedId: result.insertedId });
        });

        // Optional: See all bookings
        app.get('/bookings', async (req, res) => {
            const bookings = await bookingsCollection.find().toArray();
            res.send(bookings);
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