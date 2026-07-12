"use strict";


/* ---------------- CHARACTER POSITION ---------------- */

let characterX = 50;
let characterY = 25;


/* ---------------- HTML ELEMENTS ---------------- */

const character =
    document.querySelector("#character");

const libraryDoor =
    document.querySelector("#library-door");

const message =
    document.querySelector("#message");

const enterButton =
    document.querySelector("#enter-button");

const leftButton =
    document.querySelector("#left-button");

const rightButton =
    document.querySelector("#right-button");

const upButton =
    document.querySelector("#up-button");

const previousButton =
    document.querySelector("#previous-button");


/* ---------------- MOVE CHARACTER ---------------- */

function updateCharacterPosition() {
    character.style.left =
        `${characterX}%`;

    character.style.bottom =
        `${characterY}px`;

    checkLibraryDoor();
}


function moveLeft() {
    characterX -= 6;

    if (characterX < 5) {
        characterX = 5;
    }

    updateCharacterPosition();
}


function moveRight() {
    characterX += 6;

    if (characterX > 95) {
        characterX = 95;
    }

    updateCharacterPosition();
}


function moveUp() {
    characterY += 22;

    if (characterY > 180) {
        characterY = 180;
    }

    updateCharacterPosition();
}


/* ---------------- CHECK LIBRARY DOOR ---------------- */

function checkLibraryDoor() {
    const characterArea =
        character.getBoundingClientRect();

    const doorArea =
        libraryDoor.getBoundingClientRect();

    const characterCenterX =
        characterArea.left +
        characterArea.width / 2;

    const characterCenterY =
        characterArea.top +
        characterArea.height / 2;

    const isNearDoor =
        characterCenterX >= doorArea.left - 25 &&
        characterCenterX <= doorArea.right + 25 &&
        characterCenterY >= doorArea.top - 35 &&
        characterCenterY <= doorArea.bottom + 35;

    if (isNearDoor) {
        message.textContent =
            "You reached the library!";

        enterButton.hidden = false;
    } else {
        message.textContent =
            "Use the buttons to walk.";

        enterButton.hidden = true;
    }
}


/* ---------------- ENTER LIBRARY ---------------- */

enterButton.addEventListener(
    "click",
    () => {
        document.querySelector(
            ".game-card"
        ).innerHTML = `
            <h1>📚 Welcome to the Library 📚</h1>

            <p class="instructions">
                Choose a learning activity.
            </p>

            <div class="library-menu">

                <button
                    class="navigation-button"
                    onclick="window.location.href='index.html'">
                    CVC Words
                </button>

                <button
                    class="navigation-button"
                    onclick="window.location.href='vowels.html'">
                    Vowel Listening
                </button>

                <button
                    class="navigation-button"
                    onclick="window.location.href='activity3.html'">
                    First Letters
                </button>

                <button
                    class="navigation-button"
                    onclick="window.location.href='activity4.html'">
                    Number Game
                </button>

            </div>

            <button
                class="navigation-button"
                onclick="window.location.reload()">
                ← Back Outside
            </button>
        `;
    }
);


/* ---------------- BUTTON EVENTS ---------------- */

leftButton.addEventListener(
    "click",
    moveLeft
);

rightButton.addEventListener(
    "click",
    moveRight
);

upButton.addEventListener(
    "click",
    moveUp
);


/* ---------------- KEYBOARD CONTROLS ---------------- */

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "ArrowLeft") {
            moveLeft();
        }

        if (event.key === "ArrowRight") {
            moveRight();
        }

        if (event.key === "ArrowUp") {
            moveUp();
        }

        if (
            event.key === "Enter" &&
            !enterButton.hidden
        ) {
            enterButton.click();
        }
    }
);


/* ---------------- PREVIOUS ACTIVITY ---------------- */

previousButton.addEventListener(
    "click",
    () => {
        window.location.href =
            "activity4.html";
    }
);


/* ---------------- START POSITION ---------------- */

updateCharacterPosition();