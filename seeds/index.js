//This is currently set up to seed the production database


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const mongoose = require('mongoose');
const StudyPage = require('../models/studyPage')
// different userIDs for if we want to seed the local or production database
const localUserID = "624c9552352c91ce1930a024";
const deployedUserID = "624d026651dd83505cee38d5";

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/test';

main().catch(err => console.log(err));

subjects = ["art", "biology", "chemistry", "english", "math", "nursing", "science", "other"]

async function main() {
    //await mongoose.connect('mongodb://localhost:27017/test');
    await mongoose.connect(process.env.DB_URL);
    // delete old DB
    await StudyPage.deleteMany({})
        .then(() => {
            console.log("data deleted")
        })
        .catch(err => {
            console.log("something went wrong")
            console.log(err)
        })
    // create 20 new study pages
    for (let i = 0; i < 20; i++) {
        let rand = Math.floor(Math.random() * subjects.length)
        let newStudyPage = new StudyPage({
        })
        newStudyPage.title = `${subjects[rand]} notes`
        //newStudyPage.owner = localUserID;
        newStudyPage.owner = deployedUserID;
        newStudyPage.subject = subjects[rand];
        console.log(subjects[rand])
        // add the default text 5 times
        for (let i = 0; i < 5; i++) {
            newStudyPage.flashCard.push({
                term: "homeostasis",
                definition: "any self-regulating process by which biological systems tend to maintain stability while adjusting to conditions that are optimal for survival."
            });

            newStudyPage.multChoice.push(
                {
                    question: "A molecule that increases the pH of a solution is called an acid.",
                    options: ["true", "false"],
                    answer: "false"
                });
        }
        await newStudyPage.save()
    }

    console.log("new data inserted")
}

