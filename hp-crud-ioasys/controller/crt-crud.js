const mongoose = require('mongoose');
const dao = require('../dao/dao-generic');

const crtGeneric = require('./implementations/crt-generic');
const crtSystemUser = require('./implementations/crt-systemUser');

// DB Config
mongoose.set("useCreateIndex", true);
const db = require("../config/database");

mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 10,
    autoIndex: true,
}).then(() => {
  global.isDbConnected = true;
})
.catch((err) => {
  global.isDbConnected = false;
  console.error(err);
});

global.instantiateMessage = require('hp-message-ioasys').createObjMsg;

var newModule = {
    setCollection: (fileName, collectionName, primaryKey, excludedKeys) => {
        dao.setCollection(fileName, collectionName, primaryKey, excludedKeys);
    },
    getDAO: () => {
        return dao;
    },
    generic: crtGeneric.methods,
    systemuser: crtSystemUser.methods,
};

module.exports = newModule;