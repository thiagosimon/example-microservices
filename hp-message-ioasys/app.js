const express = require('express');
const i18n = require("i18n");

const app = express();

i18n.configure({
    locales: ['en'],
    directory: __dirname + '/config/i18n',
    register: global
});
i18n.setLocale('en');
app.use(i18n.init);

global.msgI18n = i18n.__;

var newModule = {
    getI18nMessager: () => {
        return i18n.__;
    },
    createObjMsg: (status, id) => {
        const obj = {
            status: status,
            messageId: id,
            message: i18n.__(id)
        };
        return obj;
    }
};
module.exports = newModule;