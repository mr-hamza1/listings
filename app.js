// Load environment variables in development mode
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Expresserror = require("./utils/Expresserror.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbURL = process.env.DB_URL;

// Set up view engine to use EJS with ejs-mate for layout support
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Allows PUT and DELETE methods using _method in forms

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/views/public")));

// Configure MongoDB session store
const store = MongoStore.create({
    mongoUrl: dbURL, // MongoDB URL from environment variable
    crypto: {
        secret: "programmer", // Encryption key for session data
    },
    touchAfter: 24 * 3600, // Delay in seconds to avoid frequent updates
});

// Session configuration options
const sessionOptions = {
    store: store, // Use MongoDB store for sessions
    secret: "programmer", // Secret key for session encryption
    resave: false, // Prevents session from being saved back to the store unless modified
    saveUninitialized: true, // Saves new sessions that are unmodified
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
        maxAge: 2 * 24 * 60 * 60 * 1000, // Max age for the cookie (2 days)
        // httpOnly: true, // Uncomment to restrict access to the cookie to HTTP requests only
    }
};

app.use(session(sessionOptions));
app.use(flash()); // Flash messages for success and error alerts

// Passport initialization for session management and user authentication
app.use(passport.initialize());
app.use(passport.session()); // Enables persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // Configures passport to use local strategy for authentication

// Serialize and deserialize user information for session management
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});

async function main() {
    await mongoose.connect(dbURL);
}

// Start the server on port 8080
app.listen("8080", (req, res) => {
    console.log("Server is listening on port 8080");
});

// Middleware to set flash messages and user data in response locals for templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user; // Stores the authenticated user in response locals
    next();
});

// Routing for different parts of the application
app.use("/listings", listingRouter); // Routes for listings
app.use("/listings/:id/review", reviewRouter); // Routes for reviews associated with a listing
app.use("/", userRouter); // Routes for user authentication and profiles

// Error handling middleware for unmatched routes (404 Not Found)
app.all("*", (req, res, next) => {
    next(new Expresserror(404, "Page not found"));
});

// Centralized error handling middleware for custom and general errors
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occurred" } = err;
    res.status(status).render("./listings/error.ejs", { err });
});
