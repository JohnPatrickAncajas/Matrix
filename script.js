document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const currentPositionDiv = document.getElementById("current-position");
    const matrixResultDiv = document.getElementById("matrix-result");
    const matrixSolutionDiv = document.getElementById("matrix-solution");
    const showCoordinates = document.getElementById("show-coordinates");

    let transparent = false;

    const size = 21;
    const offset = 10;

    for (let y = 10; y >= -10; y--) {
        for (let x = -10; x <= 10; x++) {
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
        const cellIndex = (offset - posY) * size + (posX + offset);
        const cell = document.querySelector(`.cell:nth-child(${cellIndex + 1})`);
        const dot = document.createElement("div");
        dot.className = "red-dot";
        cell.appendChild(dot);
        transparent = false;
    }

    function updateCurrentPosition() {
        currentPositionDiv.innerHTML = `Current Position: [${posX} ${posY}] (x = ${posX}, y = ${posY})`;
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
        
        if (direction === "up" && posY < offset) posY++;
        if (direction === "down" && posY > -offset) posY--;
        if (direction === "left" && posX > -offset) posX--;
        if (direction === "right" && posX < offset) posX++;
        
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
        const mulX = document.getElementById("mulX").value ? parseInt(document.getElementById("mulX").value) : null;
        const mulY = document.getElementById("mulY").value ? parseInt(document.getElementById("mulY").value) : null;

        let newX = posX;
        let newY = posY;
        let operationDesc = '';

        if (mulX !== null || mulY !== null) {
            if (mulX !== null) {
                newX *= mulX;
                operationDesc += `[${posX} x ${mulX}] `;
            }
            if (mulY !== null) {
                newY *= mulY;
                operationDesc += `[${posY} x ${mulY}] `;
            }
        }

        if (addX !== 0 || addY !== 0) {
            newX += addX;
            newY += addY;
            if (operationDesc) {
                operationDesc += `+ [${addX} ${addY}]`;
            } else {
                operationDesc = `[(${posX} + ${addX}) (${posY} + ${addY})]`;
            }
        }

        if (!operationDesc) {
            operationDesc = `[${posX} ${posY}]`;
        }

        matrixSolutionDiv.innerHTML = `
            Matrix Operation:<br>
            ${operationDesc}<br>
            New Position: [${newX} ${newY}]
        `;

        if (newX >= -offset && newX <= offset && newY >= -offset && newY <= offset) {
            posX = newX;
            posY = newY;
            matrixResultDiv.innerText = `New Position: [${posX} ${posY}] (x = ${posX}, y = ${posY})`;
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
