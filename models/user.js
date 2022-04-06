const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const StudyPage = require("./studyPage");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    studyPages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyPage'
    }]

})
// adds a field for username and password and methods
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema)
module.exports = User;