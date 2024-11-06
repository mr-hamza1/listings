const Expresserror = require("../utils/Expresserror.js")
const review = require("../models/review.js");
const reviewSchema = require("../review.js")
const listing = require("../models/listing.js");



module.exports.savingreview = async (req, res, next) => {

    let list = await listing.findById(req.params.id);

    let newreview = new review(req.body.review)
    console.log(newreview)
    newreview.author = req.user._id;

    await newreview.save();
    list.review.push(newreview);

    await list.save();
    console.log("review save!")
    req.flash("success", "review is submitted");

    res.redirect(`/listings/${req.params.id}`);

}


module.exports.deletereview = async (req, res, next) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });   //pull operator used to remove an instance from array which they match or matchs;

    await review.findByIdAndDelete(reviewId);
    req.flash("success", "review is deleted");

    res.redirect(`/listings/${id}`);
}
