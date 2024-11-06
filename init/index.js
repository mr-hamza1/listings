const initdata =require("./data.js");
const mongoose = require("mongoose");
const listing = require("../models/listing.js");

main().then(() => {
    console.log("connect to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(process.env.DB_URL);
}


const initDB = async()=>{
    await listing.deleteMany({});
    // initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '671dedf21451b9cf204d1282' }));
    await listing.insertMany(initdata.data)
    console.log("data was initilized");
}

initDB();