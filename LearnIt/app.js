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


app.listen(port, () => {
    console.log("listening on port 3000")
})