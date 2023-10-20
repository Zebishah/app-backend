let mongoose = require('mongoose')
let { Schema } = mongoose;
let userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
})
let user = mongoose.model('user', userSchema);
module.exports = user;