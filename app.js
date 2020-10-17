const expressSession = require("express-session");
const methodOverride = require("method-override");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const flash = require("req-flash");
const User = require("./models/user");
const config = require("./config/config");
const passportStrategy = require("./config/passport");
const indexRoute = require("./routes/index");
const userRoute = require("./routes/user");
const channelRoute = require("./routes/channel");
const adminRoute = require("./routes/admin");
const ajaxRoute = require("./routes/ajax");
const app = express();
const server = http.createServer(app, {secure: true});
const io = socketIO(server);
var cookieParser = require("cookie-parser");
const helmet = require("helmet");

// Configure IO
require("./io/index")(io);
require("string.prototype.safe");

// hi
function checkHttps(req, res, next) {
  // protocol check, if http, redirect to https

  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.all("*", checkHttps);

// Configure app and mongoose
app.use(express.static(__dirname + "/public"));
app.use(helmet());
var cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.set("view engine", "ejs");

//
// Why is this done?
//
// app.get("/2048", (reques
mongoose.Promise = global.Promise;

// boot if db is available
mongoose
  .connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true }) // TODO: Debug why `createIndexes` is not supported on Glitch.
  .then(() => {
    // boot
    server.listen(config.port, () => {
      console.log("listening on " + config.port);
    });
  })
  .catch(dbErr => {
    console.log("DB Connection Error: ", dbErr.message);
    process.exit(1);
  });

// seedDB;

// Passport configuration
app.use(
  expressSession({
    // TODO: Stop using this module.. @ihack2712 will implement tokens at some point in time.
    secret: "a4fw8542071f-c33873-443447-8ee2321",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session()); // TODO: Stop using server sessions. That eats up memory.

// Login Strategy
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    passportStrategy.localSiginStrategy
  )
);

// Sign UP Strategy
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    passportStrategy.localSignupStrategy
  )
);

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    console.log(user.email); // FIXME: Remove this line when bug is fixed.
    done(err, user);
  });
});

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  next();
});

app.get("/suspended", function(req, res) {
   res.render("suspended", { title: "Suspended" });




});

// marmota (gustavosilva-gss on github)
// I'm just going to comment this out and do the routing of admin in its own file
//app.get("/admin", function(req, res) {
//  res.redirect("/");
//  // Hello, Riverside Rocks here
//  // I have the admin page shut off as it is public (very bad!!)
//});





// Routes
app.use("/", indexRoute);
app.use("/users", userRoute);
app.use("/channel", channelRoute);
app.use("/admin", adminRoute);
app.use(ajaxRoute);
app.get("*", function(req, res) {
  res.sendFile(__dirname + '/views/404.html');


});

