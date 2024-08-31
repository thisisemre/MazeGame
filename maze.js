const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');

const ROWS_COUNT = 40;
const COLUMNS_COUNT = 40;

const CELL_SIZE = 20

const maze = [];
const player = {
    x:0,
    y:0,
    size: CELL_SIZE/2+5,
    color:"red",
}

function initMaze(){
    for(let i=0;i<COLUMNS_COUNT;i++){
        maze[i]=[];
        for(let j=0;j<ROWS_COUNT;j++){
            maze[i][j]=1;
        }
    }
    maze[19][18]=0;
    maze[18][19]=0;      
}
function dfs(x, y) {
    maze[x][y] = 0; 

    
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

 
    directions.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        
        if (nx >= 0 && ny >= 0 && nx < ROWS_COUNT && ny < COLUMNS_COUNT && maze[nx][ny] === 1) {
            maze[x + dx][y + dy] = 0; // The door between two cells
            dfs(nx, ny); 
        }
    }
}


function makeRandomMaze(){
    initMaze(); 
    dfs(0, 0);
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
    ctx.fillStyle = "green";
    ctx.fillRect((ROWS_COUNT-2)*CELL_SIZE,(COLUMNS_COUNT-2)*CELL_SIZE,CELL_SIZE,CELL_SIZE)
    
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
    if(player.x === COLUMNS_COUNT-2 && player.y === ROWS_COUNT-2){
        alert("You won!");
        location.reload();
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