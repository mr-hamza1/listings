const express = require("express");
const router = express.Router({mergeParams:true });
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/Expresserror.js")
const review = require("../models/review.js");
const reviewSchema = require("../review.js")
const listing = require("../models/listing.js");
const islogdin= require("../middleware.js")
const { isreviewAuthor, validatereview } = require("../middleware.js")
const reviewcontroller = require("../controller/review.js");






// reviews start


//  link review with db

router.post("/", validatereview,islogdin,wrapAsync(reviewcontroller.savingreview))

// review rout delete

router.delete("/:reviewId",islogdin,isreviewAuthor, wrapAsync(reviewcontroller.deletereview))


module.exports = router;
