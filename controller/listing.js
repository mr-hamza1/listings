const listing = require("../models/listing.js");
const Expresserror = require("../utils/Expresserror.js");
const listingSchema = require("../schema.js");

const { geocodeLocation } = require("../utils/geocoding.js"); // Import the geocoding function



module.exports.index = async (req, res) => {
    let alllistings = await listing.find();
    res.render("listings/index.ejs", { alllistings })
}


module.exports.newlisting = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showlisting = async(req, res, next) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!list) {
        req.flash("error", "the listing you try to access does not exists");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { list });
}

module.exports.saveNewlisting = async (req, res, next) => {
    let check = listingSchema.validate(req.body);
    if (check.error) {
        throw new Expresserror(400, check.error)
    }
    let newlisting = new listing(req.body.listing);
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "--", filename)
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    const locationName = req.body.listing.location; // Assuming your form has a field for location
        const { lat, lng } = await geocodeLocation(locationName); // Get latitude and longitude
        // Save the geolocation in the geometry field
        newlisting.geometry = {
            type: 'Point',
            coordinates: [lng, lat] // Leaflet expects [longitude, latitude]
    };
    
    await newlisting.save();
    req.flash("success", "new listing is created");
    res.redirect("/listings")
}

module.exports.getupdatelisting = async (req, res, next) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "the listing you try to access does not exists");
        res.redirect("/listings");
    }
    let originalUrl = list.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_200");
    res.render("./listings/edit.ejs", { list,originalUrl});
}

module.exports.updatelisting = async (req, res, next) => {
    if (!req.body.listing) {
        throw new Expresserror(400, "invalid data entry");
    }
    let { id } = req.params;
    if (req.body.listing.location) {
        const locationName = req.body.listing.location;
        try {
            const { lat, lng } = await geocodeLocation(locationName);
            req.body.listing.geometry = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        } catch (error) {
            throw new Expresserror(400, error); // Handle geocoding error
        }
    }
    let list = await listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true })

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = { url, filename };
        await list.save();
   }
    req.flash("success", "listing is updated");
    res.redirect(`/listings/${id}`)
}

module.exports.deletelisting = async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id)
    req.flash("success", "listing is deleted");
    res.redirect("/listings");

}
