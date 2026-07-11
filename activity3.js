"use strict";


/* ---------------- QUESTIONS ---------------- */

const questions = [
    {
        word: "Apple",
        letter: "A",
        picture: "🍎"
    },
    {
        word: "Ball",
        letter: "B",
        picture: "⚽"
    },
    {
        word: "Cat",
        letter: "C",
        picture: "🐱"
    },
    {
        word: "Dog",
        letter: "D",
        picture: "🐶"
    },
    {
        word: "Egg",
        letter: "E",
        picture: "🥚"
    },
    {
        word: "Fish",
        letter: "F",
        picture: "🐟"
    },
    {
        word: "Goat",
        letter: "G",
        picture: "🐐"
    },
    {
        word: "Hat",
        letter: "H",
        picture: "🎩"
    },
    {
        word: "Ice cream",
        letter: "I",
        picture: "🍦"
    },
    {
        word: "Juice",
        letter: "J",
        picture: "🧃"
    }
];


/* ---------------- GAME VARIABLES ---------------- */

let currentQuestion = 0;
let score = 0;
let answered = false;


/* ---------------- HTML ELEMENTS ---------------- */

const scoreElement =
    document.querySelector("#score");

const questionNumberElement =
    document.querySelector("#question-number");

const totalQuestionsElement =
    document.querySelector("#total-questions");

const pictureElement =
    document.querySelector("#picture");

const wordElement =
    document.querySelector("#word");

const feedbackElement =
    document.querySelector("#feedback");

const lettersContainer =
    document.querySelector("#letters");

const dropZone =
    document.querySelector("#drop-zone");

const soundButton =
    document.querySelector("#sound-button");

const previousButton =
    document.querySelector("#previousButton");

const gameCard =
    document.querySelector(".game-card");


/* ---------------- START GAME ---------------- */

totalQuestionsElement.textContent =
    questions.length;

showQuestion();


/* ---------------- SHOW QUESTION ---------------- */

function showQuestion() {
    answered = false;

    const question =
        questions[currentQuestion];

    pictureElement.textContent =
        question.picture;

    wordElement.textContent =
        question.word;

    questionNumberElement.textContent =
        currentQuestion + 1;

    feedbackElement.textContent =
        "Drag the correct letter.";

    feedbackElement.className =
        "feedback";

    dropZone.style.borderColor =
        "#58a8ff";

    dropZone.style.background =
        "#eef7ff";

    createLetterChoices(
        question.letter
    );
}


/* ---------------- CREATE LETTER CHOICES ---------------- */

function createLetterChoices(correctLetter) {
    lettersContainer.innerHTML = "";

    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const wrongLetters =
        alphabet.filter((letter) => {
            return letter !== correctLetter;
        });

    shuffleArray(wrongLetters);

    const choices = [
        correctLetter,
        wrongLetters[0],
        wrongLetters[1]
    ];

    shuffleArray(choices);

    choices.forEach((letter) => {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "letter";
        button.textContent = letter;
        button.dataset.letter = letter;

        button.draggable = true;

        button.addEventListener(
            "dragstart",
            startDragging
        );

        button.addEventListener(
            "click",
            () => {
                checkAnswer(letter);
            }
        );

        addTouchDragging(button);

        lettersContainer.appendChild(
            button
        );
    });
}


/* ---------------- COMPUTER DRAGGING ---------------- */

function startDragging(event) {
    if (answered) {
        event.preventDefault();
        return;
    }

    event.dataTransfer.setData(
        "text/plain",
        event.target.dataset.letter
    );
}

dropZone.addEventListener(
    "dragover",
    (event) => {
        event.preventDefault();

        if (!answered) {
            dropZone.style.borderColor =
                "#8b5cf6";

            dropZone.style.background =
                "#f3e8ff";
        }
    }
);

dropZone.addEventListener(
    "dragleave",
    () => {
        if (!answered) {
            dropZone.style.borderColor =
                "#58a8ff";

            dropZone.style.background =
                "#eef7ff";
        }
    }
);

dropZone.addEventListener(
    "drop",
    (event) => {
        event.preventDefault();

        const selectedLetter =
            event.dataTransfer.getData(
                "text/plain"
            );

        checkAnswer(selectedLetter);
    }
);


/* ---------------- PHONE TOUCH DRAGGING ---------------- */

function addTouchDragging(button) {
    let floatingLetter = null;

    button.addEventListener(
        "touchstart",
        (event) => {
            if (answered) {
                return;
            }

            event.preventDefault();

            const touch =
                event.touches[0];

            floatingLetter =
                button.cloneNode(true);

            floatingLetter.style.position =
                "fixed";

            floatingLetter.style.zIndex =
                "1000";

            floatingLetter.style.width =
                "75px";

            floatingLetter.style.height =
                "75px";

            floatingLetter.style.opacity =
                "0.9";

            floatingLetter.style.pointerEvents =
                "none";

            document.body.appendChild(
                floatingLetter
            );

            moveFloatingLetter(
                floatingLetter,
                touch.clientX,
                touch.clientY
            );
        },
        {
            passive: false
        }
    );

    button.addEventListener(
        "touchmove",
        (event) => {
            if (!floatingLetter) {
                return;
            }

            event.preventDefault();

            const touch =
                event.touches[0];

            moveFloatingLetter(
                floatingLetter,
                touch.clientX,
                touch.clientY
            );

            if (
                isInsideDropZone(
                    touch.clientX,
                    touch.clientY
                )
            ) {
                dropZone.style.borderColor =
                    "#8b5cf6";

                dropZone.style.background =
                    "#f3e8ff";
            } else {
                dropZone.style.borderColor =
                    "#58a8ff";

                dropZone.style.background =
                    "#eef7ff";
            }
        },
        {
            passive: false
        }
    );

    button.addEventListener(
        "touchend",
        (event) => {
            if (!floatingLetter) {
                return;
            }

            const touch =
                event.changedTouches[0];

            const droppedInside =
                isInsideDropZone(
                    touch.clientX,
                    touch.clientY
                );

            floatingLetter.remove();
            floatingLetter = null;

            if (droppedInside) {
                checkAnswer(
                    button.dataset.letter
                );
            } else {
                dropZone.style.borderColor =
                    "#58a8ff";

                dropZone.style.background =
                    "#eef7ff";
            }
        }
    );
}


/* ---------------- MOVE TOUCH LETTER ---------------- */

function moveFloatingLetter(
    element,
    x,
    y
) {
    element.style.left =
        `${x - 37}px`;

    element.style.top =
        `${y - 37}px`;
}


/* ---------------- CHECK DROP AREA ---------------- */

function isInsideDropZone(x, y) {
    const area =
        dropZone.getBoundingClientRect();

    return (
        x >= area.left &&
        x <= area.right &&
        y >= area.top &&
        y <= area.bottom
    );
}


/* ---------------- CHECK ANSWER ---------------- */

function checkAnswer(selectedLetter) {
    if (answered) {
        return;
    }

    const question =
        questions[currentQuestion];

    if (
        selectedLetter ===
        question.letter
    ) {
        answered = true;
        score++;

        scoreElement.textContent =
            score;

        feedbackElement.textContent =
            `⭐ Correct! ${question.letter} is for ${question.word}!`;

        feedbackElement.className =
            "feedback correct";

        dropZone.style.borderColor =
            "#34a853";

        dropZone.style.background =
            "#e8f8ec";

        disableLetters();

        speakWord(
            `${question.letter} is for ${question.word}`
        );

        setTimeout(
            nextQuestion,
            1600
        );

    } else {
        feedbackElement.textContent =
            "Try again!";

        feedbackElement.className =
            "feedback wrong";

        dropZone.style.borderColor =
            "#e53935";

        dropZone.style.background =
            "#ffeaea";

        speakWord("Try again");

        setTimeout(() => {
            if (!answered) {
                feedbackElement.textContent =
                    "Drag another letter.";

                feedbackElement.className =
                    "feedback";

                dropZone.style.borderColor =
                    "#58a8ff";

                dropZone.style.background =
                    "#eef7ff";
            }
        }, 800);
    }
}


/* ---------------- DISABLE LETTERS ---------------- */

function disableLetters() {
    const buttons =
        document.querySelectorAll(
            ".letter"
        );

    buttons.forEach((button) => {
        button.disabled = true;
        button.draggable = false;
    });
}


/* ---------------- NEXT QUESTION ---------------- */

function nextQuestion() {
    currentQuestion++;

    if (
        currentQuestion <
        questions.length
    ) {
        showQuestion();
    } else {
        finishActivity();
    }
}


/* ---------------- FINISH ACTIVITY ---------------- */

function finishActivity() {
    localStorage.setItem(
        "activity3Score",
        String(score)
    );

    localStorage.setItem(
        "activity3Total",
        String(questions.length)
    );

    let message = "";

    if (score === 10) {
        message =
            "Perfect! You are an ABC superstar! 🌟";
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
        <h1>🌟 Poppop Phonics 🌟</h1>

        <div class="result-area">

            <h2>🎉 Activity 3 Finished!</h2>

            <p class="final-result">
                Your score:
                <strong>${score} / ${questions.length}</strong>
            </p>

            <p>${message}</p>

            <button
                id="play-again-button"
                class="sound-button"
                type="button"
            >
                Play Again
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

    speakWord(
        `Great job. Your score is ${score} out of ${questions.length}.`
    );
}


/* ---------------- SPEECH ---------------- */

function speakWord(text) {
    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.lang = "en-US";
    speech.rate = 0.75;
    speech.pitch = 1;

    window.speechSynthesis.speak(
        speech
    );
}

soundButton.addEventListener(
    "click",
    () => {
        const question =
            questions[currentQuestion];

        speakWord(question.word);
    }
);


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

previousButton.addEventListener(
    "click",
    () => {
        window.location.href = "vowels.html";
    }
);