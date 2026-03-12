const translations = {
    en: {
        title: "✨ AI Quiz Generator ✨",
        subtitle: "Generate a fun quiz on any topic!",
        topic_label: "Topic",
        size_label: "Number of Questions",
        size_small: "Small (10)",
        size_medium: "Medium (20)",
        size_big: "Big (30)",
        diff_label: "Difficulty",
        diff_easy: "Easy 🟢",
        diff_normal: "Normal 🟡",
        diff_hard: "Hard 🔴",
        btn_generate: "Generate Quiz 🚀",
        loading_title: "Generating your quiz...",
        loading_desc: "Asking Gemini for the best questions!",
        btn_submit: "Submit Answers 🎯",
        btn_results: "See Final Score ➔",
        results_title: "🎉 Quiz Complete! 🎉",
        btn_restart: "Create Another Quiz 🔄",
        alert_error: "Error generating quiz: ",
        alert_incomplete: "Please answer all questions before submitting!",
        msg_perfect: "Perfect! You're a genius! 🌟",
        msg_great: "Great job! You know this topic well! 👏",
        msg_good: "Not bad! A little more study and you'll master it. 📚",
        msg_try: "Keep learning! You'll get it next time. 💪",
        questions_text: "Questions",
        explanation: "Explanation:"
    },
    es: {
        title: "✨ Generador de Quizzes con IA ✨",
        subtitle: "¡Genera un quiz divertido sobre cualquier tema!",
        topic_label: "Tema",
        size_label: "Número de Preguntas",
        size_small: "Pequeño (10)",
        size_medium: "Medio (20)",
        size_big: "Grande (30)",
        diff_label: "Dificultad",
        diff_easy: "Fácil 🟢",
        diff_normal: "Normal 🟡",
        diff_hard: "Difícil 🔴",
        btn_generate: "Generar Quiz 🚀",
        loading_title: "Generando tu quiz...",
        loading_desc: "¡Pidiendo las mejores preguntas a Gemini!",
        btn_submit: "Enviar Respuestas 🎯",
        btn_results: "Ver Puntuación Final ➔",
        results_title: "🎉 ¡Quiz Completado! 🎉",
        btn_restart: "Crear Otro Quiz 🔄",
        alert_error: "Error al generar el quiz: ",
        alert_incomplete: "¡Por favor responde todas las preguntas antes de enviar!",
        msg_perfect: "¡Perfecto! ¡Eres un genio! 🌟",
        msg_great: "¡Buen trabajo! ¡Dominas muy bien este tema! 👏",
        msg_good: "¡Nada mal! Un poco más de estudio y lo dominarás. 📚",
        msg_try: "¡Sigue aprendiendo! Lo conseguirás a la próxima. 💪",
        questions_text: "Preguntas",
        explanation: "Explicación:"
    }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-form');
    const setupSection = document.getElementById('setup-section');
    const loadingSection = document.getElementById('loading-section');
    const quizSection = document.getElementById('quiz-section');
    const resultsSection = document.getElementById('results-section');
    
    const quizTitle = document.getElementById('quiz-title');
    const quizInfo = document.getElementById('quiz-info');
    const questionsContainer = document.getElementById('questions-container');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const restartBtn = document.getElementById('restart-btn');
    const langToggleBtn = document.getElementById('lang-toggle');
    
    let currentQuizData = null;

    // Translation logic
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });
        document.getElementById('topic').placeholder = currentLang === 'en' 
            ? "e.g. Python, Space, History..." 
            : "Ej. Python, Espacio, Historia...";
        if (submitBtn.textContent.includes("➔")) {
            submitBtn.textContent = translations[currentLang].btn_results;
        }
    }

    langToggleBtn.addEventListener('click', () => {
        if (currentLang === 'en') {
            currentLang = 'es';
            langToggleBtn.textContent = '🇺🇸 English';
        } else {
            currentLang = 'en';
            langToggleBtn.textContent = '🇪🇸 Español';
        }
        updateUI();
        
        // update header stats if quiz is active
        if (currentQuizData && quizSection.classList.contains('active')) {
            const capDiff = currentQuizData.difficulty.charAt(0).toUpperCase() + currentQuizData.difficulty.slice(1);
            quizInfo.textContent = `${currentQuizData.questions.length} ${translations[currentLang].questions_text} | ${capDiff}`;
        }
    });

    // View Management
    function showSection(section) {
        setupSection.classList.remove('active');
        loadingSection.classList.remove('active');
        quizSection.classList.remove('active');
        resultsSection.classList.remove('active');
        
        [setupSection, loadingSection, quizSection, resultsSection].forEach(s => s.classList.add('hidden'));
        
        section.classList.remove('hidden');
        section.classList.add('active');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const topic = document.getElementById('topic').value;
        const size = document.getElementById('size').value;
        const difficulty = document.getElementById('difficulty').value;
        
        showSection(loadingSection);
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic, size, difficulty, language: currentLang })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate quiz');
            }
            
            currentQuizData = await response.json();
            renderQuiz(currentQuizData);
            
        } catch (error) {
            alert(translations[currentLang].alert_error + error.message);
            showSection(setupSection);
        }
    });

    function renderQuiz(quizData) {
        quizTitle.textContent = quizData.topic;
        const capDiff = quizData.difficulty.charAt(0).toUpperCase() + quizData.difficulty.slice(1);
        quizInfo.textContent = `${quizData.questions.length} ${translations[currentLang].questions_text} | ${capDiff}`;
        
        questionsContainer.innerHTML = '';
        
        quizData.questions.forEach((q, index) => {
            const qBlock = document.createElement('div');
            qBlock.className = 'question-block';
            
            const qText = document.createElement('div');
            qText.className = 'question-text';
            qText.textContent = `${index + 1}. ${q.text}`;
            qBlock.appendChild(qText);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';
            
            q.options.forEach((opt, optIndex) => {
                const optId = `q${index}_opt${optIndex}`;
                
                const wrapper = document.createElement('div');
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.id = optId;
                input.name = `question_${index}`;
                input.value = opt;
                input.className = 'option-input';
                
                const label = document.createElement('label');
                label.htmlFor = optId;
                label.className = 'option-label';
                label.innerHTML = `<span>${opt}</span>`;
                
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                optionsContainer.appendChild(wrapper);
            });
            
            qBlock.appendChild(optionsContainer);
            
            const explanation = document.createElement('div');
            explanation.className = 'explanation';
            explanation.id = `explanation_${index}`;
            explanation.innerHTML = `<strong>${translations[currentLang].explanation}</strong> ${q.explanation}`;
            qBlock.appendChild(explanation);
            
            questionsContainer.appendChild(qBlock);
        });
        
        submitBtn.textContent = translations[currentLang].btn_submit;
        submitBtn.style.display = 'block';
        showSection(quizSection);
    }
    
    submitBtn.addEventListener('click', () => {
        if (!currentQuizData) return;
        
        // If button is in "Submit Answers" state
        if (submitBtn.textContent === translations[currentLang].btn_submit) {
            let allAnswered = true;
            
            currentQuizData.questions.forEach((q, index) => {
                const selectedInput = document.querySelector(`input[name="question_${index}"]:checked`);
                if (!selectedInput) {
                    allAnswered = false;
                }
            });
            
            if (!allAnswered) {
                alert(translations[currentLang].alert_incomplete);
                return;
            }
            
            // Highlight answers and show explanation
            currentQuizData.questions.forEach((q, index) => {
                // disable all inputs for this question
                document.querySelectorAll(`input[name="question_${index}"]`).forEach(input => input.disabled = true);
                
                const allInputs = document.querySelectorAll(`input[name="question_${index}"]`);
                allInputs.forEach(input => {
                    const label = document.querySelector(`label[for="${input.id}"]`);
                    if (input.value === q.correct_answer) {
                        label.classList.add('correct');
                        label.innerHTML += '<span class="icon">✅</span>';
                    } else if (input.checked && input.value !== q.correct_answer) {
                        label.classList.add('wrong');
                        label.innerHTML += '<span class="icon">❌</span>';
                    }
                });
                
                const explanationBox = document.getElementById(`explanation_${index}`);
                explanationBox.classList.add('visible');
            });
            
            // Change button text to advance to results
            submitBtn.textContent = translations[currentLang].btn_results;
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            
        } else {
            // Button is in "See Final Score" state
            let score = 0;
            currentQuizData.questions.forEach((q, index) => {
                const selectedInput = document.querySelector(`input[name="question_${index}"]:checked`);
                if (selectedInput && selectedInput.value === q.correct_answer) {
                    score++;
                }
            });
            
            showResults(score, currentQuizData.questions.length);
        }
    });

    function showResults(score, total) {
        document.getElementById('score-text').textContent = `${score} / ${total}`;
        const percentage = score / total;
        const msgEl = document.getElementById('score-message');
        
        if (percentage === 1) {
            msgEl.textContent = translations[currentLang].msg_perfect;
        } else if (percentage >= 0.7) {
            msgEl.textContent = translations[currentLang].msg_great;
        } else if (percentage >= 0.5) {
            msgEl.textContent = translations[currentLang].msg_good;
        } else {
            msgEl.textContent = translations[currentLang].msg_try;
        }
        
        showSection(resultsSection);
        window.scrollTo(0, 0);
    }
    
    restartBtn.addEventListener('click', () => {
        form.reset();
        submitBtn.textContent = translations[currentLang].btn_submit;
        showSection(setupSection);
    });
    
    // Initialize UI language
    updateUI();
});
