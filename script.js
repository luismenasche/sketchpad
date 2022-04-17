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
let sqNum, sqSize, squares;
let lastX = -1, lastY = -1;

function buildPad() {
    let i, j, sq, row;
    if (disabled)
        return;
    sqNum = inputSqNum.value;
    squares = [];
    pad.replaceChildren([]);
    pad.style.gridTemplateColumns = `repeat(${sqNum},1fr)`;
    for (i = 0; i < sqNum; i++) {
        row = [];
        for (j = 0; j < sqNum; j++) {
            sq = document.createElement("div");
            sq.classList.add("square");
            sq.setAttribute("data-light","100");
            row.push(sq);
            pad.appendChild(sq);           
        }
        squares.push(row);
    }
    sizeSquares();
}

function sizeSquares() {
    main.style.height = `${window.innerHeight - header.offsetHeight}px`;
    const padSize = 0.98 * Math.min(main.clientHeight, main.clientWidth);
    sqSize = Math.floor(padSize / sqNum);
    for (let sq of pad.children) {
        sq.style.width = `${sqSize}px`;
        sq.style.height = `${sqSize}px`;
    }
    pad.style.width = `${sqNum * sqSize + 6}px`;
    pad.style.height = `${sqNum * sqSize + 6}px`;
}

function paint(ev) {
    let light, x, y, sq;
    if ((!penOn && !eraserOn) || disabled)
        return;
    x = Math.floor(ev.offsetX / sqSize);
    y = Math.floor(ev.offsetY / sqSize);
    console.log(x,y);
    if ((x < 0) || (x >= sqNum) || (y < 0) || (y >= sqNum))
        return;
    if ((x == lastX) && (y == lastY))
        return;
    lastX = x;
    lastY = y;
    sq = squares[y][x];
    if (penOn) {
        light = Number(sq.getAttribute("data-light"));
        if (light >= 10)
            light -= 10;
    }
    else //eraserOn
        light = 100;
    sq.setAttribute("data-light",String(light));
    sq.style.backgroundColor = `hsl(0,0%,${light}%)`;
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

window.addEventListener("resize", sizeSquares);
pad.addEventListener("pointermove", paint);
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