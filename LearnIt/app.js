if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const StudyPage = require("./models/studyPage");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn, isAuthor } = require("./middleware");
const ejsMate = require("ejs-mate");
const mongoSanitize = require("express-mongo-sanitize");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/test';
const secret = process.env.SECRET || "thisshouldbeabettersecret!";

// This is the production DB
mongoose.connect(dbUrl)
    .catch(err => {
        console.log("failed to connect to DB")
        console.log(err)
    })

//this is the local DB for development

// mongoose.connect('mongodb://localhost:27017/test')
//     .catch(err => {
//         console.log("failed to connect to DB")
//         console.log(err)
//     })

//lets us use ejs with express
app.engine("ejs", ejsMate);
app.set('view engine', 'ejs')

//serves files from the static path /view
app.use('/views', express.static(path.join(__dirname, 'views')))
app.use('/controller', express.static(path.join(__dirname, 'controller')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret,
    }
});

store.on("error", function (e) {
    console.log("Session store error", e)
})

const sessionOptions = {
    store: store,
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(mongoSanitize());
app.use(session(sessionOptions));
app.use(flash());

app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //views will have access to anything in locals
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    return next();
})

app.get('/home', (req, res) => {
    res.redirect('/study')
})
app.get('/', (req, res) => {
    res.redirect('/study')
})
app.get("/about", (req, res) => {
    res.render('about')
})
subjects = ["art", "biology", "chemistry", "english", "math", "nursing", "science", "other"]
app.get("/new", isLoggedIn, (req, res) => {
    res.render('new', { subjects });
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
app.get("/study/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
    const studyPage = await StudyPage.findById(req.params.id);
    res.render("edit", { studyPage, subjects });
})
app.put("/study/:id", isLoggedIn, isAuthor, async (req, res) => {
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

app.get("/study/:id/delete", isLoggedIn, isAuthor, async (req, res) => {
    const studyPage = await StudyPage.findById(req.params.id);
    res.render("delete", { studyPage });
})
app.delete("/study/:id", isLoggedIn, async (req, res) => {
    studyPage = await StudyPage.findByIdAndDelete(req.params.id);
    res.redirect("/study")

})

app.patch("/study/:id", isLoggedIn, isAuthor, async (req, res) => {
    const { deleteCards, deleteMult } = req.body;
    studyPage = await StudyPage.findById(req.params.id);
    // stops anyone but the owner from editing/deleting
    if (!studyPage.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/study/${req.params.id}`);
    }
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
app.post("/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "welcome to LearnIt");
            res.redirect("/study")
        })

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
    const redirectUrl = req.session.returnTo || "/study"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
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
app.get("/spell", (req, res) => {
    res.render("spell")

})
app.get("/simonsays", (req, res) => {
    res.render("simonsays");
})
app.use((req, res) => {
    res.status(404).render("notfound")
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})