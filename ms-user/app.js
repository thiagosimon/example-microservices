/* ###################### BEGIN - DEFAULT SETTINGS ###################### */
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const messageIoasys = require("hp-message-ioasys");

const app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

morgan.token("req-body", function(req, res) {
  let str = JSON.parse(JSON.stringify(req.body));
  if (str.password) {
    str.password = "******";
  }
  return JSON.stringify(str);
});
morgan.token("res-body", function(req, res) {
  return JSON.stringify(res.body);
});
morgan.token("req-params", function(req, res) {
  return JSON.stringify(req.params);
});
app.use(
  morgan(
    'date:"[:date[iso]]" correlation-id:":req[x-correlation-id]" method:":method" url:":url" HTTP/":http-version" status:":status" length:":res[content-length]" referrer:":referrer" user-agent:":user-agent" request-params:":req-params" request-body:":req-body" response-body:":res-body"'
  )
);

/* ###################### GLOBAL DECLARATIONS ###################### */
global.instantiateMessage = messageIoasys.createObjMsg;

/* ###################### SPECIFIC MICROSERVICE SETTINGS ###################### */
const correlator = require("express-correlation-id");
const passport = require("passport");

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());
app.use(correlator());

app.use("/api/users", require("./routes/users"));

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`###############################`);
  console.log(`Server started on port ${port}`);
  console.log(`###############################`);
});
