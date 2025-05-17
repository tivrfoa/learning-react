// SVG namespace
const svgNS = "http://www.w3.org/2000/svg";

// Example maze (1 = wall, 0 = path with dot)
const maze = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];

// Tile size in pixels
const tileSize = 20;

// Create SVG canvas
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", maze[0].length * tileSize);
svg.setAttribute("height", maze.length * tileSize);
document.getElementById("container").appendChild(svg);

// Array to track dots
let dots = [];

// Draw the maze and dots
for (let i = 0; i < maze.length; i++) {
    dots[i] = [];
    for (let j = 0; j < maze[i].length; j++) {
        if (maze[i][j] === 1) {
            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", j * tileSize);
            rect.setAttribute("y", i * tileSize);
            rect.setAttribute("width", tileSize);
            rect.setAttribute("height", tileSize);
            rect.setAttribute("fill", "blue");
            svg.appendChild(rect);
        } else if (maze[i][j] === 0) {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", j * tileSize + tileSize / 2);
            circle.setAttribute("cy", i * tileSize + tileSize / 2);
            circle.setAttribute("r", "2");
            circle.setAttribute("fill", "white");
            svg.appendChild(circle);
            dots[i][j] = circle;
        }
    }
}

// Initialize Pacman
let pacmanRow = 1;
let pacmanCol = 1;
const pacman = document.createElementNS(svgNS, "circle");
pacman.setAttribute("cx", pacmanCol * tileSize + tileSize / 2);
pacman.setAttribute("cy", pacmanRow * tileSize + tileSize / 2);
pacman.setAttribute("r", "8");
pacman.setAttribute("fill", "yellow");
svg.appendChild(pacman);

// Movement variables
let currentDirection = "right";
let intendedDirection = "right";

// Score and lives
let score = 0;
let lives = 3;
document.getElementById("score").textContent = "Score: " + score;
document.getElementById("lives").textContent = "Lives: " + lives;

// Game state
let gameState = "playing";

// Movement directions
const directions = [
    { name: "up", row: -1, col: 0 },
    { name: "down", row: 1, col: 0 },
    { name: "left", row: 0, col: -1 },
    { name: "right", row: 0, col: 1 }
];

// Initialize ghosts
const ghosts = [
    { row: 8, col: 8, startRow: 8, startCol: 8, direction: directions[0], color: "red" },
    { row: 1, col: 8, startRow: 1, startCol: 8, direction: directions[1], color: "pink" }
];
ghosts.forEach(ghost => {
    const g = document.createElementNS(svgNS, "circle");
    g.setAttribute("cx", ghost.col * tileSize + tileSize / 2);
    g.setAttribute("cy", ghost.row * tileSize + tileSize / 2);
    g.setAttribute("r", "8");
    g.setAttribute("fill", ghost.color);
    svg.appendChild(g);
    ghost.element = g;
});

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp": intendedDirection = "up"; break;
        case "ArrowDown": intendedDirection = "down"; break;
        case "ArrowLeft": intendedDirection = "left"; break;
        case "ArrowRight": intendedDirection = "right"; break;
    }
});

// Game loop
const gameInterval = setInterval(() => {
    if (gameState !== "playing") return;

    // Move Pacman
    let nextRow = pacmanRow;
    let nextCol = pacmanCol;
    switch (intendedDirection) {
        case "up": nextRow--; break;
        case "down": nextRow++; break;
        case "left": nextCol--; break;
        case "right": nextCol++; break;
    }
    if (nextRow >= 0 && nextRow < maze.length && nextCol >= 0 && nextCol < maze[0].length && maze[nextRow][nextCol] === 0) {
        currentDirection = intendedDirection;
        pacmanRow = nextRow;
        pacmanCol = nextCol;
    } else {
        nextRow = pacmanRow;
        nextCol = pacmanCol;
        switch (currentDirection) {
            case "up": nextRow--; break;
            case "down": nextRow++; break;
            case "left": nextCol--; break;
            case "right": nextCol++; break;
        }
        if (nextRow >= 0 && nextRow < maze.length && nextCol >= 0 && nextCol < maze[0].length && maze[nextRow][nextCol] === 0) {
            pacmanRow = nextRow;
            pacmanCol = nextCol;
        }
    }
    pacman.setAttribute("cx", pacmanCol * tileSize + tileSize / 2);
    pacman.setAttribute("cy", pacmanRow * tileSize + tileSize / 2);

    // Eat dots and update score
    if (dots[pacmanRow][pacmanCol]) {
        svg.removeChild(dots[pacmanRow][pacmanCol]);
        dots[pacmanRow][pacmanCol] = null;
        score += 10;
        document.getElementById("score").textContent = "Score: " + score;
    }

    // Move ghosts
    ghosts.forEach(ghost => {
        let nextGhostRow = ghost.row + ghost.direction.row;
        let nextGhostCol = ghost.col + ghost.direction.col;
        if (nextGhostRow >= 0 && nextGhostRow < maze.length && nextGhostCol >= 0 && nextGhostCol < maze[0].length && maze[nextGhostRow][nextGhostCol] === 0) {
            ghost.row = nextGhostRow;
            ghost.col = nextGhostCol;
        } else {
            const possibleDirections = directions.filter(dir => {
                const r = ghost.row + dir.row;
                const c = ghost.col + dir.col;
                return r >= 0 && r < maze.length && c >= 0 && c < maze[0].length && maze[r][c] === 0;
            });
            if (possibleDirections.length > 0) {
                ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                ghost.row += ghost.direction.row;
                ghost.col += ghost.direction.col;
            }
        }
        ghost.element.setAttribute("cx", ghost.col * tileSize + tileSize / 2);
        ghost.element.setAttribute("cy", ghost.row * tileSize + tileSize / 2);
    });

    // Check collisions with ghosts
    ghosts.forEach(ghost => {
        if (pacmanRow === ghost.row && pacmanCol === ghost.col) {
            lives--;
            document.getElementById("lives").textContent = "Lives: " + lives;
            if (lives <= 0) {
                gameState = "over";
                clearInterval(gameInterval);
                alert("Game Over! Final Score: " + score);
            } else {
                // Reset positions
                pacmanRow = 1;
                pacmanCol = 1;
                ghosts.forEach(g => {
                    g.row = g.startRow;
                    g.col = g.startCol;
                    g.direction = directions[0];
                });
                pacman.setAttribute("cx", pacmanCol * tileSize + tileSize / 2);
                pacman.setAttribute("cy", pacmanRow * tileSize + tileSize / 2);
                ghosts.forEach(g => {
                    g.element.setAttribute("cx", g.col * tileSize + tileSize / 2);
                    g.element.setAttribute("cy", g.row * tileSize + tileSize / 2);
                });
            }
        }
    });
}, 200);