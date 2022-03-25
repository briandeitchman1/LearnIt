const mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost:27017/test');

// const flashCardSchema = new mongoose.Schema({
//     front: String,
//     back: String
// })
// const FlashCard = mongoose.model('FlashCard', flashCardSchema);

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
