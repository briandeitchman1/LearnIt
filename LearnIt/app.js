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
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn } = require("./middleware");
const ejsMate = require("ejs-mate");

const crypto = require('crypto');

// TODO: change from test to a better name later
mongoose.connect('mongodb://localhost:27017/test')
    .catch(err => {
        console.log("failed to connect to DB")
        console.log(err)
    })


//lets us use ejs with express
app.engine("ejs", ejsMate);
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
    res.locals.currentUser = req.user;
    return next();
})
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
app.get("/new", isLoggedIn, (req, res) => {
    res.render('new')
})
app.post("/new", isLoggedIn, async (req, res) => {
    const { flashCardTerm, flashCardDefinition, multChoiceQuestion, multChoiceOption1, multChoiceOption2, multChoiceOption3, multChoiceOption4, multChoiceAnswer, title, subject } = req.body;
    const newStudyPage = new StudyPage();
    newStudyPage.title = title;
    newStudyPage.subject = subject;
    newStudyPage.owner = req.user._id;

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

    // push onto studyPage array on user model
    const user = await User.findById(req.user._id);
    user.studyPages.push(newStudyPage._id);
    await user.save();
    //
    console.log(req.body);
    console.log(req.user._id);

    req.flash("success", "Successfully made a new Study page");

    res.redirect("/study")
})
app.get("/study", async (req, res) => {
    const studyPages = await StudyPage.find();
    res.render("index", { studyPages })
})
app.get("/study/:id", async (req, res) => {
    const studyPage = await StudyPage.findById(req.params.id).populate('owner');
    console.log(studyPage);
    res.render("show", { studyPage });
})
app.get("/study/:id/edit", isLoggedIn, async (req, res) => {
    const studyPage = await StudyPage.findById(req.params.id);
    res.render("edit", { studyPage });
})
app.put("/study/:id", isLoggedIn, async (req, res) => {
    //res.send("it worked")
    const { id } = req.params
    const { flashCardTerm, flashCardDefinition, multChoiceQuestion, multChoiceOption1, multChoiceOption2, multChoiceOption3, multChoiceOption4, multChoiceAnswer, title, subject } = req.body;
    const studyPage = await StudyPage.findById(id);
    studyPage.title = title;
    studyPage.subject = subject;
    // because the user can create as many flashcards and questions as they want
    // we need to loop through the data and push it into the arrays in the model
    for (let i = 0; i < flashCardTerm.length; i++) {
        studyPage.flashCard.push({
            term: flashCardTerm[i],
            definition: flashCardDefinition[i]
        })
    }
    for (let i = 0; i < multChoiceQuestion.length; i++) {
        // in model options is an array but we get the options from the form in 4 different variables so
        // we need to combine them to work with our model
        let newOptions = [];
        newOptions.push(multChoiceOption1[i], multChoiceOption2[i], multChoiceOption3[i], multChoiceOption4[i])
        studyPage.multChoice.push({
            question: multChoiceQuestion[i],
            options: newOptions,
            answer: multChoiceAnswer[i]
        })
    }
    await studyPage.save();
    console.log(id)

    req.flash("success", "Successfully updated Study page");
    res.redirect(`/study/${id}`)
})

app.get("/study/:id/delete", isLoggedIn, async (req, res) => {
    const studyPage = await StudyPage.findById(req.params.id);
    res.render("delete", { studyPage });
})
app.delete("/study/:id", isLoggedIn, async (req, res) => {
    console.log("yo we at the delete section")
    studyPage = await StudyPage.findByIdAndDelete(req.params.id);
    res.redirect("/study")

})
app.patch("/study/:id", async (req, res) => {
    const { deleteCards, deleteMult } = req.body;
    studyPage = await StudyPage.findById(req.params.id);
    // loops through studypage deleting any matching ids 
    if (deleteCards) {
        await studyPage.updateOne({ $pull: { flashCard: { _id: { $in: deleteCards } } } })
    }
    if (deleteMult) {
        await studyPage.updateOne({ $pull: { multChoice: { _id: { $in: deleteMult } } } })
    }
    console.log(req.body);
    console.log(studyPage);
    req.flash("success", "Successfully updated study page!");
    res.redirect(`/study/${req.params.id}`)
})


app.get("/register", (req, res) => {
    res.render("users/register")
})
app.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser)
        req.flash("success", "welcome to LearnIt");
        res.redirect("/study")
    } catch (err) {
        req.flash("error", err.message);
        res.redirect('register')
    }

})
app.get("/login", (req, res) => {
    res.render("users/login");
})
app.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/study");
})
app.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!")
    res.redirect('/study')
})

app.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id).populate('studyPages');
    res.render("users/profile", { user });
})


app.listen(port, () => {
    console.log("listening on port 3000")
})