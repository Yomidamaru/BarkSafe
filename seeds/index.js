const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Park = require('../models/park');

mongoose.connect('mongodb://localhost:27017/bark-safe');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Park.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const park = new Park({
            author: '67f80470e4fbeef4242a8660',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Description here!!!Blah blah blaah',
            price,
            geometry: { 
                "type" : "Point",
                "coordinates" : [ 
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dmr4nu4a7/image/upload/v1745252980/BarkSafe/ku4eeizgccnztodkovvm.jpg',
                    filename: 'BarkSafe/ku4eeizgccnztodkovvm',
                }
            ],

        })
        await park.save();
    }
}

seedDB();
