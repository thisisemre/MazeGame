const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');

const ROWS_COUNT = 10;
const COLUMNS_COUNT = 10;

const CELL_SIZE = 40

const maze = [];
const player = {
    x:0,
    y:0,
    size: CELL_SIZE/2,
    color:"red",
}

function makeRandomMaze(){
    
    let rows= [];
    
    for(let k=0;k<COLUMNS_COUNT;k++){
        rows = [];
        for(let i=0;i<ROWS_COUNT;i++){
            let random = Math.random();
            if(random<0.5) rows.push(0);
            else rows.push(1);
        }
        maze.push(rows);
    }
    
}
function drawMaze(){
    ctx.fillStyle = "black";
    for(let i=0;i<COLUMNS_COUNT;i++){
        for(let j=0;j<ROWS_COUNT;j++){
            if(maze[i][j]===1){
                ctx.fillRect(j*CELL_SIZE,i*CELL_SIZE,CELL_SIZE,CELL_SIZE)
            }
        }
    }
    
}
function drawPlayer(){
    ctx.beginPath(); 
    ctx.arc(player.x * CELL_SIZE + CELL_SIZE / 2, player.y * CELL_SIZE + CELL_SIZE / 2, player.size / 2, 0, Math.PI * 2); 
    ctx.fillStyle = player.color; 
    ctx.fill(); 
    ctx.closePath(); 
}

function MovePlayer(event){
    const {x:prevX, y:prevY} =player;
    ctx.clearRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    switch (event.key) {
        case "ArrowUp":
            if (player.y > 0) player.y--;
            break;
        case "ArrowDown":
            if (player.y < ROWS_COUNT - 1) player.y++;
            break;
        case "ArrowRight":
            if (player.x < COLUMNS_COUNT - 1) player.x++;
            break;
        case "ArrowLeft":
            if (player.x > 0) player.x--;
            break;
        default:
            break;
    }
    if(maze[player.y][player.x] === 1){
        player.x = prevX;
        player.y = prevY;
        
    }
    
    drawMaze();
    drawPlayer();
}
function init(){
    makeRandomMaze();
    drawMaze()
    drawPlayer();


    document.addEventListener("keydown",MovePlayer);
}
init();