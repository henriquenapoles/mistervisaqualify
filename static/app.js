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

// Esconder subformulários e campos extras
function hideSubForms() {
    // Esconder campos "outro"
    const otherFields = document.querySelectorAll('.question.active input[id$="_outro"]');
    otherFields.forEach(field => field.style.display = 'none');
    
    // Esconder campo indicação
    const indicacaoField = document.getElementById('source_indicacao');
    if (indicacaoField) indicacaoField.style.display = 'none';
    
    // Esconder subform cônjuge
    const spouseForm = document.getElementById('spouseForm');
    if (spouseForm) spouseForm.style.display = 'none';
    
    // Esconder subform filhos
    const childrenForm = document.getElementById('childrenForm');
    if (childrenForm) childrenForm.style.display = 'none';
}

// Resposta Simples - SEM auto-avanço
function answer(field, value, points, comment) {
    formData[field] = value;
    updateScore(points);
    showComment(comment);
    
    // Marca seleção visual
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Esconder todos os subformulários e campos extras da tela atual
    hideSubForms();
    
    // Habilitar botão Next
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.style.display = 'block';
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Mostrar campo "Outro"
function showOther(field, points, comment) {
    // Esconder outros subforms primeiro
    hideSubForms();
    
    const input = document.getElementById(field + '_outro');
    input.style.display = 'block';
    input.focus();
    formData[field] = 'outro';
    updateScore(points);
    showComment(comment);
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Habilitar botão Next
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Mostrar campo Indicação
function showIndicacao() {
    const input = document.getElementById('source_indicacao');
    input.style.display = 'block';
    input.focus();
    formData.source = 'indicacao';
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Habilitar botão Next
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Mostrar campo Outro (Origem)
function showSourceOutro() {
    const input = document.getElementById('source_outro');
    input.style.display = 'block';
    input.focus();
    formData.source = 'outro';
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Habilitar botão Next
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Mostrar form Cônjuge
function showSpouse(value, comment) {
    formData.maritalStatus = value;
    document.getElementById('spouseForm').style.display = 'block';
    showComment(comment);
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Habilitar botão Next
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Mostrar form Filhos
function showChildren(comment) {
    formData.hasChildren = 'sim';
    document.getElementById('childrenForm').style.display = 'block';
    showComment(comment);
    
    document.querySelectorAll('.question.active .option-card').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Habilitar botão Next
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Validar Email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar Telefone (mínimo 10 dígitos)
function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
}

// Validar Ano (1950-ano atual)
function isValidYear(year) {
    const y = parseInt(year);
    const currentYear = new Date().getFullYear();
    return y >= 1950 && y <= currentYear;
}

// Validar Idade (18-100 anos)
function isValidBirthDate(date) {
    const birth = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 18 && age <= 100;
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
        
        if (!isValidEmail(email)) {
            alert('Por favor, insira um email válido (ex: seunome@email.com)');
            return false;
        }
        
        if (!isValidPhone(phone)) {
            alert('Por favor, insira um telefone válido com DDD (mínimo 10 dígitos)');
            return false;
        }
        
        if (!isValidBirthDate(birth)) {
            alert('Idade deve estar entre 18 e 100 anos');
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
    
    // Tela 6: Origem Contato
    if (currentQ === 6) {
        if (formData.source === 'indicacao') {
            const indicacao = document.getElementById('source_indicacao').value.trim();
            if (indicacao) formData.sourceIndicacao = indicacao;
        } else if (formData.source === 'outro') {
            const outro = document.getElementById('source_outro').value.trim();
            if (outro) formData.sourceOutro = outro;
        }
        return formData.source ? true : false;
    }
    
    // Tela 8: Detalhes Educação
    if (currentQ === 8) {
        const year = document.getElementById('graduationYear').value;
        const inst = document.getElementById('institution').value.trim();
        const field = document.getElementById('fieldOfStudy').value.trim();
        
        if (year && !isValidYear(year)) {
            const currentYear = new Date().getFullYear();
            alert(`Por favor, insira um ano válido entre 1950 e ${currentYear}`);
            return false;
        }
        
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
        
        // Mostrar/ocultar botões
        const btnBack = document.getElementById('btnBack');
        const btnNext = document.getElementById('btnNext');
        
        if (btnBack) btnBack.style.display = currentQ > 0 ? 'block' : 'none';
        
        // Desabilitar botão Next (será habilitado quando clicar em opção ou preencher campos)
        if (btnNext) {
            btnNext.disabled = true;
            btnNext.style.opacity = '0.5';
        }
        
        // Scroll to top suave
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const percentComplete = Math.round(((currentQ + 1) / TOTAL_QUESTIONS) * 100);
    
    const payload = {
        formData: formData,
        totalScore: totalScore,
        timestamp: new Date().toISOString(),
        source: 'visaqualify-static',
        currentQuestion: currentQ + 1,
        totalQuestions: TOTAL_QUESTIONS,
        formCompleted: isComplete,
        formStatus: isComplete ? 'COMPLETO' : 'INCOMPLETO',
        completionPercentage: percentComplete,
        progressInfo: {
            completed: isComplete,
            currentStep: currentQ + 1,
            totalSteps: TOTAL_QUESTIONS,
            percentComplete: percentComplete
        }
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

// Validação em tempo real para tela de Dados Pessoais
function validateDadosPessoais() {
    if (currentQ !== 2) return;
    
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const birth = document.getElementById('birthDate').value;
    const country = document.getElementById('country').value;
    
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const birthField = document.getElementById('birthDate');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const birthError = document.getElementById('birthError');
    
    // Validar Email
    let emailValid = true;
    if (email && !isValidEmail(email)) {
        emailError.textContent = '❌ Email inválido (ex: nome@email.com)';
        emailField.classList.add('error');
        emailValid = false;
    } else {
        emailError.textContent = '';
        emailField.classList.remove('error');
    }
    
    // Validar Telefone
    let phoneValid = true;
    if (phone && !isValidPhone(phone)) {
        phoneError.textContent = '❌ Telefone inválido (mín. 10 dígitos)';
        phoneField.classList.add('error');
        phoneValid = false;
    } else {
        phoneError.textContent = '';
        phoneField.classList.remove('error');
    }
    
    // Validar Data Nascimento
    let birthValid = true;
    if (birth && !isValidBirthDate(birth)) {
        birthError.textContent = '❌ Idade deve estar entre 18 e 100 anos';
        birthField.classList.add('error');
        birthValid = false;
    } else {
        birthError.textContent = '';
        birthField.classList.remove('error');
    }
    
    const btnNext = document.getElementById('btnNext');
    if (!btnNext) return;
    
    const isValid = name && email && phone && birth && country &&
                   emailValid && phoneValid && birthValid;
    
    btnNext.disabled = !isValid;
    btnNext.style.opacity = isValid ? '1' : '0.5';
}

// Habilitar botão em telas de formulário opcional
function enableNextOnInput() {
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
    }
}

// Inicializar botões
document.addEventListener('DOMContentLoaded', () => {
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');
    
    // Botão Next sempre visível, mas inicialmente desabilitado
    if (btnNext) {
        btnNext.style.display = 'block';
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';
    }
    if (btnBack) btnBack.style.display = 'none';
    
    // Adicionar listeners para validação em tempo real (tela 2 - Dados Pessoais)
    const fieldsToWatch = ['fullName', 'email', 'phone', 'birthDate', 'country'];
    fieldsToWatch.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', validateDadosPessoais);
            field.addEventListener('change', validateDadosPessoais);
        }
    });
    
    // Habilitar botão em telas de formulário opcional (tela 9 - Detalhes Educação)
    const optionalFields = ['graduationYear', 'institution', 'fieldOfStudy', 'currentJob'];
    optionalFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', enableNextOnInput);
            field.addEventListener('focus', enableNextOnInput);
        }
    });
});