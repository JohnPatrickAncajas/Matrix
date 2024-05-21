document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const currentPositionDiv = document.getElementById("current-position");
    const matrixResultDiv = document.getElementById("matrix-result");
    const matrixSolutionDiv = document.getElementById("matrix-solution");

    const size = 11;
    for (let y = size - 1; y >= 0; y--) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.innerText = `(${x}, ${y})`;
            cell.addEventListener("click", () => teleportRedDot(x, y));
            grid.appendChild(cell);
        }
    }

    let posX = 0;
    let posY = 0;
    updateRedDot();
    updateCurrentPosition();

    function updateRedDot() {
        document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = `(${cell.dataset.x}, ${cell.dataset.y})`);
        const cellIndex = (size - 1 - posY) * size + posX;
        const cell = document.querySelector(`.cell:nth-child(${cellIndex + 1})`);
        const dot = document.createElement("div");
        dot.className = "red-dot";
        cell.appendChild(dot);
    }

    function updateCurrentPosition() {
        currentPositionDiv.innerHTML = `Current Position: [${posX}, ${posY}] (x=${posX}, y=${posY})`;
    }

    window.move = function(direction) {
        if (direction === "up" && posY < size - 1) posY++;
        if (direction === "down" && posY > 0) posY--;
        if (direction === "left" && posX > 0) posX--;
        if (direction === "right" && posX < size - 1) posX++;
        updateRedDot();
        updateCurrentPosition();
    };

    window.teleportRedDot = function(x, y) {
        posX = x;
        posY = y;
        updateRedDot();
        updateCurrentPosition();
    };

    window.applyMatrix = function() {
        const addX = parseInt(document.getElementById("addX").value) || 0;
        const addY = parseInt(document.getElementById("addY").value) || 0;
        const mulX = parseInt(document.getElementById("mulX").value) || 1;
        const mulY = parseInt(document.getElementById("mulY").value) || 1;

        const newX = posX * mulX + addX;
        const newY = posY * mulY + addY;

        matrixSolutionDiv.innerHTML = `
            Matrix Operation:<br>
            [${posX} * ${mulX} + ${addX}, ${posY} * ${mulY} + ${addY}]<br>
            New Position: (${newX}, ${newY})
        `;

        if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
            posX = newX;
            posY = newY;
            matrixResultDiv.innerText = `New Position: [${posX}, ${posY}] (x=${posX}, y=${posY})`;
            updateRedDot();
            updateCurrentPosition();
        } else {
            matrixResultDiv.innerText = `Out of bounds: [${newX}, ${newY}]`;
        }
    };
});
