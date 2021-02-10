const express = require("express");
const httpProxy = require("express-http-proxy");
const auth = require("../helpers/auth");
const router = express.Router();

const port = process.env.PORT ? 443 : 5001;

// System Users
router.post("/api/users/system/login/v1", (req, res, next) => {
    setHeadersRR(req, res);
    try {
      if (req.body.deviceInfo){
          globalElkApm.setLabel("deviceInfo_brand", req.body.deviceInfo.brand);
          globalElkApm.setLabel("deviceInfo_buildId", req.body.deviceInfo.buildId);
          globalElkApm.setLabel("deviceInfo_buildNumber", req.body.deviceInfo.buildNumber);
          globalElkApm.setLabel("deviceInfo_deviceId", req.body.deviceInfo.deviceId);
          globalElkApm.setLabel("deviceInfo_manufacturer", req.body.deviceInfo.manufacturer);
          globalElkApm.setLabel("deviceInfo_systemName", req.body.deviceInfo.systemName);
          globalElkApm.setLabel("deviceInfo_systemVersion", req.body.deviceInfo.systemVersion);
          globalElkApm.setLabel("deviceInfo_uniqueID", req.body.deviceInfo.uniqueID);
      }
  } catch (error) {
  }
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).get("/api/users/v1/", auth.checkToken, (req, res, next) => {
    setHeadersRR(req, res);
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).post("/api/users/v1/", (req, res, next) => {// Register
    setHeadersRR(req, res);
    req.headers['Content-Type'] = 'application/json';
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).get("/api/users/v1/:id", auth.checkToken, (req, res, next) => {//get an element
    setHeadersRR(req, res);
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).put("/api/users/v1/:id", auth.checkToken, (req, res, next) => {//edit an element
    setHeadersRR(req, res);
    req.headers["Content-Type"] = "application/json";
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).delete("/api/users/v1/:id", auth.checkToken, (req, res, next) => {//archive an element
    setHeadersRR(req, res);
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).delete("/api/users/delete/v1/:id", auth.checkToken, (req, res, next) => {//delete an element
    setHeadersRR(req, res);
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).get("/api/users/me/v1/", auth.checkToken, (req, res, next) => {//get an element
    setHeadersRR(req, res);
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);

  }).post("/api/users/bytype/v1/", auth.checkToken, (req, res, next) => {//by type
    setHeadersRR(req, res);
    httpProxy(`${domainUser}:${port}${req.path}`)(req, res, next);
  })

module.exports = router;
