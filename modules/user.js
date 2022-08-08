const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/egov', { useNewUrlParser: true, useCreateIndex: true });
var con = mongoose.Collection;
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,

        index: {
            unique: true,
        }
    },
    lastname: {
        type: String,


    },
    email: {
        type: String,

        index: {
            unique: true,
        }
    },
    username: {
        type: String,

        index: {
            unique: true,
        }
    },

    branch: {
        type: String,
    },
    password: {
        type: String,
    },
    ten: {
        type: String,


    },
    twelve: {
        type: String,


    },
    no: {
        type: String,


    },




});
var userModel = mongoose.model('users', userSchema);
module.exports = userModel;