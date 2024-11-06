const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const usercontroller = require("../controller/user.js")



router.route("/signup")
    .get(usercontroller.getsignup)

    .post(wrapAsync(usercontroller.signup));




router.route("/login")
    .get(usercontroller.getlogin)

    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), usercontroller.login);


    
router.get("/logout", usercontroller.getlogout)

module.exports = router;