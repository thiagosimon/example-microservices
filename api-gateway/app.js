const config = require("./config/config");
const correlator = require("express-correlation-id");
const express = require("express");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const messageIoasys = require("hp-message-ioasys");

const app = express();


morgan.token("req-body", function (req, res) {
  let str = "{body: 'empty-body'}";
  try {
    str = JSON.parse(JSON.stringify(req.body));
    if (str.password) {
      str.password = "******";
    }
    return JSON.stringify(str)
  } catch (error) {
    return JSON.stringify(str)
  }
});
morgan.token("req-params", function (req, res) {
  return JSON.stringify(req.params);
});
app.use(
  morgan(
    'date:"[:date[iso]]" correlation-id:":req[x-correlation-id]" method:":method" url:":url" HTTP/":http-version" status:":status" length:":res[content-length]" referrer:":referrer" user-agent:":user-agent" request-params:":req-params" request-body:":req-body"'
  )
);

morganBody(app);

// Add headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-correlation-id"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-correlation-id, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.static("uploads"));
app.use(express.static("public"));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(correlator());


// DOMAINS
global.instantiateMessage = messageIoasys.createObjMsg;
global.domainAPIGateway = config.domainAPIGateway;
global.domainUser = config.domainUser;

//Use Routes
app.use('/', require('./routes/users'));

global.setHeadersRR = (req, res) => {
  req.headers['x-correlation-id'] = req.correlationId();
  res.set('x-correlation-id', req.correlationId());
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`###############################`);
  console.log(`Server started on port ${port}`);
  console.log(`###############################`);
});

