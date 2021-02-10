const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const SystemUserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        require: false
    },
    primaryPhone: {
        type: String,
        require: false
    },
    type: {
        type: String,
        require: true
    },
    customerUser: {
        type: Schema.Types.ObjectId,
        ref:'customer-users',
        required: false
    },
    companyUser: {
        type: Schema.Types.ObjectId,
        ref:'company-users',
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        require: true
    }
});

mongoose.model('system-users', SystemUserSchema);