const playground = document.getElementsByClassName("playground");
console.table(playground);

var audio = new Audio('./audio/haunt.mp3');
audio.loop=true;
audio.play();
let root = document.documentElement;
let gameEnded=false;
let rows = [];
let player1 = document.getElementById('player1');
// let player2 = document.getElementById('player2');
const size = 8;
let player1Info = {
    top: 0, left: 0, name: 'player1',id:'player1'
};
let player2Info = {
    top: size-1, left: size-1, name: 'player2',id:'player2'
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

function getFactor() {
    let screenWidth=window.visualViewport.width;
    const baseWidthPx=1536;
    let screenhigth=window.visualViewport.height;
    const baseheightPx=748;
    let a = screenWidth/8;
    let b = screenhigth/8;
    if (a<b) {
        return a;
    }
    return b;
    let factor=screenWidth/baseWidthPx;
    let fy = screenhigth/baseheightPx;
    
    return factor;
}

function changeTileSize(factor){
     let baseSize = parseFloat(5.3);
     let newSize = Math.ceil(factor)-5;
     root.style.setProperty('--tile',newSize+'px');
     root.style.setProperty('--player',newSize+'px');
     console.log('new width'+newSize);
}

changeTileSize(getFactor())

window.visualViewport.addEventListener('resize',function () {
    changeTileSize(getFactor());
    setUpPlayers() ;
});
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
// getsize();
function whoseTurn() {
    if (isPlayer1Turn) {
        document.getElementById('turn').innerText='Player - '+player1Info.name.toUpperCase()+' Turn'
    }
    else{document.getElementById('turn').innerText='Player - '+player2Info.name.toUpperCase()+' Turn'}
}
function setUpPlayers() {
    let str=root.style.getPropertyValue('--tile');
    var lastFive = str.substring(0,str.length- 2);
    
    player1.style.top = 0.1+(player1Info.top * lastFive) + "px";
    player1.style.left = 0.1+(player1Info.left * lastFive) + "px";
  
    console.log("value:"+lastFive);
    player2.style.top = 0.1+(player2Info.top * lastFive) + "px";
    player2.style.left = 0.1+(player2Info.left * lastFive) + "px";
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
        // player1.style.top = (playerNewCoodinates[1] * 5.4) + "rem";
        // player1.style.left = (playerNewCoodinates[0] * 5.4) + "rem";
        player1Info.left = playerNewCoodinates[0];
        player1Info.top = playerNewCoodinates[1];
        
    }

    if (!isPlayer1Turn) {
        // player2.style.top = (playerNewCoodinates[1] * 5.4) + "rem";
        // player2.style.left = (playerNewCoodinates[0] * 5.4) + "rem";
        player2Info.left = playerNewCoodinates[0];
        player2Info.top = playerNewCoodinates[1];
        
    }
    setUpPlayers();
    writeLog(move,playerInfoTemp);
        if (won(move,isPlayer1Turn)) { 
            
            setTimeout(()=>{alert(playerInfoTemp.name.toUpperCase()+' YOU WON');restartGame()}, 500)
        
        }
        if (check4Mines(move)) {
            setTimeout(()=>{explodedTile=document.getElementById(tileId);
                explodedTile.classList.add('mine');document.getElementById(playerInfoTemp.id).classList.add('player-lose')}, 300)
            
            setTimeout(()=>{alert(playerInfoTemp.name.toUpperCase()+' YOU LOSE');restartGame()}, 1000)
            
            
        }
        if (!check4Mines(move)&&!won(move)) {
            isPlayer1Turn=!isPlayer1Turn;
            whoseTurn();
            
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