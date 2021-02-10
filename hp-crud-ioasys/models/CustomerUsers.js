const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CustomerUsersSchema = new Schema({
    dateBirth: {
        type: Date
    },
    gender: {
        type: String
    },
    document: {
        type: String,
    },
    status: {
        type: String,
        require: true
    }
});

mongoose.model('customer-users', CustomerUsersSchema);