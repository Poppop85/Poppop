/* ---------------- SUPABASE ---------------- */

const SUPABASE_URL = "https://ainfigfcsyayxqguiecy.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZGvyEHuIM-5ZIuOUL4174A_VgSni472";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ---------------- GAME SETTINGS ---------------- */

const vowels = ["a", "e", "i", "o", "u"];
const totalQuestions = 10;


/* ---------------- HTML ELEMENTS ---------------- */

const playButton =
    document.getElementById("playButton");

const vowelButtons =
    document.querySelectorAll(".vowel-button");

const feedback =
    document.getElementById("feedback");
const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");
const questionNumber =
    document.getElementById("question-number");


/* ---------------- GAME VARIABLES ---------------- */

let currentQuestion = 1;
let vowelScore = 0;
let currentVowel = chooseRandomVowel();
let acceptingAnswer = true;


/* ---------------- CHOOSE RANDOM VOWEL ---------------- */

function chooseRandomVowel() {
    const randomIndex =
        Math.floor(Math.random() * vowels.length);

    return vowels[randomIndex];
}


/* ---------------- PLAY VOWEL SOUND ---------------- */

function playVowel() {
    if (!acceptingAnswer) {
        return;
    }

    const speech =
        new SpeechSynthesisUtterance(currentVowel);

    speech.lang = "en-US";
    speech.rate = 0.7;
    speech.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}


/* ---------------- CHECK ANSWER ---------------- */

function checkAnswer(selectedVowel, selectedButton) {
    if (!acceptingAnswer) {
        return;
    }

    acceptingAnswer = false;

    vowelButtons.forEach((button) => {
        button.disabled = true;

        button.classList.remove(
            "correct",
            "incorrect"
        );
    });

    if (selectedVowel === currentVowel) {
        vowelScore++;

        selectedButton.classList.add("correct");

        feedback.textContent = "Correct! ⭐";
    } else {
        selectedButton.classList.add("incorrect");

        feedback.textContent =
            `The answer was ${currentVowel}.`;

        const correctButton =
            document.querySelector(
                `.vowel-button[data-vowel="${currentVowel}"]`
            );

        if (correctButton) {
            correctButton.classList.add("correct");
        }
    }

    setTimeout(() => {
        if (currentQuestion >= totalQuestions) {
            finishActivity();
        } else {
            goToNextQuestion();
        }
    }, 1200);
}


/* ---------------- NEXT QUESTION ---------------- */

function goToNextQuestion() {
    currentQuestion++;

    currentVowel = chooseRandomVowel();
    acceptingAnswer = true;

    questionNumber.textContent = currentQuestion;
    feedback.textContent = "";

    vowelButtons.forEach((button) => {
        button.disabled = false;

        button.classList.remove(
            "correct",
            "incorrect"
        );
    });

    playVowel();
}


/* ---------------- SAVE BOTH RESULTS ---------------- */

async function saveBothResultsToSupabase() {
    const studentEmail =
        localStorage.getItem("studentEmail");

    const cvcScore =
        Number(localStorage.getItem("cvcScore")) || 0;

    const cvcTotal =
        Number(localStorage.getItem("cvcTotal")) || 10;

    if (!studentEmail) {
        throw new Error(
            "Student email was not found."
        );
    }

    const results = [
        {
            email: studentEmail,
            score: cvcScore,
            total_questions: cvcTotal,
            activity: "CVC Exercise",
            marketing_consent: true
        },
        {
            email: studentEmail,
            score: vowelScore,
            total_questions: totalQuestions,
            activity: "Vowel Listening",
            marketing_consent: true
        }
    ];

    const { error } = await supabaseClient
        .from("student_results")
        .insert(results);

    if (error) {
        throw error;
    }
}


/* ---------------- FINISH ACTIVITY ---------------- */

async function finishActivity() {
    acceptingAnswer = false;

    window.speechSynthesis.cancel();

    playButton.disabled = true;

    vowelButtons.forEach((button) => {
        button.disabled = true;

        button.classList.remove(
            "correct",
            "incorrect"
        );
    });

    localStorage.setItem(
        "vowelScore",
        String(vowelScore)
    );

    localStorage.setItem(
        "vowelTotal",
        String(totalQuestions)
    );

    feedback.innerHTML = `
        <div class="finish-message">
            Saving results...
        </div>
    `;

    try {
        await saveBothResultsToSupabase();

        const cvcScore =
            Number(localStorage.getItem("cvcScore")) || 0;

        const cvcTotal =
            Number(localStorage.getItem("cvcTotal")) || 10;

        const combinedScore =
            cvcScore + vowelScore;

        const combinedTotal =
            cvcTotal + totalQuestions;

        feedback.innerHTML = `
            <div class="finish-message">

                <div>Activities Finished! 🎉</div>

                <div>
                    CVC:
                    ${cvcScore} / ${cvcTotal}
                </div>

                <div>
                    Vowels:
                    ${vowelScore} / ${totalQuestions}
                </div>

                <div>
                    Total:
                    ${combinedScore} / ${combinedTotal}
                </div>

                <button
                    id="finishVowelButton"
                    type="button"
                >
                    Finish
                </button>

            </div>
        `;

        const finishButton =
            document.getElementById(
                "finishVowelButton"
            );

        finishButton.addEventListener(
            "click",
            () => {
window.location.href = "activity3.html";
            }
        );
    } catch (error) {
        console.error(
            "Supabase save error:",
            error
        );

        feedback.innerHTML = `
            <div class="finish-message">

                <div>
                    The results could not be saved.
                </div>

                <button
                    id="retrySaveButton"
                    type="button"
                >
                    Try Again
                </button>

            </div>
        `;

        const retryButton =
            document.getElementById(
                "retrySaveButton"
            );

        retryButton.addEventListener(
            "click",
            finishActivity
        );
    }
}


/* ---------------- BUTTON EVENTS ---------------- */

playButton.addEventListener(
    "click",
    playVowel
);

vowelButtons.forEach((button) => {
    button.addEventListener("click", () => {
        checkAnswer(
            button.dataset.vowel,
            button
        );
    });
});
previousButton.addEventListener(
    "click",
    () => {
        window.location.href = "index.html";
    }
);

nextButton.addEventListener(
    "click",
    () => {
        window.location.href = "activity3.html";
    }
);