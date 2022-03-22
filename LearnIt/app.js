const express = require('express');
const app = express();
const port = 3000;
const path = require("path")

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



app.listen(port, () => {
    console.log("listening on port 3000")
})