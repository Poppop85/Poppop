/* ---------------- SUPABASE ---------------- */

const SUPABASE_URL =
    "https://ainfigfcsyayxqguiecy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZGvyEHuIM-5ZIuOUL4174A_VgSni472";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ---------------- QUESTIONS ---------------- */

const questions = [
    { display: "C _ T", answer: "A", word: "cat" },
    { display: "H _ N", answer: "E", word: "hen" },
    { display: "P _ G", answer: "I", word: "pig" },
    { display: "D _ G", answer: "O", word: "dog" },
    { display: "S _ N", answer: "U", word: "sun" },
    { display: "M _ P", answer: "A", word: "map" },
    { display: "B _ D", answer: "E", word: "bed" },
    { display: "F _ SH", answer: "I", word: "fish" },
    { display: "F _ X", answer: "O", word: "fox" },
    { display: "C _ P", answer: "U", word: "cup" }
];


/* ---------------- GAME VARIABLES ---------------- */

let currentQuestion = 0;
let score = 0;
let answered = false;
let studentEmail = "";

let mediaRecorder;
let audioChunks = [];
let microphoneStream;
let currentAudioURL = null;


/* ---------------- HTML ELEMENTS ---------------- */

const wordElement =
    document.querySelector("#word");

const scoreElement =
    document.querySelector("#score");

const messageElement =
    document.querySelector("#message");

const nextButton =
    document.querySelector("#next-button");

const soundButton =
    document.querySelector("#sound-button");

const restartButton =
    document.querySelector("#restart-button");

const nextActivityButton =
    document.querySelector("#next-activity-button");

const vowelButtons =
    document.querySelectorAll(".vowel");

const resultArea =
    document.querySelector("#result-area");

const finalScoreElement =
    document.querySelector("#final-score");

const previousScoreElement =
    document.querySelector("#previous-score");

const resultMessageElement =
    document.querySelector("#result-message");

const recordButton =
    document.querySelector("#record-button");

const stopButton =
    document.querySelector("#stop-button");

const recordingMessage =
    document.querySelector("#recording-message");

const audioPlayback =
    document.querySelector("#audio-playback");

const loginScreen =
    document.querySelector("#login-screen");

const gameContainer =
    document.querySelector("#game-container");

const emailInput =
    document.querySelector("#email-input");

const startButton =
    document.querySelector("#start-button");

const emailMessage =
    document.querySelector("#email-message");


/* ---------------- SHOW QUESTION ---------------- */

function showQuestion() {
    answered = false;

    const question = questions[currentQuestion];

    wordElement.textContent = question.display;

    messageElement.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    nextButton.disabled = true;

    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = "Finish";
    } else {
        nextButton.textContent = "Next Word";
    }

    vowelButtons.forEach((button) => {
        button.disabled = false;
    });

    resetRecording();
}


/* ---------------- CHECK ANSWER ---------------- */

function checkAnswer(selectedVowel) {
    if (answered) {
        return;
    }

    answered = true;

    const question = questions[currentQuestion];

    if (selectedVowel === question.answer) {
        score++;

        scoreElement.textContent = score;

        messageElement.textContent =
            `⭐ Correct! ${question.word.toUpperCase()}!`;

        speakWord(question.word);
    } else {
        messageElement.textContent =
            `The correct answer is ${question.answer}: ${question.word.toUpperCase()}.`;
    }

    vowelButtons.forEach((button) => {
        button.disabled = true;
    });

    nextButton.disabled = false;
}


/* ---------------- NEXT QUESTION ---------------- */

function nextQuestion() {
    if (!answered) {
        return;
    }

    if (currentQuestion === questions.length - 1) {
        finishActivity();
        return;
    }

    currentQuestion++;
    showQuestion();
}


/* ---------------- OPTIONAL OLD SAVE FUNCTION ---------------- */

/*
This function is kept here, but it is not called after Activity 1.

Activity 1 stores its score in localStorage.
Activity 2 saves both results to Supabase.
*/

async function saveResultToSupabase() {
    const result = {
        email: studentEmail,
        score: score,
        total_questions: questions.length,
        activity: "Short Vowels",
        marketing_consent: true
    };

    const { error } = await supabaseClient
        .from("student_results")
        .insert(result);

    if (error) {
        console.error(
            "Supabase save error:",
            error
        );

        return;
    }

    console.log(
        "Email and score saved successfully."
    );
}


/* ---------------- FINISH ACTIVITY 1 ---------------- */

function finishActivity() {
    /*
    Store Activity 1 information for vowels.js.
    Activity 2 will upload both scores.
    */

    localStorage.setItem(
        "cvcScore",
        String(score)
    );

    localStorage.setItem(
        "cvcTotal",
        String(questions.length)
    );

    localStorage.setItem(
        "studentEmail",
        studentEmail
    );

    const previousScore =
        localStorage.getItem("poppopVowelScore");

    localStorage.setItem(
        "poppopVowelScore",
        String(score)
    );

    wordElement.hidden = true;
    messageElement.hidden = true;
    nextButton.hidden = true;
    soundButton.hidden = true;

    document.querySelector(
        ".vowel-buttons"
    ).hidden = true;

    const recordingArea =
        document.querySelector(".recording-area");

    if (recordingArea) {
        recordingArea.hidden = true;
    }

    finalScoreElement.textContent = score;

    if (previousScore === null) {
        previousScoreElement.textContent =
            "This is your first attempt.";
    } else {
        previousScoreElement.textContent =
            `${previousScore} / ${questions.length}`;
    }

    if (score === 10) {
        resultMessageElement.textContent =
            "Perfect score! Amazing work! 🌟";
    } else if (score >= 8) {
        resultMessageElement.textContent =
            "Excellent work! You know your short vowels very well.";
    } else if (score >= 6) {
        resultMessageElement.textContent =
            "Good job! Practise a few more vowel sounds.";
    } else {
        resultMessageElement.textContent =
            "Nice try! Listen carefully and play again.";
    }

    resultArea.hidden = false;

    /*
    This must be INSIDE finishActivity().
    */
    if (nextActivityButton) {
        nextActivityButton.hidden = false;
    }
}


/* ---------------- RESTART ACTIVITY ---------------- */

function restartActivity() {
    currentQuestion = 0;
    score = 0;
    answered = false;

    scoreElement.textContent = "0";

    wordElement.hidden = false;
    messageElement.hidden = false;
    nextButton.hidden = false;
    soundButton.hidden = false;

    document.querySelector(
        ".vowel-buttons"
    ).hidden = false;

    const recordingArea =
        document.querySelector(".recording-area");

    if (recordingArea) {
        recordingArea.hidden = false;
    }

    resultArea.hidden = true;

    showQuestion();
}


/* ---------------- SPEECH ---------------- */

function speakWord(word) {
    if (!("speechSynthesis" in window)) {
        messageElement.textContent =
            "Speech is not supported in this browser.";

        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(word);

    speech.lang = "en-US";
    speech.rate = 0.75;

    window.speechSynthesis.speak(speech);
}


/* ---------------- RECORDING ---------------- */

function resetRecording() {
    if (microphoneStream) {
        microphoneStream
            .getTracks()
            .forEach((track) => {
                track.stop();
            });
    }

    if (currentAudioURL) {
        URL.revokeObjectURL(currentAudioURL);
        currentAudioURL = null;
    }

    if (audioPlayback) {
        audioPlayback.pause();
        audioPlayback.removeAttribute("src");
        audioPlayback.hidden = true;
    }

    if (recordButton) {
        recordButton.disabled = false;
    }

    if (stopButton) {
        stopButton.disabled = true;
    }

    if (recordingMessage) {
        recordingMessage.textContent =
            "Press Start Recording, then say the word.";
    }
}

async function startRecording() {
    try {
        microphoneStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        mediaRecorder =
            new MediaRecorder(microphoneStream);

        audioChunks = [];

        mediaRecorder.addEventListener(
            "dataavailable",
            (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            }
        );

        mediaRecorder.addEventListener(
            "stop",
            () => {
                const audioBlob =
                    new Blob(audioChunks, {
                        type: mediaRecorder.mimeType
                    });

                currentAudioURL =
                    URL.createObjectURL(audioBlob);

                audioPlayback.src = currentAudioURL;
                audioPlayback.hidden = false;

                recordingMessage.textContent =
                    "Great! Press play to hear your pronunciation.";

                microphoneStream
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });
            }
        );

        mediaRecorder.start();

        recordButton.disabled = true;
        stopButton.disabled = false;
        audioPlayback.hidden = true;

        recordingMessage.textContent =
            `Recording... Say "${questions[currentQuestion].word}".`;

    } catch (error) {
        console.error(error);

        recordingMessage.textContent =
            "Microphone access was not allowed.";
    }
}

function stopRecording() {
    if (
        mediaRecorder &&
        mediaRecorder.state === "recording"
    ) {
        mediaRecorder.stop();

        recordButton.disabled = false;
        stopButton.disabled = true;
    }
}


/* ---------------- LOGIN ---------------- */

function startGame() {
    const enteredEmail =
        emailInput.value.trim();

    if (
        enteredEmail === "" ||
        !emailInput.checkValidity()
    ) {
        emailMessage.textContent =
            "Please enter a valid email address.";

        return;
    }

    studentEmail = enteredEmail;

    localStorage.setItem(
        "studentEmail",
        studentEmail
    );

    emailMessage.textContent = "";

    loginScreen.hidden = true;
    gameContainer.hidden = false;

    showQuestion();
}


/* ---------------- BUTTON EVENTS ---------------- */

vowelButtons.forEach((button) => {
    button.addEventListener("click", () => {
        checkAnswer(button.dataset.vowel);
    });
});

nextButton.addEventListener(
    "click",
    nextQuestion
);

restartButton.addEventListener(
    "click",
    restartActivity
);

soundButton.addEventListener(
    "click",
    () => {
        const question =
            questions[currentQuestion];

        speakWord(question.word);
    }
);

if (recordButton) {
    recordButton.addEventListener(
        "click",
        startRecording
    );
}

if (stopButton) {
    stopButton.addEventListener(
        "click",
        stopRecording
    );
}

startButton.addEventListener(
    "click",
    startGame
);

emailInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            startGame();
        }
    }
);

if (nextActivityButton) {
    nextActivityButton.addEventListener(
        "click",
        () => {
            window.location.href =
                "vowels.html";
        }
    );
}