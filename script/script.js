document.addEventListener("DOMContentLoaded", function () {
    const btnOpenModal = document.querySelector("#btnOpenModal");
    const modalBlock = document.querySelector("#modalBlock");
    const closeModal = document.querySelector("#closeModal");
    const questionTitle = document.querySelector("#question");
    const formAnswers = document.querySelector("#formAnswers");
    const btnPrev = document.querySelector("#prev");
    const btnNext = document.querySelector("#next");
    const sendBtn = document.querySelector("#send");

    let questions = [];
    let numberQuestion = 0;

    fetch("./questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            playTest();
        })
        .catch(error => console.error("Error loading questions:", error));

    btnOpenModal.addEventListener("click", () => {
        modalBlock.classList.add("d-block");
        playTest();
    });

    closeModal.addEventListener("click", () => {
        modalBlock.classList.remove("d-block");
    });

    const playTest = () => {
        const renderQuestion = () => {
            btnPrev.style.display = numberQuestion > 0 ? "block" : "none";

            btnNext.style.display = numberQuestion === questions.length - 1 ? "none" : "block";

            const currentQuestion = questions[numberQuestion];
            questionTitle.textContent = currentQuestion.question;

            formAnswers.innerHTML = currentQuestion.answers.map((answer, index) => `
                <div class="answers-item d-flex flex-column">
                    <input type="${currentQuestion.type}" id="answerItem${index}" name="answer" class="d-none">
                    <label for="answerItem${index}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                        <span>${answer.title}</span>
                    </label>
                </div>
            `).join("");
        };

        renderQuestion();
    };

    btnPrev.addEventListener("click", () => {
        if (numberQuestion > 0) {
            numberQuestion--;
            playTest();
        }
    });

    btnNext.addEventListener("click", () => {
        if (numberQuestion < questions.length - 1) {
            numberQuestion++;
            playTest();
        }
    });
});
