import data from "./spellingData.json" assert{type: "json"};
const wordInput = document.getElementById("wordInput");
const newWord = document.getElementById("newWord");
const checkWord = document.getElementById("checkWord");
const sayWord = document.getElementById("sayWord");
const sayDef = document.getElementById("sayDef");
const voiceSelect = document.getElementById("voices");
const volume = document.getElementById("volume");
const pitch = document.getElementById("pitch");
const rate = document.getElementById("rate");

// set the first word
let currentWord = data.level1[0];
console.log(currentWord.word);
const synth = window.speechSynthesis;
let voices = [];

// create list of voices and add them to the drop down menu
window.speechSynthesis.onvoiceschanged = function () {
    voices = window.speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
        let option = document.createElement('option');
        option.textContent = `${voices[i].name} ( ${voices[i].lang})`;
        option.value = i;
        voiceSelect.appendChild(option);
    }
    console.log(voices)
}

newWord.addEventListener("click", () => {
    getNewWord();
})
// get a new random word from the list
function getNewWord() {
    let rand = getRand()
    currentWord = data.level1[rand];
    console.log(currentWord);
}
function getRand() {
    return Math.floor(Math.random() * data.level1.length);

}
// check if the user has entered the right word.
// if they did say correct get next word.
// if not say wrong don't change the word.
checkWord.addEventListener("click", () => {
    console.log(wordInput.value);
    console.log(currentWord.word)
    if (wordInput.value === currentWord.word) {
        wordInput.value = "";
        getNewWord();
        talk("Correct!");
        talk(currentWord.word);
    }
    else {
        talk("Wrong!");
    }
})
// says the current word
sayWord.addEventListener("click", () => {
    talk(currentWord.word);
})
// says the def for the word
sayDef.addEventListener("click", () => {
    talk(currentWord.sentence);
})
// says the string in text 
function talk(text) {
    let utterWord = new SpeechSynthesisUtterance(text);
    utterWord.voice = voices[voiceSelect.value];
    utterWord.volume = volume.value;
    utterWord.pitch = pitch.value;
    utterWord.rate = rate.value;
    synth.speak(utterWord);
}