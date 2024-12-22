const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


// initialize the environment variables 
dotenv.config();

//initialize the app

const app = express();
const PORT = process.env.PORT;

//middlware to parse the json
app.use(bodyParser.json());


//step 1) mongodb connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("mongodb is connected successfully"))
.catch((error) => console.log("error", error));

// 2) define the schema
const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true}
});

const Item = mongoose.model("Item", itemSchema);

//do the api call
app.get('/api/items', async(req, res) => {
    try {
        const items = await Item.find(); // to get the data
        res.status(200).json(items);

    } catch(error){
        res.status(500).json({error: error.message})
    }
})

// 3) post the new item

app.post("/api/items", async(req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);

    }catch(error){
        res.status(400).json({error: error.message})
    }
})

app.listen(PORT , () => {
    console.log(`server is running at the port number http://localhost:${PORT}`)
})
