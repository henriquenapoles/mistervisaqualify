// Estado Global
let currentQ = 0;
let formData = {};
let totalScore = 0;
const TOTAL_QUESTIONS = 18;
const WEBHOOK_URL = 'https://n8n.stratia.app.br/webhook-test/650b310d-cd0b-465a-849d-7c7a3991572e';

// Atualizar Progresso
function updateProgress() {
    const progress = ((currentQ + 1) / TOTAL_QUESTIONS) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Pergunta ${currentQ + 1} de ${TOTAL_QUESTIONS}`;
}

// Atualizar Score
function updateScore(points) {
    totalScore += points;
    document.getElementById('scoreValue').textContent = totalScore;
}

// Mostrar Comentário
function showComment(text) {
    if (!text) return;
    const balloon = document.querySelector('.question.active .comment-balloon');
    balloon.textContent = text;
    balloon.classList.add('show');
    setTimeout(() => balloon.classList.remove('show'), 3500);
}

// Resposta Simples
function answer(field, value, points, comment) {
    formData[field] = value;
    updateScore(points);
    showComment(comment);
    
    // Marca seleção visual
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Auto-avança após comentário
    setTimeout(() => nextQ(), comment ? 2000 : 500);
}

// Mostrar campo "Outro"
function showOther(field, points, comment) {
    const input = document.getElementById(field + '_outro');
    input.style.display = 'block';
    input.focus();
    formData[field] = 'outro';
    updateScore(points);
    showComment(comment);
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
}

// Mostrar form Cônjuge
function showSpouse(value, comment) {
    formData.maritalStatus = value;
    document.getElementById('spouseForm').style.display = 'block';
    showComment(comment);
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
}

// Mostrar form Filhos
function showChildren(comment) {
    formData.hasChildren = 'sim';
    document.getElementById('childrenForm').style.display = 'block';
    showComment(comment);
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
}

// Validar Tela Atual
function validateCurrentQ() {
    const q = document.querySelector(`.question[data-q="${currentQ}"]`);
    
    // Tela 2: Dados Pessoais
    if (currentQ === 2) {
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const birth = document.getElementById('birthDate').value;
        const country = document.getElementById('country').value;
        
        if (!name || !email || !phone || !birth || !country) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return false;
        }
        
        formData.fullName = name;
        formData.email = email;
        formData.phone = phone;
        formData.birthDate = birth;
        formData.country = country;
        
        if (country === 'outro') {
            formData.countryOther = document.getElementById('country_outro').value;
        }
        
        return true;
    }
    
    // Tela 3: Estado Civil com cônjuge
    if (currentQ === 3) {
        if (formData.maritalStatus === 'casado' || formData.maritalStatus === 'uniao') {
            const spouseName = document.getElementById('spouseName').value.trim();
            if (spouseName) {
                formData.spouse = {
                    name: spouseName,
                    age: document.getElementById('spouseAge').value,
                    education: document.getElementById('spouseEducation').value,
                    details: document.getElementById('spouseDetails').value.trim()
                };
            }
        }
        return formData.maritalStatus ? true : false;
    }
    
    // Tela 4: Filhos
    if (currentQ === 4) {
        if (formData.hasChildren === 'sim') {
            const count = document.getElementById('childrenCount').value;
            if (count) {
                formData.children = {
                    count: count,
                    ages: document.getElementById('childrenAges').value,
                    details: document.getElementById('childrenDetails').value.trim()
                };
            }
        }
        return formData.hasChildren ? true : false;
    }
    
    // Tela 8: Detalhes Educação
    if (currentQ === 8) {
        const year = document.getElementById('graduationYear').value;
        const inst = document.getElementById('institution').value.trim();
        const field = document.getElementById('fieldOfStudy').value.trim();
        
        if (year) formData.graduationYear = year;
        if (inst) formData.institution = inst;
        if (field) formData.fieldOfStudy = field;
        
        return true; // Opcional
    }
    
    // Tela 12: Cargo Atual
    if (currentQ === 12) {
        const job = document.getElementById('currentJob').value.trim();
        if (job) formData.currentJob = job;
        return true; // Opcional
    }
    
    return true;
}

// Avançar Pergunta
function nextQ() {
    if (!validateCurrentQ()) return;
    
    // Enviar dados parciais
    sendWebhook();
    
    if (currentQ < TOTAL_QUESTIONS - 1) {
        document.querySelector('.question.active').classList.remove('active');
        currentQ++;
        document.querySelector(`.question[data-q="${currentQ}"]`).classList.add('active');
        updateProgress();
        
        // Mostrar/ocultar botão voltar
        document.getElementById('btnBack').style.display = currentQ > 0 ? 'block' : 'none';
        
        // Scroll to top
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    } else {
        finishForm();
    }
}

// Voltar Pergunta
function prevQ() {
    if (currentQ > 0) {
        document.querySelector('.question.active').classList.remove('active');
        currentQ--;
        document.querySelector(`.question[data-q="${currentQ}"]`).classList.add('active');
        updateProgress();
        
        document.getElementById('btnBack').style.display = currentQ > 0 ? 'block' : 'none';
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    }
}

// Enviar Webhook
function sendWebhook(isComplete = false) {
    const payload = {
        formData: formData,
        totalScore: totalScore,
        timestamp: new Date().toISOString(),
        source: 'visaqualify-static',
        currentQuestion: currentQ + 1,
        totalQuestions: TOTAL_QUESTIONS,
        status: isComplete ? 'COMPLETO' : 'INCOMPLETO',
        completionPercentage: Math.round(((currentQ + 1) / TOTAL_QUESTIONS) * 100)
    };
    
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => console.log('Webhook error:', err));
}

// Finalizar Formulário
function finishForm() {
    // Enviar webhook COMPLETO
    sendWebhook(true);
    
    // Salvar no localStorage
    localStorage.setItem('visaScore', totalScore);
    localStorage.setItem('visaFormData', JSON.stringify(formData));
    
    // Redirecionar para results
    window.location.href = `results.html?score=${totalScore}`;
}

// Event Listeners
document.getElementById('country').addEventListener('change', function() {
    document.getElementById('country_outro').style.display = this.value === 'outro' ? 'block' : 'none';
});

// Inicializar
updateProgress();