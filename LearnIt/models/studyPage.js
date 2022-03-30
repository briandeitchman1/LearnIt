const mongoose = require('mongoose')


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
    owner: String,
    title: String,
    subject: String,
    flashCard: [flashCardSchema],
    multChoice: [multChoiceSchema]
})

const StudyPage = mongoose.model('StudyPage', studyPageSchema)
module.exports = StudyPage;
