const playground = document.getElementsByClassName("playground");
console.table(playground);

var audio = new Audio('./audio/haunt.mp3');
audio.loop=true;
audio.play();

let gameEnded=false;
let rows = [];
let player1 = document.getElementById('player1');
// let player2 = document.getElementById('player2');
const size = 8;
let player1Info = {
    top: 1, left: 1, name: ''
};
let player2Info = {
    top: size-1, left: size-1, name: ''
};
let isPlayer1Turn = true;


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
    p1=prompt("Enter Player 1 Name");
    player1Info
    p2=prompt("Enter Player 2 Name");

    generateField(size);
    for (let rowNum = 0; rowNum < size; rowNum++) {
        let row = document.createElement("div");
        row.classList.add('row')
        for (let colNum = 0; colNum < size; colNum++) {
            let tile = document.createElement("div");
            tile.classList.add('tile');
            tile.setAttribute('id', rowNum + '-' + colNum);
            tile.addEventListener('click', movePlayer);
            if (rowNum==0 &&colNum==0) {
                tile.classList.add("p1-camp")
            }
            row.appendChild(tile);
        }
        rows.push(row);
        playground[0].appendChild(row);

    }
    document.getElementById('p1').innerText=p1;
    document.getElementById('p2').innerText=p2;
    player1Info.name=p1;
    player2Info.name=p2;
    setUpPlayers() ;
    whoseTurn();
    console.log(rows);
}

createBoard(size);

function whoseTurn() {
    if (isPlayer1Turn) {
        document.getElementById('turn').innerText='Player - '+player1Info.name.toUpperCase()+' Turn'
    }
    else{document.getElementById('turn').innerText='Player - '+player2Info.name.toUpperCase()+' Turn'}
}
function setUpPlayers() {
    player1.style.top = (0) + "rem";
    player1.style.left = (0) + "rem";

    player2.style.top = (player2Info.top * 5.4) + "rem";
    player2.style.left = (player2Info.left * 5.4) + "rem";
}

function movePlayer(event) {
    if (gameEnded) {
        alert("game has ended".toUpperCase());
        restartGame();
    }
    console.log(event);


    tileId = event.target.id;
    let playerInfoTemp=null;
    let player = null;
    if (isPlayer1Turn) {
         playerInfoTemp=player1Info; 
        player = player1;
    }
    else{
         playerInfoTemp=player2Info; 
         player=player2;
    }
    

    playerNewCoodinates = tileId.split("-");
    let move = {
        top: Number(playerNewCoodinates[1]), left: Number(playerNewCoodinates[0])
    }

    if (isValidMove(move,playerInfoTemp)) {
        console.table(Number(playerCurrentLeft), Number(playerNewCoodinates[0])
        );
        if (isPlayer1Turn) {
        player1.style.top = (playerNewCoodinates[1] * 5.4) + "rem";
        player1.style.left = (playerNewCoodinates[0] * 5.4) + "rem";
        player1Info.left = playerNewCoodinates[0];
        player1Info.top = playerNewCoodinates[1];
        
    }

    if (!isPlayer1Turn) {
        player2.style.top = (playerNewCoodinates[1] * 5.4) + "rem";
        player2.style.left = (playerNewCoodinates[0] * 5.4) + "rem";
        player2Info.left = playerNewCoodinates[0];
        player2Info.top = playerNewCoodinates[1];
        
    }
        if (won(move,isPlayer1Turn)) { 
            
            setTimeout(()=>{alert(playerInfoTemp.name+' YOU WON');restartGame()}, 500)
        
        }
        if (check4Mines(move)) {
            
            explodedTile=document.getElementById(tileId);
            explodedTile.classList.add('mine');
            setTimeout(()=>{alert(playerInfoTemp.name+' YOU LOSE');restartGame()}, 500)
            
            
        }
        if (!check4Mines(move)&&!won(move)) {
            isPlayer1Turn=!isPlayer1Turn;
            whoseTurn();
             writeLog(move,playerInfoTemp);
        }
        

    }
    else {
        alert("invalid move");
    }



}

function writeLog(move,pInfo) {
    let log = document.createElement('li');
    log.innerHTML=`<p><strong>`+pInfo.name+`</strong>`+` played :`+move.left+`-`+move.top+`</p>`;

    document.getElementById('logs').appendChild(log);
}
function isValidMove(move,playerInfoTemp) {
    playerCurrentTop = playerInfoTemp.top;
    playerCurrentLeft = playerInfoTemp.left;
    return (
        (Number(playerCurrentLeft) + 1 == Number(move.left)
            || Number(playerCurrentLeft) - 1 == Number(move.left)
        ) || Number(playerCurrentLeft) == Number(move.left))
        && (
            (Number(playerCurrentTop) + 1 == Number(move.top)
                || Number(playerCurrentTop) - 1 == Number(move.top)) || Number(playerCurrentTop) == Number(move.top)
        );

}

function won(move,turn) {
    return (player1Info.left == size - 1 && player1Info.top==size-1) && turn || (player2Info.left == 1-1 && player2Info.top==1-1) && !turn;
}

function check4Mines(move) {
    
    return mineFeild[move.top][move.left];
}

function restartGame() {
    restart=prompt('To RESTART GAME - ENTER Y');
    gameEnded=true;
            if (restart==='Y' || restart==='y' ) {
                location.reload(true);
                gameEnded=false;
            }
}