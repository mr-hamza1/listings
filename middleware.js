const Listing = require("./models/listing");
const Review = require("./models/review");
const Expresserror = require("./utils/Expresserror.js");
const reviewSchema = require("./review.js")



module.exports = (req, res, next) => {

    //// orginal redirect url instead of after login going to /listings we directly go where
    ///we are before login console.log(req.originalUrl)
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be login to make changes");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {    /// save redirecturl for new
        res.locals.redirectUrl = req.session.redirectUrl;
        req.session.redirectUrl = null;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);     //// authorization the user is same or not who try to edit or delete
    // console.log(listings);
    if (!listings.owner._id.equals(res.locals.user._id)) {
        req.flash("error","You are not the Owner of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validatelisting = (req, res, next) => {                       // validator middle ware for error handling
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new Expresserror(400, error);
    }
    else {
        next();
    }
}
module.exports.isreviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);     //// authorization the user is same or not who try to  delete review
    if (!review.author.equals(res.locals.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



/// check review is validate
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);  /// the error occur if the object coming is not validate
    console.log(error)

    if (error) {
        throw new Expresserror(400, error);
    }
    else {
        next();
    }

}