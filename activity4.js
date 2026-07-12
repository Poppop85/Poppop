"use strict";


/* ---------------- GAME NUMBERS ---------------- */

const gameNumbers = [
    1, 2, 3, 4, 5,
    6, 7, 8, 9, 10
];

const numberWords = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten"
};


/* ---------------- GAME VARIABLES ---------------- */

let currentQuestion = 0;
let score = 0;
let correctNumber = 1;
let answered = false;


/* ---------------- HTML ELEMENTS ---------------- */

const scoreElement =
    document.querySelector("#score");

const questionNumberElement =
    document.querySelector("#question-number");

const totalQuestionsElement =
    document.querySelector("#total-questions");

const feedbackElement =
    document.querySelector("#feedback");

const soundButton =
    document.querySelector("#sound-button");

const basketball =
    document.querySelector("#basketball");

const previousButton =
    document.querySelector("#previousButton");

const gameCard =
    document.querySelector(".game-card");

const hoops =
    document.querySelectorAll(".hoop");


/* ---------------- START GAME ---------------- */

totalQuestionsElement.textContent =
    gameNumbers.length;

showQuestion();


/* ---------------- SHOW QUESTION ---------------- */

function showQuestion() {
    answered = false;

    correctNumber =
        gameNumbers[currentQuestion];

    questionNumberElement.textContent =
        currentQuestion + 1;

    feedbackElement.textContent =
        "Listen and drag the basketball.";

    feedbackElement.className =
        "feedback";

    basketball.style.visibility =
        "visible";

    basketball.style.opacity =
        "1";

    basketball.draggable = true;

    createNumberChoices(correctNumber);

    resetHoops();

    setTimeout(() => {
        speakNumber(correctNumber);
    }, 500);
}


/* ---------------- CREATE NUMBER CHOICES ---------------- */

function createNumberChoices(answer) {
    const choices = [answer];

    while (choices.length < 3) {
        const randomNumber =
            Math.floor(Math.random() * 10) + 1;

        if (!choices.includes(randomNumber)) {
            choices.push(randomNumber);
        }
    }

    shuffleArray(choices);

    hoops.forEach((hoop, index) => {
        const numberElement =
            hoop.querySelector(".number");

        const number =
            choices[index];

        numberElement.textContent =
            number;

        hoop.dataset.number =
            number;
    });
}


/* ---------------- COMPUTER DRAGGING ---------------- */

basketball.addEventListener(
    "dragstart",
    (event) => {
        if (answered) {
            event.preventDefault();
            return;
        }

        event.dataTransfer.setData(
            "text/plain",
            "basketball"
        );

        basketball.style.opacity =
            "0.5";
    }
);

basketball.addEventListener(
    "dragend",
    () => {
        basketball.style.opacity =
            "1";
    }
);

hoops.forEach((hoop) => {

    hoop.addEventListener(
        "dragover",
        (event) => {
            event.preventDefault();

            if (!answered) {
                hoop.style.transform =
                    "scale(1.08)";

                hoop.style.borderColor =
                    "#8b5cf6";

                hoop.style.background =
                    "#f3e8ff";
            }
        }
    );

    hoop.addEventListener(
        "dragleave",
        () => {
            if (!answered) {
                resetSingleHoop(hoop);
            }
        }
    );

    hoop.addEventListener(
        "drop",
        (event) => {
            event.preventDefault();

            if (answered) {
                return;
            }

            const selectedNumber =
                Number(hoop.dataset.number);

            checkAnswer(
                selectedNumber,
                hoop
            );
        }
    );

    hoop.addEventListener(
        "click",
        () => {
            if (answered) {
                return;
            }

            const selectedNumber =
                Number(hoop.dataset.number);

            checkAnswer(
                selectedNumber,
                hoop
            );
        }
    );
});


/* ---------------- PHONE TOUCH DRAGGING ---------------- */

let floatingBall = null;

basketball.addEventListener(
    "touchstart",
    (event) => {
        if (answered) {
            return;
        }

        event.preventDefault();

        const touch =
            event.touches[0];

        floatingBall =
            basketball.cloneNode(true);

        floatingBall.style.position =
            "fixed";

        floatingBall.style.zIndex =
            "1000";

        floatingBall.style.fontSize =
            "75px";

        floatingBall.style.pointerEvents =
            "none";

        floatingBall.style.opacity =
            "0.9";

        document.body.appendChild(
            floatingBall
        );

        moveFloatingBall(
            touch.clientX,
            touch.clientY
        );

        basketball.style.visibility =
            "hidden";
    },
    {
        passive: false
    }
);

basketball.addEventListener(
    "touchmove",
    (event) => {
        if (!floatingBall) {
            return;
        }

        event.preventDefault();

        const touch =
            event.touches[0];

        moveFloatingBall(
            touch.clientX,
            touch.clientY
        );

        highlightTouchedHoop(
            touch.clientX,
            touch.clientY
        );
    },
    {
        passive: false
    }
);

basketball.addEventListener(
    "touchend",
    (event) => {
        if (!floatingBall) {
            return;
        }

        const touch =
            event.changedTouches[0];

        const selectedHoop =
            findTouchedHoop(
                touch.clientX,
                touch.clientY
            );

        floatingBall.remove();
        floatingBall = null;

        basketball.style.visibility =
            "visible";

        if (selectedHoop) {
            const selectedNumber =
                Number(
                    selectedHoop.dataset.number
                );

            checkAnswer(
                selectedNumber,
                selectedHoop
            );
        } else {
            resetHoops();
        }
    }
);


/* ---------------- MOVE TOUCH BALL ---------------- */

function moveFloatingBall(x, y) {
    floatingBall.style.left =
        `${x - 38}px`;

    floatingBall.style.top =
        `${y - 38}px`;
}


/* ---------------- FIND TOUCHED HOOP ---------------- */

function findTouchedHoop(x, y) {
    let selectedHoop = null;

    hoops.forEach((hoop) => {
        const area =
            hoop.getBoundingClientRect();

        const isInside =
            x >= area.left &&
            x <= area.right &&
            y >= area.top &&
            y <= area.bottom;

        if (isInside) {
            selectedHoop = hoop;
        }
    });

    return selectedHoop;
}


/* ---------------- HIGHLIGHT TOUCH HOOP ---------------- */

function highlightTouchedHoop(x, y) {
    hoops.forEach((hoop) => {
        resetSingleHoop(hoop);
    });

    const selectedHoop =
        findTouchedHoop(x, y);

    if (selectedHoop) {
        selectedHoop.style.transform =
            "scale(1.08)";

        selectedHoop.style.borderColor =
            "#8b5cf6";

        selectedHoop.style.background =
            "#f3e8ff";
    }
}


/* ---------------- CHECK ANSWER ---------------- */

function checkAnswer(
    selectedNumber,
    selectedHoop
) {
    if (answered) {
        return;
    }

    if (selectedNumber === correctNumber) {
        answered = true;
        score++;

        scoreElement.textContent =
            score;

        feedbackElement.textContent =
            `⭐ Correct! ${numberWords[correctNumber]}!`;

        feedbackElement.className =
            "feedback correct";

        selectedHoop.style.borderColor =
            "#34a853";

        selectedHoop.style.background =
            "#e8f8ec";

        selectedHoop.style.transform =
            "scale(1.1)";

        basketball.style.visibility =
            "hidden";

        speakNumber(correctNumber);

        setTimeout(
            nextQuestion,
            1600
        );

    } else {
        feedbackElement.textContent =
            "Try again!";

        feedbackElement.className =
            "feedback wrong";

        selectedHoop.style.borderColor =
            "#e53935";

        selectedHoop.style.background =
            "#ffeaea";

        speakText("Try again");

        setTimeout(() => {
            if (!answered) {
                feedbackElement.textContent =
                    "Listen and try another hoop.";

                feedbackElement.className =
                    "feedback";

                resetHoops();
            }
        }, 900);
    }
}


/* ---------------- NEXT QUESTION ---------------- */

function nextQuestion() {
    currentQuestion++;

    if (
        currentQuestion <
        gameNumbers.length
    ) {
        showQuestion();
    } else {
        finishActivity();
    }
}


/* ---------------- FINISH ACTIVITY ---------------- */

function finishActivity() {
    localStorage.setItem(
        "activity4Score",
        String(score)
    );

    localStorage.setItem(
        "activity4Total",
        String(gameNumbers.length)
    );

    let message = "";

    if (score === 10) {
        message =
            "Perfect! You are a number superstar! 🌟";
    } else if (score >= 8) {
        message =
            "Excellent work! 🎉";
    } else if (score >= 6) {
        message =
            "Good job! Keep practising! 😊";
    } else {
        message =
            "Nice try! Play again and keep learning!";
    }

    gameCard.innerHTML = `
        <h1>🏀 Poppop Phonics 🏀</h1>

        <div class="result-area">

            <h2>🎉 Activity 4 Finished!</h2>

            <p class="final-result">
                Your score:
                <strong>${score} / ${gameNumbers.length}</strong>
            </p>

            <p>${message}</p>

            <button
                id="play-again-button"
                class="sound-button"
                type="button">
                Play Again
            </button>

            <button
                id="previous-result-button"
                class="sound-button"
                type="button">
                ← Previous Activity
            </button>

        </div>
    `;

    document
        .querySelector(
            "#play-again-button"
        )
        .addEventListener(
            "click",
            () => {
                window.location.reload();
            }
        );

    document
        .querySelector(
            "#previous-result-button"
        )
        .addEventListener(
            "click",
            () => {
                window.location.href =
                    "activity3.html";
            }
        );

    speakText(
        `Great job. Your score is ${score} out of ${gameNumbers.length}.`
    );
}


/* ---------------- SPEECH ---------------- */

function speakNumber(number) {
    speakText(numberWords[number]);
}

function speakText(text) {
    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.7;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

soundButton.addEventListener(
    "click",
    () => {
        speakNumber(correctNumber);
    }
);


/* ---------------- RESET HOOPS ---------------- */

function resetHoops() {
    hoops.forEach((hoop) => {
        resetSingleHoop(hoop);
    });
}

function resetSingleHoop(hoop) {
    hoop.style.transform =
        "scale(1)";

    hoop.style.borderColor =
        "#4ea5ff";

    hoop.style.background =
        "#eef7ff";
}


/* ---------------- SHUFFLE ---------------- */

function shuffleArray(array) {
    for (
        let index = array.length - 1;
        index > 0;
        index--
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            array[index],
            array[randomIndex]
        ] = [
            array[randomIndex],
            array[index]
        ];
    }

    return array;
}


/* ---------------- PREVIOUS ACTIVITY ---------------- */

previousButton.addEventListener(
    "click",
    () => {
        window.location.href =
            "activity3.html";
    }
);
const nextButton =
    document.querySelector("#nextButton");

nextButton.addEventListener(
    "click",
    () => {
        window.location.href = "activity5.html";
    }
);