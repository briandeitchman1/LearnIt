const trueOrFalseBtn = document.getElementById("trueOrFalseBtn");
const multChoiceBtn = document.getElementById("multChoiceBtn");

trueOrFalseBtn.addEventListener('click', makeNewFlashCard);
multChoiceBtn.addEventListener('click', makeNewQuestion);

// lets the elements have different ids
let numFlashCard = 1;
let numMultChoice = 1;

// creates a clone of the first flash card
// and inserts it above the first card
function makeNewFlashCard() {
    let clone = flashCard.cloneNode(true);
    numFlashCard++;
    clone.id = `flashCard${numFlashCard}`
    flashCard.before(clone);
}

function makeNewQuestion() {
    let clone = multChoice.cloneNode(true);
    numMultChoice++;
    clone.id = `multChoice${numMultChoice}`
    multChoice.before(clone);
}