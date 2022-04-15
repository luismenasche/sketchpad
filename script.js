const header = document.getElementById("header");
const main = document.getElementById("main");
const pad = document.getElementById("pad");
const inputSqNum = document.getElementById("sqnum");
const btBuild = document.getElementById("btbuild");
const btPen = document.getElementById("btpen");
const btEraser = document.getElementById("bteraser");
const btClear = document.getElementById("btclear");

let penOn = false, eraserOn = false;
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
                let light;
                if (!penOn && !eraserOn)
                    return;
                else if (penOn) {
                    light = Number(ev.target.getAttribute("data-light"));
                    if (light >= 10)
                        light -= 10;
                }
                else
                    light = 100;
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

function togglePen() {
    penOn = !penOn;
    btPen.classList.toggle("button--on");
    if (btPen.classList.contains("button--on"))
        btPen.textContent = "Pen ON";
    else
        btPen.textContent = "Pen off";
    eraserOn = false;
    btEraser.classList.remove("button--on");
    btEraser.textContent = "Eraser off";
}

function toggleEraser() {
    eraserOn = !eraserOn;
    btEraser.classList.toggle("button--on");
    if (btEraser.classList.contains("button--on"))
        btEraser.textContent = "Eraser ON";
    else
        btEraser.textContent = "Eraser off";
    penOn = false;
    btPen.classList.remove("button--on");
    btPen.textContent = "Pen off";
}

inputSqNum.value = 16;
buildPad();
sizeSquares();

window.addEventListener("resize", sizeSquares);
pad.addEventListener("click", togglePen);
btPen.addEventListener("click", togglePen);
pad.addEventListener("contextmenu", ev => {
    ev.preventDefault();
    toggleEraser();
});
btEraser.addEventListener("click", toggleEraser);
pad.addEventListener("mouseleave", () => {
    penOn = false;
    btPen.classList.remove("button--on");
    btPen.textContent = "Pen off";
    eraserOn = false;
    btEraser.classList.remove("button--on");
    btEraser.textContent = "Eraser off";
});
inputSqNum.addEventListener("input", () => {
    if (!inputSqNum.checkValidity()) {
        btBuild.disabled = true;
        btBuild.textContent = inputSqNum.validationMessage;
    }
    else {
        btBuild.disabled = false;
        btBuild.textContent = "Build";
    }
});
btBuild.addEventListener("click", buildPad);
btClear.addEventListener("click", () => {
    for (let sq of pad.children) {
        sq.setAttribute("data-light", 100);
        sq.style.backgroundColor = "white";
    }
});