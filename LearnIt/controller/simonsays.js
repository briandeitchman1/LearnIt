console.log("yo")
const simon1 = document.getElementById("simon1");
const simon2 = document.getElementById("simon2");
const simon3 = document.getElementById("simon3");
const simon4 = document.getElementById("simon4");
const start = document.getElementById("start");
const volume = document.getElementById("volume");
const restart = document.getElementById("restart");




let sounds = [];
sounds.push(new Audio("../sounds/tone1.wav"));
sounds.push(new Audio("../sounds/tone2.wav"));
sounds.push(new Audio("../sounds/tone3.wav"));
sounds.push(new Audio("../sounds/tone5.wav"));



let colors = [];
colors.push(simon1.style.backgroundColor);
colors.push(simon2.style.backgroundColor);
colors.push(simon3.style.backgroundColor);
colors.push(simon4.style.backgroundColor);


let order = [];
let playerOrder = [];
// used to pick the next color 
function getRand() {
    return (Math.floor(Math.random() * 4) + 1);

}
start.addEventListener("click", () => {
    startGame();
})
restart.addEventListener("click", () => {
    order = [];
    playerOrder = [];
    startGame();
})
volume.addEventListener("change", () => {
    for (let sound of sounds) {
        sound.volume = volume.value;
    }
})
async function startGame() {
    order.push(getRand());
    for (let num of order) {
        await new Promise(r => setTimeout(r, 500));
        await lightUp(num).then((successMessage) => {
            console.log("yay!", successMessage)
        })
    }
}
function resetSounds() {
    for (let sound of sounds) {
        sound.pause();
        sound.currentTime = 0;
    }
}
async function lightUp(num) {
    await new Promise(r => setTimeout(r, 500));
    resetSounds();
    switch (num) {
        case 1:
            sounds[0].play();
            simon1.style.backgroundColor = "blue";
            break;
        case 2:
            sounds[1].play();
            simon2.style.backgroundColor = "yellow";
            break;
        case 3:
            sounds[2].play();
            simon3.style.backgroundColor = "green";
            break;
        case 4:
            sounds[3].play();
            simon4.style.backgroundColor = "red";
            break;
    }
    resetColor(500);

}
async function resetColor(time) {
    await new Promise(r => setTimeout(r, time));
    simon1.style.backgroundColor = colors[0];
    simon2.style.backgroundColor = colors[1];
    simon3.style.backgroundColor = colors[2];
    simon4.style.backgroundColor = colors[3];
}

simon1.addEventListener("click", () => {
    sounds[0].play();
    playerOrder.push(1);
    checkCorrect();
})
simon2.addEventListener("click", () => {
    sounds[1].play();
    playerOrder.push(2);
    checkCorrect();
})
simon3.addEventListener("click", () => {
    sounds[2].play();
    playerOrder.push(3);
    checkCorrect();
})
simon4.addEventListener("click", () => {
    sounds[3].play();
    playerOrder.push(4);
    checkCorrect();
})

simon1.addEventListener("mouseover", () => {
    simon1.style.backgroundColor = "blue";

})
simon1.addEventListener("mouseout", () => {
    simon1.style.backgroundColor = colors[0];
})
simon2.addEventListener("mouseover", () => {
    simon2.style.backgroundColor = "yellow";

})
simon2.addEventListener("mouseout", () => {
    simon2.style.backgroundColor = colors[1];
})
simon3.addEventListener("mouseover", () => {
    simon3.style.backgroundColor = "green";

})
simon3.addEventListener("mouseout", () => {
    simon3.style.backgroundColor = colors[2];
})
simon4.addEventListener("mouseover", () => {
    simon4.style.backgroundColor = "red";

})
simon4.addEventListener("mouseout", () => {
    simon4.style.backgroundColor = colors[3];
})

function checkCorrect() {
    for (let i = 0; i < playerOrder.length; i++) {
        if (playerOrder[i] !== order[i]) {
            flashBlack()
            resetColor(400);
            flashBlack();
            resetColor(400);
            playerOrder = [];
            return;
        }
    }
    if (playerOrder.length === order.length) {
        flashGreen();
        resetColor(400);
        playerOrder = [];
        startGame();
    }
}
function flashGreen() {
    simon1.style.backgroundColor = "green";
    simon2.style.backgroundColor = "green";
    simon3.style.backgroundColor = "green";
    simon4.style.backgroundColor = "green";
}

function flashBlack() {
    simon1.style.backgroundColor = "black";
    simon2.style.backgroundColor = "black";
    simon3.style.backgroundColor = "black";
    simon4.style.backgroundColor = "black";
}