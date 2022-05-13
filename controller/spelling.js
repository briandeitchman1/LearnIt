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


let currentWord = data.level1[0];
console.log(currentWord.word);
const synth = window.speechSynthesis;
let voices = [];

window.speechSynthesis.onvoiceschanged = function () {
    voices = window.speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
        console.log("yo")
        let option = document.createElement('option');
        option.textContent = `${voices[i].name} ( ${voices[i].lang})`;
        option.value = i;
        voiceSelect.appendChild(option);
    }
    console.log(voices)
}
newWord.addEventListener("click", () => {
    // maybe add the word to a skipped word list
    getNewWord();
})
// made this a named function so I can call it in two places
function getNewWord() {
    let rand = getRand()
    currentWord = data.level1[rand];
    console.log(currentWord);
}
function getRand() {
    return Math.floor(Math.random() * data.level1.length);

}

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

sayWord.addEventListener("click", () => {
    talk(currentWord.word);
})

sayDef.addEventListener("click", () => {
    talk(currentWord.sentence);
})
function talk(text) {
    let utterWord = new SpeechSynthesisUtterance(text);
    utterWord.voice = voices[voiceSelect.value];
    utterWord.volume = volume.value;
    utterWord.pitch = pitch.value;
    utterWord.rate = rate.value;
    synth.speak(utterWord);
}