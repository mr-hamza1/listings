const user = require("../models/user");



module.exports.getsignup = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        let newuser = new user({ username, email });

        let registeredUser = await user.register(newuser, password);
        req.login(registeredUser, (err) => {   /// login func used to login user after signup
            if (err) {
                next(err);
            }
            req.flash("success", "welcome to wanderlusts");
            res.redirect("/listings");
        })


        console.log(registeredUser);
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}




module.exports.getlogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to wanderlust");


    // let goto = res.locals.redirectUrl ? res.locals.redirectUrl.replace("/review", "") : "/listings"; // Default to "/listings"
    // if (res.locals.redirectUrl == `${goto}/review`) {
    //     res.redirect(goto)  /// they show first log in then goto agian reveiw page and write the review again and send
    // }

    res.redirect(res.locals.redirectUrl || "/listings");
    console.log(res.locals.redirectUrl);

}


module.exports.getlogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}
