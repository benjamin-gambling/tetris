
/* Selects id = "grid" and assigns it the the variable grid */
const grid = document.querySelector("#grid");
const miniGrid = document.querySelector("#mini-grid");

let resolution = 10;
let width = resolution;
let miniGridBoxes = 16;

let numBoxes = resolution;
let numRows = numBoxes * 2;
let totalBoxes = numBoxes * numRows;

/* When window loads this runs the function to generate the div boxes */
window.onload = generateBoxes();

/* This function runs a for loop to create a number of rows and colums for the game to be player with */
function generateBoxes() {
    let gridRows = [];
    let gridBoxes = [];

    for(let j = 0; j < numRows; j++){
        gridRows[j] = document.createElement('div');
        gridRows[j].classList.add('gridRow');
        
        for(let i = 0; i < numBoxes; i++){
            gridBoxes[i] = document.createElement('div');
            gridBoxes[i].classList.add('gridBox');

            gridRows[j].appendChild(gridBoxes[i]);
        }
    grid.appendChild(gridRows[j]);
    }

    /* Creates divs that are not visible for the taken class */
    for(let i = 0; i < width; i++){
        gridBoxes[i] = document.createElement('div');
        gridBoxes[i].classList.add('taken');
        grid.appendChild(gridBoxes[i]);
    }

    /* Creates Mini-Grid */
    for(let i = 0; i < miniGridBoxes; i++){
        gridBoxes[i] = document.createElement('div');
        miniGrid.appendChild(gridBoxes[i]);
    }
}

/* Collects all the squares in the div and turns then into an array assign to the variabe squares */
let boxes = Array.from(document.querySelectorAll("#grid .gridBox"));
let rows = Array.from(document.querySelectorAll("#grid .gridRow"));
rows[0].id = "top";
let taken = Array.from(document.querySelectorAll("#grid .taken"));
let squares = boxes.concat(taken);
const scoreDisplay = document.querySelector('#score');
const highScoreDisplay = document.querySelector('#high-score');
const lineDisplay = document.querySelector('#line');
const levelDisplay = document.querySelector('#level');
const startBtn = document.querySelector('#start-button');
const finalScoreDisplay = document.querySelector('#finalscore');
const finalTextDisplay = document.querySelector('#finaltext');
let score = 0;
let highscore = Number(localStorage.getItem("highscore"));
highScoreDisplay.innerHTML = highscore;
let line = 0;
let level = 0;
let timerId;
let time  = 500;
let nextRandom = 0; 
const colors = [
    'rgb(3, 65, 174)',
    'rgb(114, 203, 59)',
    'rgb(255, 213, 0)',
    'rgb(255, 151, 28)',
    'rgb(255, 50, 19)'
]

/* The Tetrominos */
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [width * 2, 1, width + 1, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
    [width * 2, width + 1, width * 2 + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width + 1, width * 2 + 1, width + 2],
    [0, width, width + 1, width * 2 + 1]
];

const tTetromino = [
    [width, 1, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 +1],
    [width, width + 1, width + 2, width * 2 +1],
    [width, 1, width + 1, width * 2 + 1]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
let currentPosition = 4
let currentRotation = 0
/* Randomly select a Tetromino [?][?] */
let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]

/* Draws the Tetromino */
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

/* Undraw Tetromino */ 
  function unDraw() {
      current.forEach(index => {
          squares[currentPosition + index].classList.remove('tetromino')
          squares[currentPosition + index].style.backgroundColor = '';

    })
  }

/* Assign functions to KeyCodes */
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}

/* When button is pressed this activates the control function */ 
document.addEventListener('keyup', control);

/* Make the shapes move down at at set time */
function moveDown() {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
}

/* Function to stop the tetromino when it reachs the bottom or comes in contact with another peice */
/* It does this by using some() to check if anyone the squares on the tetrominos is in the div with class="taken" which is not visable */
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        /* Start new peice falling */
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        setTimeout(draw, 500);
        miniShape();
        addScore();
        gameOver();

    }
}

function levelUp(){
    if(score >= 50 && score < 100) {
        time = 400;
        level = 1;
    } else if(score >= 100 && score < 150) {
        time = 300;
        increaseSpeed();
        level = 2; 
    } else if(score >= 150 && score < 200) {
        time = 250;
        increaseSpeed();
        level = 3;
    } else if(score >= 200 && score < 250) {
        time = 200;
        increaseSpeed(); 
        level = 4;
    } else if(score >= 250) {
        time = 150;
        increaseSpeed();
        level = 5;
    }
    levelDisplay.innerHTML = level;
}

/* Moves the tetromino left unless it hits the wall or other tetromino */ 
function moveLeft() {
    unDraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 );
    if(!isAtLeftEdge) currentPosition -= 1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }   
    draw()
}   


/* Moves the tetromino right unless it hits the wall or other tetromino */ 
function moveRight() {
    unDraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if(!isAtRightEdge) currentPosition += 1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1;
    }
    draw();
} 

/* Rotate the tetromino */ 
function rotate() {
    unDraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 );
    if(!isAtLeftEdge && !isAtRightEdge){
    currentRotation++;
    /* if current roroation = 4 (no.5) then we reset to 0 */ 
    if(currentRotation === current.length){
        currentRotation = 0;
        }
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

const miniSquares = document.querySelectorAll("#mini-grid div");
const miniWidth = 4;
const miniIndex = 0; 

const nextTetromino = [
    [1, miniWidth + 1, miniWidth * 2 + 1, 2], // L
    [miniWidth * 2, miniWidth + 1, miniWidth * 2 + 1, miniWidth + 2], // Z
    [miniWidth, 1, miniWidth + 1, miniWidth + 2], // T
    [0, 1, miniWidth, miniWidth + 1], // O
    [1, miniWidth + 1, miniWidth * 2 + 1, miniWidth * 3 + 1] //I
]

function miniShape() {
    /* removes any trace of a tetromino class from the entire mini grid */
    miniSquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = ''
    })
    nextTetromino[nextRandom].forEach(index => {
        miniSquares[miniIndex + index].classList.add('tetromino');
        miniSquares[miniIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

/* Implimant start / pause button */ 
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, time)
        nextRandom;
        miniShape();
    }
    if(startBtn.innerHTML === "PLAY"){
        startBtn.innerHTML = "PAUSE";
        playAudio();
    } else if(startBtn.innerHTML === "PAUSE"){
        startBtn.innerHTML = "PLAY";
        pauseAudio();
    } else if(startBtn.innerHTML === "RESET"){
        startBtn.innerHTML = "PLAY";
        final = document.querySelector(".final");
        final.style.visibility = 'hidden';
        score = 0;
        scoreDisplay.innerHTML = score;
        line = 0;
        lineDisplay.innerHTML = line;
        level = 0;
        levelDisplay.innerHTML = level;
        miniSquares.forEach(square => {
            square.classList.remove('tetromino');
            square.classList.remove("taken");
            square.style.backgroundColor = '';
            square.classList.remove("taken");
        })
        squares.forEach(square => {
            square.classList.remove('tetromino');
            square.classList.remove("taken");
            square.style.backgroundColor = '';
        })
    }
})


function increaseSpeed(){
    clearInterval(timerId);
    timerId = setInterval(moveDown, time);
}

function playAudio(){
    var audio = document.getElementById("soundtrack"); 
    audio.play();
}

function pauseAudio(){
    var audio = document.getElementById("soundtrack");
    audio.pause();
}

/* Display the score */ 
function addScore() {
    for(let i = 0; i < totalBoxes; i+=width) {
        var row = [];
        for(let j = 0; j < width; j++){
            row.push(i + j);
        } 
        
        if(row.every(index => squares[index].classList.contains("taken"))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove("taken");
                squares[index].classList.remove("tetromino");
                squares[index].style.backgroundColor = '';
            })
            levelUp();
            /* Finds the index of the rows array that nees to be moved when full */ 
            removeRow = Math.floor(i/width);
            rows[removeRow].id = "remove";
            setTimeout(moveTop, 200);
        } 
    }
}

/* Function that moves the rows[?] when full to the top to carry on the game */ 
function moveTop() {
    let rowsMoved = 0;
    for(let k = rows.length - 1; k >= 1; k--){
        if(document.getElementById("remove")){
            let top = document.getElementById("top");
            let remove = document.getElementById("remove");
            top.removeAttribute('id');
            remove.id = 'top';
            line += 1;
            rowsMoved += 1;
            lineDisplay.innerHTML = line;
            grid.insertBefore(remove, top);
            boxes = Array.from(document.querySelectorAll("#grid .gridBox"));
            taken = Array.from(document.querySelectorAll("#grid .taken"));
            squares = boxes.concat(taken);
        }
    }
    multipleRows(rowsMoved);
    rows = Array.from(document.querySelectorAll("#grid .gridRow"));
}

function multipleRows(rowsMoved){
    if(rowsMoved == 2){
        score += 5;
    } else if(rowsMoved == 3){
        score += 25
    } else if(rowsMoved == 4){
        score += 50
    }
    scoreDisplay.innerHTML = score;
}

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        clearInterval(timerId)
        final = document.querySelector(".final");
        final.style.visibility = 'visible';
        finalScoreDisplay.innerHTML = score;
        startBtn.innerHTML = "RESET";
        pauseAudio();
        if(highscore !== null){
            if (score > highscore) {
                localStorage.setItem("highscore", score); 
                finalTextDisplay.innerHTML = "NEW HIGH SCORE:";
                highScoreDisplay.innerHTML = highscore;     
            }
        }
        else{
            localStorage.setItem("highscore", score);
        }
    }   
}