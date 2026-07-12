"use strict";


/* ---------------- PASSAGE ---------------- */

const expectedText = `
The cat is small.
It has a red ball.
The cat likes to play.
It runs in the garden.
Then it goes home.
`;


/* ---------------- HTML ELEMENTS ---------------- */
const listenButton =
    document.querySelector("#listen-button");
    
const startButton =
    document.querySelector("#start-button");

const stopButton =
    document.querySelector("#stop-button");

const statusMessage =
    document.querySelector("#status-message");

const resultArea =
    document.querySelector("#result-area");

const recognisedText =
    document.querySelector("#recognized-text");

const accuracyScore =
    document.querySelector("#accuracy-score");

const readingTime =
    document.querySelector("#reading-time");

const wordsPerMinute =
    document.querySelector("#words-per-minute");

const tryAgainButton =
    document.querySelector("#try-again-button");

const previousButton =
    document.querySelector("#previous-button");


/* ---------------- SPEECH RECOGNITION ---------------- */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;
let finalTranscript = "";
let startTime = 0;
let hasFinished = false;


/* ---------------- CHECK BROWSER SUPPORT ---------------- */

if (!SpeechRecognition) {
    statusMessage.textContent =
        "Speech recognition is not supported in this browser.";

    startButton.disabled = true;
    stopButton.disabled = true;
} else {
    recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-US";

    recognition.interimResults =
        true;

    recognition.continuous =
        true;
}


/* ---------------- CLEAN TEXT ---------------- */

function cleanText(text) {
    return text
        .toLowerCase()
        .replace(/[.,!?;:]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


/* ---------------- WORD MATCHING ---------------- */

function calculateMatchingWords(
    expectedWords,
    spokenWords
) {
    const rows =
        expectedWords.length + 1;

    const columns =
        spokenWords.length + 1;

    const table =
        Array.from(
            { length: rows },
            () =>
                Array(columns).fill(0)
        );

    for (
        let expectedIndex = 1;
        expectedIndex < rows;
        expectedIndex++
    ) {
        for (
            let spokenIndex = 1;
            spokenIndex < columns;
            spokenIndex++
        ) {
            if (
                expectedWords[
                    expectedIndex - 1
                ] ===
                spokenWords[
                    spokenIndex - 1
                ]
            ) {
                table[expectedIndex][spokenIndex] =
                    table[
                        expectedIndex - 1
                    ][
                        spokenIndex - 1
                    ] + 1;
            } else {
                table[expectedIndex][spokenIndex] =
                    Math.max(
                        table[
                            expectedIndex - 1
                        ][spokenIndex],
                        table[
                            expectedIndex
                        ][
                            spokenIndex - 1
                        ]
                    );
            }
        }
    }

    return table[
        expectedWords.length
    ][spokenWords.length];
}


/* ---------------- CALCULATE RESULT ---------------- */

function calculateResult() {
    const cleanExpected =
        cleanText(expectedText);

    const cleanSpoken =
        cleanText(finalTranscript);

    const expectedWords =
        cleanExpected
            ? cleanExpected.split(" ")
            : [];

    const spokenWords =
        cleanSpoken
            ? cleanSpoken.split(" ")
            : [];

    const matchingWords =
        calculateMatchingWords(
            expectedWords,
            spokenWords
        );

    const accuracy =
        expectedWords.length > 0
            ? Math.round(
                (
                    matchingWords /
                    expectedWords.length
                ) * 100
            )
            : 0;

    const elapsedSeconds =
        Math.max(
            1,
            Math.round(
                (
                    Date.now() -
                    startTime
                ) / 1000
            )
        );

    const wpm =
        spokenWords.length > 0
            ? Math.round(
                (
                    spokenWords.length /
                    elapsedSeconds
                ) * 60
            )
            : 0;

    accuracyScore.textContent =
        accuracy;

    readingTime.textContent =
        elapsedSeconds;

    wordsPerMinute.textContent =
        wpm;

    recognisedText.textContent =
        finalTranscript.trim() ||
        "No speech was recognized.";
}


/* ---------------- START READING ---------------- */

function startReading() {
    if (!recognition) {
        return;
    }

    finalTranscript = "";
    hasFinished = false;
    startTime = Date.now();

    resultArea.hidden = true;

    recognisedText.textContent = "";

    startButton.disabled = true;
    stopButton.disabled = false;

    statusMessage.textContent =
        "🎤 Listening... Please read the passage.";

    try {
        recognition.start();
    } catch (error) {
        console.error(error);

        statusMessage.textContent =
            "Speech recognition is already running.";

        startButton.disabled = false;
        stopButton.disabled = true;
    }
}


/* ---------------- STOP READING ---------------- */

function stopReading() {
    if (
        !recognition ||
        hasFinished
    ) {
        return;
    }

    hasFinished = true;

    stopButton.disabled = true;
    startButton.disabled = false;

    recognition.stop();
}


/* ---------------- SPEECH RESULTS ---------------- */

if (recognition) {
    recognition.onresult =
        (event) => {
            let transcript = "";

            for (
                let index = 0;
                index <
                event.results.length;
                index++
            ) {
                transcript +=
                    event.results[index][0]
                        .transcript +
                    " ";
            }

            finalTranscript =
                transcript.trim();

            statusMessage.textContent =
                `🎤 I heard: ${finalTranscript}`;
        };


    recognition.onend =
        () => {
            if (!hasFinished) {
                return;
            }

            calculateResult();

            resultArea.hidden =
                false;

            statusMessage.textContent =
                "Reading finished.";
        };


    recognition.onerror =
        (event) => {
            console.error(
                "Speech recognition error:",
                event.error
            );

            startButton.disabled =
                false;

            stopButton.disabled =
                true;

            hasFinished = true;

            if (
                event.error ===
                "no-speech"
            ) {
                statusMessage.textContent =
                    "No speech was detected. Please try again.";
            } else if (
                event.error ===
                "not-allowed"
            ) {
                statusMessage.textContent =
                    "Microphone permission was not allowed.";
            } else {
                statusMessage.textContent =
                    `Speech recognition error: ${event.error}`;
            }
        };
}
/* ---------------- LISTEN FIRST ---------------- */

function readPassageAloud() {

    if (!("speechSynthesis" in window)) {
        statusMessage.textContent =
            "Speech is not supported.";
        return;
    }

    speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(expectedText);

    speech.lang = "en-US";
    speech.rate = 0.75;
    speech.pitch = 1;

    const voices =
        speechSynthesis.getVoices();

    const zira =
        voices.find(
            voice =>
                voice.name.includes("Zira")
        );

    if (zira) {
        speech.voice = zira;
    }

    speechSynthesis.speak(speech);

}

/* ---------------- BUTTON EVENTS ---------------- */
listenButton.addEventListener(
    "click",
    readPassageAloud
);

startButton.addEventListener(
    "click",
    startReading
);

stopButton.addEventListener(
    "click",
    stopReading
);

tryAgainButton.addEventListener(
    "click",
    () => {
        finalTranscript = "";
        hasFinished = false;

        resultArea.hidden = true;

        recognisedText.textContent = "";

        accuracyScore.textContent =
            "0";

        readingTime.textContent =
            "0";

        wordsPerMinute.textContent =
            "0";

        statusMessage.textContent =
            "Press Start Reading when you are ready.";

        startButton.disabled =
            false;

        stopButton.disabled =
            true;
    }
);

previousButton.addEventListener(
    "click",
    () => {
        window.location.href =
            "activity4.html";
    }
);