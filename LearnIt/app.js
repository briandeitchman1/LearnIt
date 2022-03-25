const express = require('express');
const app = express();
const port = 3000;
const path = require("path")
const mongoose = require("mongoose")
const StudyPage = require("./models/studyPage")

// 
// TODO: change from test to a better name later
mongoose.connect('mongodb://localhost:27017/test')
    .catch(err => {
        console.log("failed to connect to DB")
        console.log(err)
    })


//lets us use ejs with express
app.set('view engine', 'ejs')

//serves files from the static path /view
app.use('/views', express.static(path.join(__dirname, 'views')))
app.use(express.urlencoded());

const testData = "I sent this data from my JS file"
app.get('/', (req, res) => {
    res.render('home', { testData })
})
app.get('/home', (req, res) => {
    res.render('home', { testData })
})
app.get("/about", (req, res) => {
    res.render('about')
})
app.get("/show", async (req, res) => {
    const data = await StudyPage.find();

    res.render('show', { data })
    //res.send(data)
})
app.get("/new", (req, res) => {
    res.render('new')
})
app.post("/new", (req, res) => {
    const { flashCardTerm, flashCardDefinition, multChoiceQuestion, multChoiceOption1, multChoiceOption2, multChoiceOption3, multChoiceOption4, multChoiceAnswer, title, subject } = req.body;
    const newStudyPage = new StudyPage();
    newStudyPage.title = title;
    newStudyPage.subject = subject;
    //newStudyPage.owner = owner

    // because the user can create as many flashcards and questions as they want
    // we need to loop through the data and push it into the arrays in the model
    for (let i = 0; i < flashCardTerm.length; i++) {
        newStudyPage.flashCard.push({
            term: flashCardTerm[i],
            definition: flashCardDefinition[i]
        })
    }
    for (let i = 0; i < multChoiceQuestion.length; i++) {
        // in model options is an array but we get the options from the form in 4 different variables so
        // we need to combine them to work with our model
        let newOptions = [];
        newOptions.push(multChoiceOption1[i], multChoiceOption2[i], multChoiceOption3[i], multChoiceOption4[i])
        newStudyPage.multChoice.push({
            question: multChoiceQuestion[i],
            options: newOptions,
            answer: multChoiceAnswer[i]
        })

    }
    newStudyPage.save();
    console.log(req.body);
    res.redirect("/new")
})
app.listen(port, () => {
    console.log("listening on port 3000")
})