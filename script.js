const header = document.getElementById("header");
const inputSqNum = document.getElementById("sqnum");
const btBuild = document.getElementById("btbuild");
const btPen = document.getElementById("btpen");
const btEraser = document.getElementById("bteraser");
const btClear = document.getElementById("btclear");
const main = document.getElementById("main");
const pad = document.getElementById("pad");
const message = document.getElementById("message");
const help = document.getElementById("help");
const btHelp = document.getElementById("bthelp");

let penOn = false, eraserOn = false, disabled = false;
let sqNum;

function buildPad() {
    let i, j, sq;
    if (disabled)
        return;
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
                if ((!penOn && !eraserOn) || disabled)
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
    const padSize = 0.98 * Math.min(main.clientHeight, main.clientWidth);
    const sqSize = Math.floor(padSize / sqNum);
    for (let sq of pad.children) {
        sq.style.width = `${sqSize}px`;
        sq.style.height = `${sqSize}px`;
    }
    pad.style.width = `${sqNum * sqSize + 6}px`;
    pad.style.height = `${sqNum * sqSize + 6}px`;
}

function togglePen() {
    if (disabled)
        return;
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
    if (disabled)
        return;
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

function turnOff() {
    penOn = false;
    btPen.textContent = "Pen off";
    btPen.classList.remove("button--on");
    eraserOn = false;
    btEraser.textContent = "Eraser off";
    btEraser.classList.remove("button--on");
}

inputSqNum.value = 16;
buildPad();
sizeSquares();

window.addEventListener("resize", sizeSquares);
main.addEventListener("click", togglePen);
btPen.addEventListener("click", togglePen);
main.addEventListener("contextmenu", ev => {
    ev.preventDefault();
    toggleEraser();
});
btEraser.addEventListener("click", toggleEraser);
inputSqNum.addEventListener("input", () => {
    message.textContent = "";
    if (!inputSqNum.checkValidity()) {
        btBuild.disabled = true;
        message.textContent = inputSqNum.validationMessage;
        turnOff();
        btPen.disabled = true;
        btEraser.disabled = true;
        disabled = true;
    }
    else {
        btPen.disabled = false;
        btEraser.disabled = false;
        disabled = false;
        if (inputSqNum.value == "")
            btBuild.disabled = true;
        else
            btBuild.disabled = false;
    }
});
btBuild.addEventListener("click", buildPad);
btClear.addEventListener("click", () => {
    for (let sq of pad.children) {
        sq.setAttribute("data-light", 100);
        sq.style.backgroundColor = "white";
    }
    turnOff();
});
btHelp.addEventListener("click", ev => {
    ev.stopPropagation();
    btHelp.classList.add("button--on");
    disabled = true;
    inputSqNum.disabled = true;
    help.style.display = "block";
});
help.addEventListener("click", ev => {
    ev.stopPropagation();
    btHelp.classList.remove("button--on");
    disabled = false;
    inputSqNum.disabled = false;
    help.style.display = "none";
});