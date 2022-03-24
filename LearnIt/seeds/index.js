const mongoose = require('mongoose');
const StudyPage = require('../models/studyPage')

main().catch(err => console.log(err));

async function main() {
    StudyPage.deleteMany({})
        .then(() => {
            console.log("data deleted")
        })
        .catch(err => {
            console.log("something went wrong")
            console.log(err)
        })
    await mongoose.connect('mongodb://localhost:27017/test');
    // const newStudyPage = new StudyPage({
    //     flashCard: [{
    //         term: "homeostasis",
    //         definition: "any self-regulating process by which biological systems tend to maintain stability while adjusting to conditions that are optimal for survival."
    //     }]
    //     ,
    //     multChoice: [{
    //         question: "A molecule that increases the pH of a solution is called an acid.",
    //         options: ["true", "false"],
    //         answer: "false"
    //     }]

    // })
    const newStudyPage = new StudyPage({
    })
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

    console.log("new data inserted")
}

