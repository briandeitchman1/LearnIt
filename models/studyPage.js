const mongoose = require('mongoose')
const User = require("./user")

const flashCardSchema = new mongoose.Schema({
    term: String,
    definition: String
})
const multChoiceSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String
})
const studyPageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    subject: String,
    flashCard: [flashCardSchema],
    multChoice: [multChoiceSchema]
})

const StudyPage = mongoose.model('StudyPage', studyPageSchema)
module.exports = StudyPage;
