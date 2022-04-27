const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const passport = require("passport");
const config = require("./config");
const bodyParser = require("body-parser");
//Loads mongo
var data = require("./data");
const jobRoutes = require("./routes/jobs");
const greetingRoutes = require("./routes/greetings");

const BearerStrategy = require("passport-azure-ad").BearerStrategy;

// this is the API scope you've exposed during app registration
const EXPOSED_SCOPES = ["access_as_user"];

const options = {
  identityMetadata: `https://${process.env.AUTHORITY}/${process.env.TENANT_ID}/${config.metadata.version}/${process.env.DISCOVERY}`,
  issuer: `https://${process.env.AUTHORITY}/${process.env.TENANT_ID}/${config.metadata.version}`,
  clientID: process.env.CLIENT_ID,
  audience: process.env.CLIENT_ID,
  validateIssuer: config.settings.validateIssuer,
  passReqToCallback: config.settings.passReqToCallback,
  loggingLevel: config.settings.loggingLevel,
  loggingNoPII: false,
  scope: EXPOSED_SCOPES,
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Send user info using the second argument
  done(null, {}, token);
});

const app = express();

app.use(morgan("dev"));

let jsonParser = bodyParser.json();

let urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(passport.initialize());

passport.use(bearerStrategy);

// enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(jsonParser);
app.use(urlencodedParser);

var ensureAuthenticated = function (req, res, next) {
  if (passport.authenticate("oauth-bearer", { session: false })) return next();
  else res.status(401);
};

//app.use(passport.authenticate('oauth-bearer', {session: false}));

//Protect all routes within this API
app.use(ensureAuthenticated);

//Setup routes
app.use("/api/jobs", jobRoutes);
app.use("/api/greetings", greetingRoutes);

// API endpoint exposed
app.get(
  "/api",
  //passport.authenticate('oauth-bearer', {session: false}),
  (req, res) => {
    console.log("Validated claims: ", req.authInfo);

    // Service relies on the name claim.
    res.status(200).json({
      name: req.authInfo["name"],
      "issued-by": req.authInfo["iss"],
      "issued-for": req.authInfo["aud"],
      scope: req.authInfo["scp"],
    });
  }
);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
