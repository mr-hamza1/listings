const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {

        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
 
})

module.exports = mongoose.model("review", reviewSchema);

