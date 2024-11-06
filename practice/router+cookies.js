const express = require("express");
const router = express.Router();
const app = express();
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash");
const path = require("path");


// app.use(cookieParser("secretcode"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(session({ secret: "secretcode", resave: false, saveUninitialized: true }));
app.use(flash())


app.listen("3000", () => {
    console.log("server is connected to port 3000");
})

app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name="anonymous"} = req.query;
    req.session.name = name;
    if (name != "anonymous")
        req.flash("success", "user successsfully registered!");
    else {
        req.flash("error", "user does not register!");
    }
    res.redirect(`/hello`);
})

app.get("/hello", (req, res) => {

  
    res.render("hello.ejs",{name : req.session.name});
    // res.render("hello.ejs",{name : req.session.name, msg : req.flash("success")});
})

// app.get("/count", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     }
//     else  req.session.count =1;
//     res.send(`you vist on this ${req.session.count}`);
// })

// app.get("/get", (req, res) => {
//     res.cookie("greet", "hi");
//     res.cookie("web", "site",{signed: true});
//     res.send("whatsup");

// })

// app.get("/", (req, res) => {
//     // let { name = "anonymous" } = req.cookies;
//     // console.log(name);
//     console.log(req.signedCookies);
//     res.send("verify");

// })