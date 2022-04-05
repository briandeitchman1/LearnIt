const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    studyPages: [String]

})
// adds a field for username and password and methods
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema)
module.exports = User;