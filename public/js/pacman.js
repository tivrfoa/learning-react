// SVG namespace for creating SVG elements
const svgNS = "http://www.w3.org/2000/svg";

// Define the maze as a 2D array (1 = wall, 0 = path with dot)
const maze = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];

// Tile size in pixels
const tileSize = 20;

// Create SVG element
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", maze[0].length * tileSize); // 10 * 20 = 200px
svg.setAttribute("height", maze.length * tileSize);   // 10 * 20 = 200px
document.getElementById("container").appendChild(svg);

// Array to keep track of dot elements
let dots = [];

// Draw the maze
for (let i = 0; i < maze.length; i++) {
    dots[i] = [];
    for (let j = 0; j < maze[i].length; j++) {
        if (maze[i][j] === 1) {
            // Draw wall as blue rectangle
            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", j * tileSize);
            rect.setAttribute("y", i * tileSize);
            rect.setAttribute("width", tileSize);
            rect.setAttribute("height", tileSize);
            rect.setAttribute("fill", "blue");
            svg.appendChild(rect);
        } else if (maze[i][j] === 0) {
            // Draw dot as white circle
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

// Create Pacman
let pacmanRow = 1; // Starting row
let pacmanCol = 1; // Starting column
const pacman = document.createElementNS(svgNS, "circle");
pacman.setAttribute("cx", pacmanCol * tileSize + tileSize / 2);
pacman.setAttribute("cy", pacmanRow * tileSize + tileSize / 2);
pacman.setAttribute("r", "8");
pacman.setAttribute("fill", "yellow");
svg.appendChild(pacman);

// Movement variables
let currentDirection = "right";
let intendedDirection = "right";

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
setInterval(() => {
    // Calculate next position based on intended direction
    let nextRow = pacmanRow;
    let nextCol = pacmanCol;
    switch (intendedDirection) {
        case "up": nextRow--; break;
        case "down": nextRow++; break;
        case "left": nextCol--; break;
        case "right": nextCol++; break;
    }

    // Check if Pacman can move in the intended direction
    if (nextRow >= 0 && nextRow < maze.length && nextCol >= 0 && nextCol < maze[0].length && maze[nextRow][nextCol] === 0) {
        currentDirection = intendedDirection;
        pacmanRow = nextRow;
        pacmanCol = nextCol;
    } else {
        // Try moving in the current direction
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

    // Update Pacman's position
    pacman.setAttribute("cx", pacmanCol * tileSize + tileSize / 2);
    pacman.setAttribute("cy", pacmanRow * tileSize + tileSize / 2);

    // Check for dot collision
    if (dots[pacmanRow][pacmanCol]) {
        svg.removeChild(dots[pacmanRow][pacmanCol]);
        dots[pacmanRow][pacmanCol] = null;
        // Here you could increase the score
    }
}, 200); // Update every 200ms