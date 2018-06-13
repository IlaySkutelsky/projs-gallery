'use strict'

var BOMB = '💣'
var FLAG = '⛳'

var gBoard
var gLevel

var gIsGameOn = true
var gTimerInterval
var gStartTime

function initGame() {
    var currLevelIdx = localStorage.getItem('levelIdx');
    changeDifficulty(currLevelIdx)

    renderBestTimes()

    gIsGameOn = true

    if (gTimerInterval) {
        clearInterval(gTimerInterval);
        gTimerInterval = null;        
    }

    gBoard = buildBoard()
    renderBoard(gBoard)
    setBombsCounter()
    setSmiley(0)
}

function buildBoard() {
    var bombProbability = gLevel.MINES / gLevel.SIZE ** 2

    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                bombsAroundCount: 0,
                isShown: false,
                isBomb: (Math.random() <= bombProbability) ? true : false,
                isMarked: false
            }
        }
    }
    setMinesNegsCounts(board)
    return board
}

function setMinesNegsCounts(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.isBomb) continue
            else {
                currCell.bombsAroundCount = getMinesNegsCount(board, i, j)
            }
        }
    }
}

function getMinesNegsCount(board, i, j) {
    var counter = 0
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue
            else if (i + x < 0 || i + x > board.length - 1) continue
            else if (j + y < 0 || j + y > board[0].length - 1) continue
            else {
                if (board[i + x][j + y].isBomb) {
                    counter++
                }
            }
        }
    }
    return counter;
}

function renderBoard(board) {
    var elTable = document.querySelector('table');

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellValue
            var cellClass = 'cell-' + i + '-' + j
            if (cell.isShown) {
                cellClass += ' cell-shown'
                if (cell.isBomb) {
                    cellValue = BOMB
                } else if (cell.bombsAroundCount === 0) {
                    cellValue = ' '
                } else {
                    cellValue = cell.bombsAroundCount
                }
            } else {
                if (!gIsGameOn && cell.isBomb) {   // Expose Bombs after losing
                    cellValue = BOMB
                } else if (cell.isMarked) {
                    cellValue = FLAG
                } else {
                    cellValue = ' '
                }
            }
            strHTML += '<td class="' + cellClass + '" '
            strHTML += 'onmousedown ="cellClicked(' + i + ' ,' + j + ' ,event)"> '
            strHTML += cellValue + ' </td>'
        }
        strHTML += '</tr>'
    }
    elTable.innerHTML = strHTML;
}

function cellClicked(i, j, event) {
    if (!gIsGameOn) {
        return
    }
    
    var cell = gBoard[i][j];
    
    // handle all right button clicks
    if (event.button === 2) {
        var bombCounterOffset = -1
        if (cell.isShown) return
        if (cell.isMarked) bombCounterOffset = 1
        cell.isMarked = !cell.isMarked
        var elBombsCounter = document.querySelector('.bombs-counter');
        elBombsCounter.innerText = +elBombsCounter.innerText + bombCounterOffset;
        renderBoard(gBoard);
        return
    }
    
    // handle first click
    if (!gTimerInterval) {
        gStartTime = Date.now();
        gTimerInterval = setInterval(displayTime, 100);
        
        if (cell.isBomb) {
            cell.isBomb = false;
            placeRandBomb()
            setMinesNegsCounts(gBoard)
            renderBoard(gBoard)
        }
    }
    
    cell.isShown = true;
    
    if (cell.isBomb) {
        bombClicked(i, j);
        return    
    }
        
    if (cell.bombsAroundCount === 0) {
        expandShown(i, j)
    }

    renderBoard(gBoard)
    checkGameOver()
}

function expandShown(i, j) {
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue
            else if (i + x < 0 || i + x > gBoard.length - 1) continue
            else if (j + y < 0 || j + y > gBoard.length - 1) continue
            var currCell = gBoard[i + x][j + y]
            if (currCell.isShown) continue
            else {
                currCell.isShown = true;
                if (currCell.bombsAroundCount === 0)
                expandShown(i + x, j + y)
            }
        }
    }
}

function checkGameOver() {
    var isGameOver = true;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isBomb && !cell.isShown) {
                isGameOver = false;
            }
        }
    }

    if (isGameOver) {
        gameOver()
    }
}

function gameOver() {
    var endTime = Date.now()
    clearInterval(gTimerInterval);
    var gameDurr = (endTime - gStartTime) / 1000;
    console.log('You won the game in ' + gameDurr + ' seconds!');
    var currLevelBestTime = localStorage.getItem('bestTime' + gLevel.id)
    if (!currLevelBestTime || gameDurr < currLevelBestTime) {
        localStorage.setItem('bestTime' + gLevel.id, gameDurr)
        console.log('You set the fastest game for this difficulty!');
        renderBestTimes()
    }
    gIsGameOn = false
    setSmiley(1)
}


function changeDifficulty(levelIdx, byUser) {
    var levels = [{ id: 0, SIZE: 4, MINES: 2 },
                  { id: 1, SIZE: 6, MINES: 5 },
                  { id: 2, SIZE: 8, MINES: 15 }
                 ]

    if (!levelIdx) levelIdx = 0
    gLevel = levels[levelIdx]

    if (byUser) {
        localStorage.setItem('levelIdx', levelIdx);
        initGame()
    }
}

function bombClicked(i, j) {
    clearInterval(gTimerInterval);
    console.log('You lost');
    gIsGameOn = false

    renderBoard(gBoard)

    var elCell = document.querySelector('.cell-' + i + '-' + j);
    elCell.classList.add('is-hit');

    setSmiley(2)
}

function renderBestTimes() {
    for (var levelIdx = 0; levelIdx <= 2; levelIdx++) {
        var levelBestTime = localStorage.getItem('bestTime' + levelIdx);
        var elLevelBestTime = document.querySelector('.best-time-' + levelIdx)
        if (levelBestTime) elLevelBestTime.innerText = levelBestTime + ' seconds';
    }
}


function displayTime() {
    var elTimer = document.querySelector('.timer')
    var currTime = Date.now();
    var timeToDisplay = (currTime - gStartTime) / 1000
    elTimer.innerText = timeToDisplay.toFixed(1);
}

function placeRandBomb() {
    var i = getRandomInt(0, gLevel.SIZE);
    var j = getRandomInt(0, gLevel.SIZE);
    var cell = gBoard[i][j]
    if (cell.isBomb) {
        placeRandBomb()
    } else {
        cell.isBomb = true
    }
}

function setBombsCounter() {
    var bombsCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isBomb) bombsCount++
        }
    }

    var elBombsCounter = document.querySelector('.bombs-counter');
    elBombsCounter.innerText = bombsCount;
}

function setSmiley(state) {
    var smileyStates = ['😊', '😎', '💀']

    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smileyStates[state]
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// cancel default right-click menu
window.oncontextmenu = function () {
    return false;
}