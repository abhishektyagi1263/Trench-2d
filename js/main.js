const playground = document.getElementsByClassName("playground");
console.table(playground);

var audio = new Audio('./audio/haunt.mp3');
audio.loop=true;
audio.play();

let gameEnded=false;
let rows = [];
let player1 = document.getElementById('player1');
let player1CurrentCood = {
    top: 1, left: 1
}
const size = 8;
let mineFeild = [];
function mineGenerator() {
    let x = Math.random() * 10;
    return x > 7;
}

function generateField(size) {
    for (let rMap = 0; rMap < size; rMap++) {
        let r = [];
        for (let cMap = 0; cMap < size; cMap++) {
            if (cMap==0 || cMap==size-1) {
                r.push(false)
            }
            else{r.push(mineGenerator())}
        }
        mineFeild.push(r);
        
    }
    console.table(mineFeild);
}


function createBoard(size) {
    generateField(size);
    for (let rowNum = 0; rowNum < size; rowNum++) {
        let row = document.createElement("div");
        row.classList.add('row')
        for (let colNum = 0; colNum < size; colNum++) {
            let tile = document.createElement("div");
            tile.classList.add('tile');
            tile.setAttribute('id', rowNum + '-' + colNum);
            tile.addEventListener('click', movePlayer);

            row.appendChild(tile);
        }
        rows.push(row);
        playground[0].appendChild(row);

    }

    console.log(rows);
}

createBoard(size);
function movePlayer(event) {
    if (gameEnded) {
        alert("game has eneded");
        restartGame();
    }
    console.log(event);


    tileId = event.target.id;

    playerNewCoodinates = tileId.split("-");
    let move = {
        top: Number(playerNewCoodinates[1]), left: Number(playerNewCoodinates[0])
    }

    if (isValidMove(move)) {
        console.table(Number(playerCurrentLeft), Number(playerNewCoodinates[0])
        );

        player1.style.top = (playerNewCoodinates[1] * 6.1) + "rem";
        player1.style.left = (playerNewCoodinates[0] * 6.1) + "rem";
        player1CurrentCood.left = playerNewCoodinates[0];
        player1CurrentCood.top = playerNewCoodinates[1];
        if (won(move)) { 
            
            setTimeout(()=>{alert('YOU WON');restartGame()}, 500)
        
        }
        if (check4Mines(move)) {
            
            explodedTile=document.getElementById(tileId);
            explodedTile.classList.add('mine');
            setTimeout(()=>{alert('YOU LOSE');restartGame()}, 500)
            
            
        }

    }
    else {
        alert("invalid move");
    }



}

function isValidMove(move) {
    playerCurrentTop = player1CurrentCood.top;
    playerCurrentLeft = player1CurrentCood.left;
    return (
        (Number(playerCurrentLeft) + 1 == Number(move.left)
            || Number(playerCurrentLeft) - 1 == Number(move.left)
        ) || Number(playerCurrentLeft) == Number(move.left))
        && (
            (Number(playerCurrentTop) + 1 == Number(move.top)
                || Number(playerCurrentTop) - 1 == Number(move.top)) || Number(playerCurrentTop) == Number(move.top)
        );

}

function won() {
    return player1CurrentCood.left == size - 1 && player1CurrentCood.right==size-1;
}

function check4Mines(move) {
    
    return mineFeild[move.top][move.left];
}

function restartGame() {
    restart=prompt('RESTART GAME');
    gameEnded=true;
            if (restart==='y') {
                location.reload(true);
                gameEnded=false;
            }
}