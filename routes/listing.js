const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/Expresserror.js")
const listingSchema = require("../schema.js");
const islogdin = require("../middleware.js")
const {isOwner} = require("../middleware.js")
const validatelisting  = require("../middleware.js") 
const saveRedirectUrl = require("../middleware.js") 
const listingcontroller = require("../controller/listing.js")
const multer = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage })


router.post("/search", async(req, res) => {
    let { search } = req.body;
    let alllistings = await listing.find({ country: search });
    res.render("listings/index.ejs", { alllistings })
})


router.route("/")
    .get(wrapAsync(listingcontroller.index))   // main route get
    .post(islogdin,
        validatelisting,
        upload.single('listing[image]'),
        wrapAsync(listingcontroller.saveNewlisting));  /// main route save new listing
    




//add new listings
router.get("/new",islogdin,listingcontroller.newlisting)

router.route("/:id")
    .get(wrapAsync(listingcontroller.showlisting)) ///  show route

    .put(islogdin,
        isOwner,
        upload.single('listing[image]'),
        validatelisting,
        saveRedirectUrl,
        wrapAsync(listingcontroller.updatelisting)) // update route
    
    .delete(islogdin, isOwner, wrapAsync(listingcontroller.deletelisting));/// delete route


/// edit update route
router.get("/:id/new", islogdin,validatelisting, isOwner,wrapAsync(listingcontroller.getupdatelisting))



module.exports = router;

