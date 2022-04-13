const header = document.getElementById("header");
const main = document.getElementById("main");
const pad = document.getElementById("pad");
const inputSqNum = document.getElementById("sqnum");
const message = document.getElementById("message");
const btBuild = document.getElementById("btbuild");
const btClear = document.getElementById("btclear");
let penOn = false;
let sqNum;

function buildPad() {
    let i, j, sq;
    sqNum = inputSqNum.value;
    pad.replaceChildren([]);
    pad.style.gridTemplateColumns = `repeat(${sqNum},1fr)`;
    for (i = 0; i < sqNum; i++) {
        for (j = 0; j < sqNum; j++) {
            sq = document.createElement("div");
            sq.classList.add("square");
            sq.setAttribute("data-light","100");
            sq.addEventListener("mouseover", ev => {
                if (!penOn)
                    return;
                let light = Number(ev.target.getAttribute("data-light"));
                if (light >= 10)
                    light -= 10;
                ev.target.setAttribute("data-light",String(light));
                ev.target.style.backgroundColor = `hsl(0,0%,${light}%)`;
            });
            pad.appendChild(sq);
        }
    }
}

function sizeSquares() {
    main.style.height = `${window.innerHeight - header.offsetHeight}px`;
    const padSize = 0.95 * Math.min(main.clientHeight, main.clientWidth);
    const sqSize = Math.floor(padSize / sqNum);
    for (let sq of pad.children) {
        sq.style.width = `${sqSize}px`;
        sq.style.height = `${sqSize}px`;
    }
    pad.style.width = `${sqNum * sqSize + 6}px`;
    pad.style.height = `${sqNum * sqSize + 6}px`;
}

inputSqNum.value = 16;
buildPad();
sizeSquares();

window.addEventListener("resize", sizeSquares);
pad.addEventListener("click", () => penOn = !penOn);
pad.addEventListener("mouseleave", () => penOn = false);
inputSqNum.addEventListener("input", () => {
    if (!inputSqNum.checkValidity()) {
        btBuild.disabled = true;
        message.textContent = inputSqNum.validationMessage;
    }
    else {
        btBuild.disabled = false;
        message.textContent = "";
    }
});
btBuild.addEventListener("click", buildPad);
btClear.addEventListener("click", () => {
    for (let sq of pad.children) {
        sq.setAttribute("data-light", 100);
        sq.style.backgroundColor = "white";
    }
});