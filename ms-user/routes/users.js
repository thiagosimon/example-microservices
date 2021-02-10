const express = require('express');
const passport = require('passport');
const mapType = require("../helpers/map-types");
const crt = require('../controllers/crt-user');

const router = express.Router();

router.get('/v1/', (req, res) => {//List all
    crt.listAll(req, (result) => {
        res.status(result.status).json(result);
    });

}).post('/v1/', (req, res) => {//Register
    crt.saveOrUpdate(false, req, (result) => {
        res.status(result.status).json(result);
    });

}).get('/v1/:email', (req, res) => {//Get
    
    crt.getByEmail(req, (result) => {
        res.status(result.status).json(result);
    });

}).put('/v1/:_id', (req, res) => {//Edit
    if (req.body.companyUser){
        req.body.type = mapType.company;
    }

    crt.saveOrUpdate(true, req, (result) => {
        res.status(result.status).json(result);
    });

}).delete('/delete/v1/:_id', (req, res) => {//Delete
    crt.delete(req, (result) => {
        res.status(result.status).json(result);
    });

}).post('/system/login/v1', (req, res) => {//Log on a user
    crt.login(req, (result) => {
        
        res.status(result.status).json(result);
    });

}).get('/me/v1', (req, res) => {//Get
    crt.getUserLogged(req, (result) => {
        res.status(result.status).json(result);
    });

}).post('/bytype/v1/', (req, res) => {//List all
    crt.listAllByType(req, (result) => {
        res.status(result.status).json(result);
    });
});

module.exports = router;