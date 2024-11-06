const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review  = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        
        url: String,
        filename: String,
        /// this is  we used when we are upload image by link online
        // type: String,
        // default: "https://images.unsplash.com/photo-1508437769842-8fb53c0a6d24?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1508437769842-8fb53c0a6d24?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    description: String,
    country: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    geometry: {
    type: {
        type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
            // required: true
    },
    coordinates: {
        type: [Number],
            // required: true
    },
},

})

listingSchema.post("findOneAndDelete",async(listing) => {

     if(listing){
    await review.deleteMany({_id: {$in:  listing.review}});
     }
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
