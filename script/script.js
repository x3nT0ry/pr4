import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { app } from './app.js'; 

const database = getDatabase(app);

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
    let answersData = []; 

    fetch("./questions.json")
        .then((response) => response.json())
        .then((data) => {
            questions = data.questions;
            playTest();
        })
        .catch((error) => console.error("Error loading questions:", error));

    btnOpenModal.addEventListener("click", () => {
        modalBlock.classList.add("d-block");
        playTest();
    });

    closeModal.addEventListener("click", () => {
        modalBlock.classList.remove("d-block");
    });

    const playTest = () => {
        const renderQuestion = () => {
            if (numberQuestion < questions.length) {
                const currentQuestion = questions[numberQuestion];
                questionTitle.textContent = currentQuestion.question;

                formAnswers.innerHTML = currentQuestion.answers
                    .map(
                        (answer, index) => `
                        <div class="answers-item d-flex flex-column">
                            <input type="${currentQuestion.type}" id="answerItem${index}" name="answer" class="d-none" value="${answer.title}">
                            <label for="answerItem${index}" class="d-flex flex-column justify-content-between">
                                <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                                <span>${answer.title}</span>
                            </label>
                        </div>
                    `
                    )
                    .join("");

                btnPrev.style.display = numberQuestion === 0 ? "none" : "block";
                btnNext.style.display = "block";
                sendBtn.classList.add("d-none");
                questionTitle.style.display = "block";
            } else {
                questionTitle.textContent = "Введіть ваше ім'я та номер телефону:";
                formAnswers.innerHTML = `
                    <div class="form-group w-100 mb-2">
                        <input type="text" id="nameInput" class="form-control" placeholder="Ваше ім'я">
                    </div>
                    <div class="form-group w-100">
                        <input type="tel" id="phoneInput" class="form-control" placeholder="+380XXXXXXXXX">
                    </div>
                `;
                btnPrev.style.display = "none";
                btnNext.style.display = "none";
                sendBtn.classList.remove("d-none");
                questionTitle.style.display = "block"; 
            }
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
        const selectedAnswer = formAnswers.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            answersData.push({
                question: questions[numberQuestion].question,
                answer: selectedAnswer.value,
            });
        }

        if (numberQuestion < questions.length) {
            numberQuestion++;
            playTest();
        }
    });

    sendBtn.addEventListener("click", () => {
        const nameInput = document.querySelector("#nameInput").value;
        const phoneInput = document.querySelector("#phoneInput").value;

        answersData.push({ "ім'я": nameInput });
        answersData.push({ "номер телефону": phoneInput });

        set(ref(database, 'responses/' + Date.now()), {
            answers: answersData
        })
        .then(() => {
            console.log('Данные успешно отправлены на Firebase');
            questionTitle.style.display = "none";
            const thankYouMessage = document.createElement("div");
            thankYouMessage.textContent = "Дякую за відповідь!";
            thankYouMessage.classList.add("thank-you-message", "text-center", "mt-3");
            formAnswers.innerHTML = ""; 
            formAnswers.appendChild(thankYouMessage); 
            sendBtn.classList.add("d-none"); 
            
            setTimeout(() => {
                thankYouMessage.remove(); 
                location.reload(); 
            }, 4000);
        })
        .catch((error) => {
            console.error('Ошибка отправки данных на Firebase:', error);
        });

        questionTitle.textContent = "";
    });
});
