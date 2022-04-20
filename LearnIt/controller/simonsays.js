console.log("yo")
const simon1 = document.getElementById("simon1");
const simon2 = document.getElementById("simon2");
const simon3 = document.getElementById("simon3");
const simon4 = document.getElementById("simon4");
const start = document.getElementById("start")

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
async function startGame() {
    order.push(getRand());
    for (let num of order) {
        await new Promise(r => setTimeout(r, 500));
        await lightUp(num).then((successMessage) => {
            console.log("yay!", successMessage)
        })
    }
}
async function lightUp(num) {
    return new Promise((resolve, reject) => {
        switch (num) {
            case 1:
                simon1.style.backgroundColor = "blue";
                break;
            case 2:
                simon2.style.backgroundColor = "yellow";
                break;
            case 3:
                simon3.style.backgroundColor = "green";
                break;
            case 4:
                simon4.style.backgroundColor = "red";
                break;
        }
        //await new Promise(resolve = setTimeout(resetColor, 500));
        resetColor(500);
        resolve("success");
    })

}
async function resetColor(time) {
    await new Promise(r => setTimeout(r, time));
    simon1.style.backgroundColor = colors[0];
    simon2.style.backgroundColor = colors[1];
    simon3.style.backgroundColor = colors[2];
    simon4.style.backgroundColor = colors[3];
}

simon1.addEventListener("click", () => {
    playerOrder.push(1);
    checkCorrect();
})
simon2.addEventListener("click", () => {
    playerOrder.push(2);
    checkCorrect();
})
simon3.addEventListener("click", () => {
    playerOrder.push(3);
    checkCorrect();
})
simon4.addEventListener("click", () => {
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