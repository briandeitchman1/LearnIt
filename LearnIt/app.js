const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const StudyPage = require("./models/studyPage");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const crypto = require('crypto');

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
app.use('/controller', express.static(path.join(__dirname, 'controller')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const sessionOptions = {
    secret: "foo",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    //views will have access to anything in locals
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    return next();
})


const testData = "I sent this data from my JS file"
app.get('/home', (req, res) => {
    let views
    if (req.session.page_views) {
        views = req.session.page_views++;
    } else {
        req.session.page_views = 1;
        views = 1;
    }
    //sends cookie take this out later
    res.cookie('name', 'Brian')
    res.render('home', { testData, views })
})
app.get('/', (req, res) => {
    res.redirect('/home')
})
app.get("/about", (req, res) => {
    res.render('about')
})
// app.get("/show", async (req, res) => {
//     const data = await StudyPage.find();

//     res.render('show', { data })
//     //res.send(data)
// })
app.get("/new", (req, res) => {
    res.render('new')
})
app.post("/new", async (req, res) => {
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
    await newStudyPage.save();
    console.log(req.body);

    req.flash("success", "Successfully made a new Study page");

    res.redirect("/index")
})
app.get("/study", async (req, res) => {
    const studyPages = await StudyPage.find();
    res.render("index", { studyPages })
})
app.get("/study/:id", async (req, res) => {
    const studyPage = await StudyPage.findById(req.params.id);
    res.render("show", { studyPage });
})


app.listen(port, () => {
    console.log("listening on port 3000")
})