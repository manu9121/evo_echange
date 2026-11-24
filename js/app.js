alert("APP.JS CHARGE");
// =========================
// VARIABLES GLOBALES
// =========================

let resumeDetaille = [];
let resumeExpress = {};
let essentiel = [];
let flashcards = [];
let questions = [];

let chapitreActuel = 0;

let flashcardIndex = -1;
let flashcardShowAnswer = false;

let quizIndex = 0;
let score = 0;
let erreurs = [];

let rattrapageMode = false;
let rattrapageQuestions = [];

// =========================
// INITIALISATION
// =========================

document.addEventListener("DOMContentLoaded", async () => {

    await chargerDonnees();

    initMenu();

    chargerStats();

});

// =========================
// CHARGEMENT JSON
// =========================

async function chargerDonnees() {

    try {

        const resumeDetailleData =
            await fetch("data/resume_detaille.json");

        resumeDetaille =
            await resumeDetailleData.json();

        const resumeExpressData =
            await fetch("data/resume_express.json");

        resumeExpress =
            await resumeExpressData.json();

        const essentielData =
            await fetch("data/essentiel.json");

        essentiel =
            await essentielData.json();

        const flashcardsData =
            await fetch("data/flashcards.json");

        flashcards =
            await flashcardsData.json();

        const questionsData =
            await fetch("data/questions.json");

        questions =
            await questionsData.json();

        console.log("✅ Données chargées");

    } catch (error) {

        console.error(error);

        alert(
            "Erreur lors du chargement des données."
        );
    }
}

// =========================
// MENU
// =========================

function initMenu() {

    document
        .querySelectorAll(".menu-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;

                    switch (action) {

                        case "resume-detaille":
                            afficherResumeDetaille();
                            break;

                        case "resume-express":
                            afficherResumeExpress();
                            break;

                        case "essentiel":
                            afficherEssentiel();
                            break;

                        case "flashcards":
                            lancerFlashcards();
                            break;

                        case "quiz":
                            lancerQuiz();
                            break;

                        case "rattrapage":
                            lancerRattrapage();
                            break;

                        case "stats":
                            afficherStats();
                            break;
                    }
                }
            );

        });

    document
        .querySelectorAll(".back-btn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                retourAccueil
            );

        });

}

// =========================
// SCREENS
// =========================

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen =>
            screen.classList.remove("active")
        );

    document
        .getElementById(id)
        .classList.add("active");

}

function retourAccueil() {

    showScreen("home-screen");

}

// =========================
// RESUME DETAILLE
// =========================

function afficherResumeDetaille() {

    showScreen("resume-detaille-screen");

    chapitreActuel = 0;

    afficherChapitre();

}

function afficherChapitre() {

    const chapitre =
        resumeDetaille[chapitreActuel];

    const content =
        document.getElementById(
            "resume-detaille-content"
        );

    content.innerHTML = `
        <h3>${chapitre.titre}</h3>
        <p>${chapitre.contenu}</p>
    `;

    document.getElementById(
        "resume-counter"
    ).textContent =
        `${chapitreActuel + 1} / ${resumeDetaille.length}`;
}

document.addEventListener("click", e => {

    if (e.target.id === "resume-prev") {

        if (chapitreActuel > 0) {

            chapitreActuel--;

            afficherChapitre();
        }
    }

    if (e.target.id === "resume-next") {

        if (
            chapitreActuel <
            resumeDetaille.length - 1
        ) {

            chapitreActuel++;

            afficherChapitre();
        }
    }

});

// =========================
// RESUME EXPRESS
// =========================

function afficherResumeExpress() {

    showScreen("resume-express-screen");

    const container =
        document.getElementById(
            "resume-express-content"
        );

    container.innerHTML =
        resumeExpress.contenu || "";
}

// =========================
// ESSENTIEL
// =========================

function afficherEssentiel() {

    showScreen("essentiel-screen");

    const container =
        document.getElementById(
            "essentiel-content"
        );

    container.innerHTML = "";

    essentiel.forEach(item => {

        container.innerHTML += `
            <div class="memory-item">
                ${item}
            </div>
        `;

    });

}

// =========================
// FLASHCARDS
// =========================

function lancerFlashcards() {

    showScreen("flashcards-screen");

    flashcardIndex = -1;

    flashcardShowAnswer = false;

    document.getElementById(
        "flashcard-progress"
    ).textContent =
        `Carte 0 / ${flashcards.length}`;

    document.getElementById(
        "flashcard-box"
    ).innerHTML =
        "Clique pour commencer";

}

document
    .getElementById("flashcard-box")
    .addEventListener("click", () => {

        if (flashcards.length === 0)
            return;

        if (flashcardIndex === -1) {

            flashcardIndex = 0;

            afficherQuestionFlashcard();

            return;
        }

        if (!flashcardShowAnswer) {

            afficherReponseFlashcard();

        } else {

            flashcardIndex++;

            if (
                flashcardIndex >=
                flashcards.length
            ) {

                flashcardIndex = 0;
            }

            afficherQuestionFlashcard();
        }

    });

function afficherQuestionFlashcard() {

    flashcardShowAnswer = false;

    const carte =
        flashcards[flashcardIndex];

    document.getElementById(
        "flashcard-box"
    ).innerHTML = `
        <div class="flashcard-question">
            ${carte.question}
        </div>
    `;

    majProgressionFlashcard();
}

function afficherReponseFlashcard() {

    flashcardShowAnswer = true;

    const carte =
        flashcards[flashcardIndex];

    document.getElementById(
        "flashcard-box"
    ).innerHTML = `
        <div class="flashcard-answer">
            ${carte.reponse}
        </div>
    `;
}

function majProgressionFlashcard() {

    document.getElementById(
        "flashcard-progress"
    ).textContent =
        `Carte ${flashcardIndex + 1} / ${flashcards.length}`;
}

document
    .getElementById(
        "shuffle-flashcards"
    )
    .addEventListener("click", () => {

        flashcards.sort(
            () => Math.random() - 0.5
        );

        flashcardIndex = -1;

        flashcardShowAnswer = false;

        document.getElementById(
            "flashcard-box"
        ).innerHTML =
            "Clique pour commencer";
    });

// =========================
// QUIZ
// =========================

function lancerQuiz() {

    rattrapageMode = false;

    quizIndex = 0;

    score = 0;

    erreurs = [];

    showScreen("quiz-screen");

    afficherQuestionQuiz();
}

function afficherQuestionQuiz() {

    const q = questions[quizIndex];

    document.getElementById(
        "quiz-progress"
    ).textContent =
        `Question ${quizIndex + 1} / ${questions.length}`;

    document.getElementById(
        "quiz-question"
    ).innerHTML =
        q.question;

    document.getElementById(
        "quiz-feedback"
    ).style.display =
        "none";

    document.getElementById(
        "next-question"
    ).style.display =
        "none";

    const options =
        document.getElementById(
            "quiz-options"
        );

    options.innerHTML = "";

    q.options.forEach(
        (reponse, index) => {

            const btn =
                document.createElement(
                    "button"
                );

            btn.className =
                "quiz-option";

            btn.textContent =
                reponse;

            btn.onclick =
                () =>
                    verifierReponse(
                        index
                    );

            options.appendChild(btn);
        }
    );

}

function verifierReponse(indexChoisi) {

    const q =
        questions[quizIndex];

    const feedback =
        document.getElementById(
            "quiz-feedback"
        );

    feedback.style.display =
        "block";

    const bonneReponse =
        q.options[q.bonneReponse];

    const options =
        document.querySelectorAll(
            ".quiz-option"
        );

    options.forEach(
        (btn, idx) => {

            btn.disabled = true;

            if (
                idx === q.bonneReponse
            ) {

                btn.classList.add(
                    "correct"
                );
            }

            if (
                idx === indexChoisi &&
                idx !== q.bonneReponse
            ) {

                btn.classList.add(
                    "incorrect"
                );
            }
        }
    );

    if (
        indexChoisi ===
        q.bonneReponse
    ) {

        score++;

        feedback.innerHTML = `
            <div class="feedback-success">
                ✅ Bonne réponse
            </div>
            <br>
            ${q.explication}
        `;

    } else {

        erreurs.push(q);

        feedback.innerHTML = `
            <div class="feedback-error">
                ❌ Incorrect
            </div>

            <br>

            <strong>
            Bonne réponse :
            </strong>

            ${bonneReponse}

            <br><br>

            ${q.explication}
        `;
    }

    document.getElementById(
        "next-question"
    ).style.display =
        "inline-block";
}

// =========================
// QUESTION SUIVANTE
// =========================

document
    .getElementById(
        "next-question"
    )
    .addEventListener(
        "click",
        () => {

            quizIndex++;

            const liste =
                rattrapageMode
                    ? rattrapageQuestions
                    : questions;

            if (
                quizIndex >=
                liste.length
            ) {

                terminerQuiz();

                return;
            }

            if (
                rattrapageMode
            ) {

                afficherQuestionRattrapage();

            } else {

                afficherQuestionQuiz();
            }

        }
    );

// =========================
// FIN QUIZ
// =========================

function terminerQuiz() {

    sauvegarderStats();

    showScreen(
        "result-screen"
    );

    const pourcentage =
        Math.round(
            (
                score /
                (
                    rattrapageMode
                        ? rattrapageQuestions.length
                        : questions.length
                )
            ) * 100
        );

    document.getElementById(
        "final-score"
    ).innerHTML =
        `${score} points`;

    let niveau = "À revoir";

    if (pourcentage >= 90)
        niveau = "Excellent";

    else if (pourcentage >= 75)
        niveau = "Très bien";

    else if (pourcentage >= 60)
        niveau = "Bien";

    document.getElementById(
        "final-level"
    ).innerHTML =
        `Niveau : ${niveau}`;

    document.getElementById(
        "final-errors"
    ).innerHTML =
        `Erreurs : ${erreurs.length}`;

    localStorage.setItem(
        "evoErreurs",
        JSON.stringify(erreurs)
    );
}

// =========================
// RATTRAPAGE
// =========================

function lancerRattrapage() {

    const data =
        localStorage.getItem(
            "evoErreurs"
        );

    if (!data) {

        showScreen(
            "rattrapage-screen"
        );

        document.getElementById(
            "rattrapage-content"
        ).innerHTML =
            "✅ Aucune erreur enregistrée.";

        return;
    }

    rattrapageQuestions =
        JSON.parse(data);

    if (
        rattrapageQuestions.length === 0
    ) {

        showScreen(
            "rattrapage-screen"
        );

        document.getElementById(
            "rattrapage-content"
        ).innerHTML =
            "✅ Aucune erreur enregistrée.";

        return;
    }

    rattrapageMode = true;

    quizIndex = 0;

    score = 0;

    showScreen("quiz-screen");

    afficherQuestionRattrapage();
}

function afficherQuestionRattrapage() {

    const q =
        rattrapageQuestions[
            quizIndex
        ];

    document.getElementById(
        "quiz-progress"
    ).textContent =
        `Erreur ${quizIndex + 1} / ${rattrapageQuestions.length}`;

    document.getElementById(
        "quiz-question"
    ).innerHTML =
        q.question;

    const options =
        document.getElementById(
            "quiz-options"
        );

    options.innerHTML = "";

    q.options.forEach(
        (rep, i) => {

            const btn =
                document.createElement(
                    "button"
                );

            btn.className =
                "quiz-option";

            btn.textContent =
                rep;

            btn.onclick =
                () =>
                    verifierReponse(
                        i
                    );

            options.appendChild(btn);
        }
    );

    document.getElementById(
        "quiz-feedback"
    ).style.display =
        "none";

    document.getElementById(
        "next-question"
    ).style.display =
        "none";
}

// =========================
// STATS
// =========================

function sauvegarderStats() {

    localStorage.setItem(
        "evoLastScore",
        score
    );

    const best =
        parseInt(
            localStorage.getItem(
                "evoBestScore"
            )
        ) || 0;

    if (score > best) {

        localStorage.setItem(
            "evoBestScore",
            score
        );
    }
}

function chargerStats() {

    document.getElementById(
        "best-score"
    ).textContent =
        localStorage.getItem(
            "evoBestScore"
        ) || 0;

    document.getElementById(
        "last-score"
    ).textContent =
        localStorage.getItem(
            "evoLastScore"
        ) || 0;
}

function afficherStats() {

    chargerStats();

    const erreursLocales =
        JSON.parse(
            localStorage.getItem(
                "evoErreurs"
            ) || "[]"
        );

    document.getElementById(
        "error-count"
    ).textContent =
        erreursLocales.length;

    showScreen("stats-screen");
}

// =========================
// BOUTONS RESULTAT
// =========================

document
    .getElementById(
        "retry-quiz"
    )
    .addEventListener(
        "click",
        lancerQuiz
    );

document
    .getElementById(
        "review-errors"
    )
    .addEventListener(
        "click",
        lancerRattrapage
    );

document
    .getElementById(
        "home-button"
    )
    .addEventListener(
        "click",
        retourAccueil
    );
