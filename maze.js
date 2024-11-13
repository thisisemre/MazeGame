const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');

const ROWS_COUNT = 41;
const COLUMNS_COUNT = 41;

let CELL_SIZE;

const maze = [];
const player = {
    x: 1,
    y: 1,
    color: "red",
};

let moveInterval = null;
const MOVE_DELAY = 100; // Time in milliseconds between moves

function initMaze(){
    // First fill everything with walls
    for(let i = 0; i < COLUMNS_COUNT; i++){
        maze[i] = [];
        for(let j = 0; j < ROWS_COUNT; j++){
            // Set outer edges as walls
            if(i === 0 || i === COLUMNS_COUNT-1 || j === 0 || j === ROWS_COUNT-1) {
                maze[i][j] = 1;
            } else {
                maze[i][j] = 1;
            }
        }
    }
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
            maze[x + dx][y + dy] = 0;
            dfs(nx, ny); 
        }
    }
}

function makeRandomMaze(){
    initMaze(); 
    dfs(1, 1);
    
    // Ensure start and end points are paths
    maze[1][1] = 0; // Start point
    maze[ROWS_COUNT-2][COLUMNS_COUNT-2] = 0; // End point
}

function drawMaze(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the maze cells
    ctx.fillStyle = "black";
    for(let i = 0; i < COLUMNS_COUNT; i++){
        for(let j = 0; j < ROWS_COUNT; j++){
            if(maze[i][j] === 1){
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            }
        }
    }
    
    // Draw the goal
    ctx.fillStyle = "green";
    ctx.fillRect((ROWS_COUNT-2) * CELL_SIZE, (COLUMNS_COUNT-2) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

function drawPlayer(){
    ctx.beginPath(); 
    ctx.arc(
        player.x * CELL_SIZE + CELL_SIZE / 2, 
        player.y * CELL_SIZE + CELL_SIZE / 2, 
        player.size / 2, 
        0, 
        Math.PI * 2
    ); 
    ctx.fillStyle = player.color; 
    ctx.fill(); 
    ctx.closePath(); 
}

function MovePlayer(event){
    const {x: prevX, y: prevY} = player;
    
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

function resizeCanvas() {
    const container = document.querySelector('.maze-container');
    const size = Math.min(container.clientWidth, container.clientHeight);
    
    canvas.width = size;
    canvas.height = size;
    
    CELL_SIZE = size / COLUMNS_COUNT;
    player.size = CELL_SIZE/2 + 5;
    
    drawMaze();
    drawPlayer();
}

function setupTouchControls() {
    const buttons = {
        'up': 'ArrowUp',
        'down': 'ArrowDown',
        'left': 'ArrowLeft',
        'right': 'ArrowRight'
    };

    for (const [buttonId, key] of Object.entries(buttons)) {
        const button = document.getElementById(buttonId);
        
        // Start moving when button is pressed
        const startMoving = (e) => {
            e.preventDefault();
            // Clear any existing interval
            if (moveInterval) clearInterval(moveInterval);
            // Move once immediately
            MovePlayer({ key });
            // Start continuous movement
            moveInterval = setInterval(() => MovePlayer({ key }), MOVE_DELAY);
        };

        // Stop moving when button is released
        const stopMoving = (e) => {
            e.preventDefault();
            if (moveInterval) {
                clearInterval(moveInterval);
                moveInterval = null;
            }
        };
        
        // Touch events
        button.addEventListener('touchstart', startMoving);
        button.addEventListener('touchend', stopMoving);
        button.addEventListener('touchcancel', stopMoving);
        
        // Mouse events
        button.addEventListener('mousedown', startMoving);
        button.addEventListener('mouseup', stopMoving);
        button.addEventListener('mouseleave', stopMoving);
    }
}

function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function init(){
    setVH();
    window.addEventListener('resize', setVH);
    
    makeRandomMaze();
    resizeCanvas();
    
    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener("keydown", MovePlayer);
    setupTouchControls();
}

init();