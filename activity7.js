const character = document.getElementById("character");

const forwardButton = document.getElementById("forwardButton");
const backwardButton = document.getElementById("backwardButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const arrivalMessage = document.getElementById("arrivalMessage");

let x = 50;
let y = 75;

const step = 4;

let isEnteringBuilding = false;

/*
Building entrance area.

The building is on the upper-left side of the background.

x controls left and right.
y controls forward and backward.

You can adjust these four numbers later if needed.
*/
const buildingArea = {
    minimumX: 5,
    maximumX: 36,
    minimumY: 15,
    maximumY: 48
};

function updateCharacter() {
    character.style.left = `${x}%`;
    character.style.top = `${y}%`;

    checkBuilding();
}

function checkBuilding() {
    const insideBuilding =
        x >= buildingArea.minimumX &&
        x <= buildingArea.maximumX &&
        y >= buildingArea.minimumY &&
        y <= buildingArea.maximumY;

    if (insideBuilding && !isEnteringBuilding) {
        enterBuilding();
    }
}

function enterBuilding() {
    isEnteringBuilding = true;

    arrivalMessage.classList.add("show");

    forwardButton.disabled = true;
    backwardButton.disabled = true;
    leftButton.disabled = true;
    rightButton.disabled = true;

    setTimeout(function () {
        window.location.href = "activity5.html";
    }, 900);
}

function moveForward() {
    if (isEnteringBuilding) return;

    y -= step;

    if (y < 10) {
        y = 10;
    }

    updateCharacter();
}

function moveBackward() {
    if (isEnteringBuilding) return;

    y += step;

    if (y > 90) {
        y = 90;
    }

    updateCharacter();
}

function moveLeft() {
    if (isEnteringBuilding) return;

    x -= step;

    if (x < 5) {
        x = 5;
    }

    character.style.transform =
        "translate(-50%, -50%) scaleX(-1)";

    updateCharacter();
}

function moveRight() {
    if (isEnteringBuilding) return;

    x += step;

    if (x > 95) {
        x = 95;
    }

    character.style.transform =
        "translate(-50%, -50%) scaleX(1)";

    updateCharacter();
}

forwardButton.addEventListener("click", moveForward);
backwardButton.addEventListener("click", moveBackward);
leftButton.addEventListener("click", moveLeft);
rightButton.addEventListener("click", moveRight);

/* Computer keyboard controls */
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        moveForward();
    }

    if (event.key === "ArrowDown") {
        moveBackward();
    }

    if (event.key === "ArrowLeft") {
        moveLeft();
    }

    if (event.key === "ArrowRight") {
        moveRight();
    }
});

updateCharacter();