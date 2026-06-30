// quiz.js

let quizData = [];
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id') || 'enf1';

if (typeof quizzesData !== 'undefined' && quizzesData[quizId]) {
    quizData = quizzesData[quizId];
} else {
    quizData = [
        {
            id: 1,
            bloco: "Erro de Carregamento",
            pergunta: "O simulado requisitado não foi encontrado. Retorne para a trilha e tente novamente.",
            opcoes: ["A) Ok", "B) Ok", "C) Ok", "D) Ok"],
            correta: 0,
            comentario: "Verifique a URL."
        }
    ];
}

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let quizCompleted = false;

const questionContainer = document.getElementById('question-container');
const progressText = document.getElementById('progress-text');
const progressBarFill = document.getElementById('progress-bar-fill');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const quizApp = document.getElementById('quiz-app');
let questionAnswered = false;

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    quizCompleted = false;
    
    quizApp.style.display = 'block';
    resultsContainer.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    submitBtn.disabled = true;
    nextBtn.style.display = 'none';

    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuestionIndex];
    
    // Update progress
    progressText.textContent = `Questão ${currentQuestionIndex + 1} de ${quizData.length}`;
    const percent = ((currentQuestionIndex) / quizData.length) * 100;
    progressBarFill.style.width = `${percent}%`;

    // Render question
    questionContainer.innerHTML = `
        <div class="bloco-badge">${q.bloco}</div>
        <h2 class="question-title">Questão ${q.id}</h2>
        <p class="question-text">${q.pergunta}</p>
        <div class="options-container">
            ${q.opcoes.map((opt, index) => `
                <button class="option-btn" data-index="${index}" onclick="selectOption(${index})">
                    ${opt}
                </button>
            `).join('')}
        </div>
    `;

    // Reset button and state
    questionAnswered = false;
    submitBtn.style.display = 'inline-flex';
    submitBtn.disabled = true;
    nextBtn.style.display = 'none';
    
    submitBtn.onclick = handleSubmit;
    nextBtn.onclick = handleNext;
}

function selectOption(selectedIndex) {
    if (questionAnswered) return; // Cannot change answer after submission

    // Highlight selected option
    const options = document.querySelectorAll('.option-btn');
    options.forEach(opt => {
        opt.classList.remove('selected');
        opt.style.borderColor = 'var(--surface-border)';
        opt.style.background = 'var(--surface-color)';
    });

    const selectedBtn = options[selectedIndex];
    selectedBtn.classList.add('selected');
    selectedBtn.style.borderColor = 'var(--primary)';
    selectedBtn.style.background = 'var(--primary-glow)';

    // Save temporary answer
    userAnswers[currentQuestionIndex] = selectedIndex;

    // Enable submit button
    submitBtn.disabled = false;
}

function handleSubmit() {
    if (userAnswers[currentQuestionIndex] === undefined) return;
    questionAnswered = true;

    const q = quizData[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];
    const isCorrect = userAnswer === q.correta;

    const options = document.querySelectorAll('.option-btn');
    
    // Style options
    if (isCorrect) {
        options[userAnswer].style.borderColor = 'var(--success)';
        options[userAnswer].style.background = 'var(--success-bg)';
        options[userAnswer].style.color = 'var(--success)';
    } else {
        options[userAnswer].style.borderColor = 'var(--danger)';
        options[userAnswer].style.background = 'var(--danger-bg)';
        options[userAnswer].style.color = 'var(--danger)';
        
        // Highlight correct option
        options[q.correta].style.borderColor = 'var(--success)';
        options[q.correta].style.background = 'var(--success-bg)';
        options[q.correta].style.color = 'var(--success)';
        options[q.correta].style.fontWeight = 'bold';
    }

    submitBtn.style.display = 'none';
    nextBtn.style.display = 'inline-flex';
}

function handleNext() {
    if (userAnswers[currentQuestionIndex] === undefined) return;

    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    quizCompleted = true;
    progressBarFill.style.width = '100%';
    
    quizApp.style.display = 'none';
    resultsContainer.style.display = 'block';

    // Calculate score
    score = userAnswers.reduce((acc, curr, idx) => {
        return curr === quizData[idx].correta ? acc + 1 : acc;
    }, 0);

    const percentage = Math.round((score / quizData.length) * 100);
    
    let resultHTML = `
        <div class="score-card glass-panel text-center">
            <h2>Resultado Final</h2>
            <div class="score-circle">
                <span class="score-number">${percentage}%</span>
            </div>
            <p>Você acertou ${score} de ${quizData.length} questões.</p>
            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="initQuiz()">
                Refazer Simulado
            </button>
        </div>
        
        <h3 style="margin: 3rem 0 1.5rem;">Gabarito Comentado</h3>
        <div class="answers-review">
    `;

    quizData.forEach((q, idx) => {
        const userAnswer = userAnswers[idx];
        const isCorrect = userAnswer === q.correta;
        const statusClass = isCorrect ? 'correct' : 'incorrect';
        const icon = isCorrect ? '<i data-lucide="check-circle" class="text-success"></i>' : '<i data-lucide="x-circle" class="text-danger"></i>';

        resultHTML += `
            <div class="review-card glass-panel" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="margin:0;">Questão ${q.id}</h4>
                    ${icon}
                </div>
                <p style="margin-bottom: 1rem;">${q.pergunta}</p>
                
                <div class="review-options">
                    ${q.opcoes.map((opt, optIdx) => {
                        let style = "padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; background: rgba(255,255,255,0.05);";
                        if (optIdx === q.correta) {
                            style += " border: 1px solid var(--success); background: var(--success-bg);";
                        } else if (optIdx === userAnswer && !isCorrect) {
                            style += " border: 1px solid var(--danger); background: var(--danger-bg);";
                        }
                        return `<div style="${style}">${opt}</div>`;
                    }).join('')}
                </div>

                <div class="commentary" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--surface-border);">
                    <p style="font-size: 0.9rem; color: var(--text-muted);">
                        <strong>Comentário:</strong> ${q.comentario}
                    </p>
                </div>
            </div>
        `;
    });

    resultHTML += `</div>`;
    resultsContainer.innerHTML = resultHTML;
    
    // Re-init lucide icons for new HTML
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    window.scrollTo(0, 0);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});
