document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const currentPositionDiv = document.getElementById("current-position");
    const matrixResultDiv = document.getElementById("matrix-result");
    const matrixSolutionDiv = document.getElementById("matrix-solution");
    const showCoordinates = document.getElementById("show-coordinates");

    let transparent = false;

    const size = 16;
    const negativeOffset = 7;
    const positiveOffset = 8;

    for (let y = positiveOffset; y >= -negativeOffset; y--) {
        for (let x = -negativeOffset; x <= positiveOffset; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener("click", () => teleportRedDot(x, y));
            grid.appendChild(cell);
        }
    }

    let posX = 0;
    let posY = 0;
    updateRedDot();
    updateCurrentPosition();

    function updateRedDot() {
        document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = ``);
        const cellIndex = (positiveOffset - posY) * size + (posX + negativeOffset);
        const cell = document.querySelector(`.cell:nth-child(${cellIndex + 1})`);
        const dot = document.createElement("div");
        dot.className = "red-dot";
        cell.appendChild(dot);
        transparent = false;
    }

    function updateCurrentPosition() {
        currentPositionDiv.innerHTML = `Current Position: [${posX} ${posY}]`;
        matrixResultDiv.innerText = '';
    }

    showCoordinates.addEventListener("click", () => {
        const cells = document.querySelectorAll(".cell");
        if (!transparent) {
            cells.forEach(cell => cell.innerHTML = `[${cell.dataset.x} ${cell.dataset.y}]`);
            transparent = true;
        } else {
            updateRedDot();
            transparent = false;
        }
    });

    window.move = function(direction) {
        const oldX = posX;
        const oldY = posY;
        
        if (direction === "up" && posY < positiveOffset) posY++;
        if (direction === "down" && posY > -negativeOffset) posY--;
        if (direction === "left" && posX > -negativeOffset) posX--;
        if (direction === "right" && posX < positiveOffset) posX++;
        
        updateRedDot();
        updateCurrentPosition();
        calculateDifference(oldX, oldY, posX, posY);
    };

    window.teleportRedDot = function(x, y) {
        const oldX = posX;
        const oldY = posY;
        posX = x;
        posY = y;
        updateRedDot();
        updateCurrentPosition();
        calculateDifference(oldX, oldY, posX, posY);
    };

    function calculateDifference(oldX, oldY, newX, newY) {
        matrixSolutionDiv.innerHTML = '';
        const diffX = newX - oldX;
        const diffY = newY - oldY;
        matrixSolutionDiv.innerHTML = `
            Difference Calculation:<br>
            Old Position: [${oldX} ${oldY}]<br>
            New Position: [${newX} ${newY}]<br>
            Difference: [${diffX} ${diffY}]
        `;
    }

    window.applyMatrix = function() {
        matrixSolutionDiv.innerHTML = '';
        matrixResultDiv.innerText = '';

        const addX = parseInt(document.getElementById("addX").value) || 0;
        const addY = parseInt(document.getElementById("addY").value) || 0;

        let newX = posX + addX;
        let newY = posY + addY;
        let operationDesc = `[${posX} ${posY}] + [${addX} ${addY}]`;

        matrixSolutionDiv.innerHTML = `
            Matrix Operation:<br>
            ${operationDesc}<br>
            New Position: [${newX} ${newY}]
        `;

        if (newX >= -negativeOffset && newX <= positiveOffset && newY >= -negativeOffset && newY <= positiveOffset) {
            posX = newX;
            posY = newY;
            matrixResultDiv.innerText = `New Position: [${posX} ${posY}]`;
            updateRedDot();
            updateCurrentPosition();
        } else {
            matrixResultDiv.innerText = `Out of bounds: [${newX} ${newY}]`;
        }
    };

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                move("up");
                break;
            case "ArrowDown":
            case "s":
            case "S":
                move("down");
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                move("left");
                break;
            case "ArrowRight":
            case "d":
            case "D":
                move("right");
                break;
        }
    });
});
