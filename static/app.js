// Configuração
const WEBHOOK_URL = 'https://n8n.stratia.app.br/webhook-test/650b310d-cd0b-465a-849d-7c7a3991572e';
const TOTAL_STEPS = 14;

// Estado do formulário
let currentStep = 1;
let formData = {};

// Elementos DOM
const form = document.getElementById('visaForm');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const steps = document.querySelectorAll('.step');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateProgress();
});

// Event Listeners
function setupEventListeners() {
    // Botões de navegação
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => nextStep());
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => prevStep());
    });

    // Submit do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm();
    });

    // Auto-avanço para radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            setTimeout(() => nextStep(), 500);
        });
    });
}

// Navegação
function nextStep() {
    const currentStepElement = document.querySelector(`.step[data-step="${currentStep}"]`);
    
    // Validar campos obrigatórios
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = currentStepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) isValid = false;
        } else if (!input.value) {
            isValid = false;
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });

    if (!isValid) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Salvar dados do step atual
    saveStepData(currentStepElement);

    // Enviar dados parciais para webhook
    sendPartialData();

    // Avançar para próximo step
    if (currentStep < TOTAL_STEPS) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    const stepElement = document.querySelector(`.step[data-step="${step}"]`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
}

function updateProgress() {
    const progress = (currentStep / TOTAL_STEPS) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Etapa ${currentStep} de ${TOTAL_STEPS}`;
}

// Gerenciamento de dados
function saveStepData(stepElement) {
    const inputs = stepElement.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
}

// Sistema de pontuação
function calculateScore() {
    let score = 0;

    // Capital disponível
    const capitalScores = {
        'menos-100k': 5,
        '100k-500k': 10,
        '500k-800k': 15,
        'mais-800k': 20
    };
    score += capitalScores[formData.capital] || 0;

    // Formação acadêmica
    const educationScores = {
        'ensino-medio': 5,
        'graduacao': 10,
        'pos-graduacao': 15,
        'mestrado-doutorado': 20
    };
    score += educationScores[formData.education] || 0;

    // Experiência profissional
    const experienceScores = {
        '0-2': 5,
        '3-5': 10,
        '6-10': 15,
        'mais-10': 20
    };
    score += experienceScores[formData.experience] || 0;

    // Nível de inglês
    const englishScores = {
        'basico': 5,
        'intermediario': 10,
        'avancado': 15,
        'fluente': 20
    };
    score += englishScores[formData.english] || 0;

    // Bônus
    if (formData.familyInUS === 'sim') score += 10;
    if (formData.jobOffer === 'sim') score += 15;
    if (formData.companyTransfer === 'sim') score += 15;

    return score;
}

// Recomendações de visto
function getVisaRecommendations(score) {
    const recommendations = [];

    if (formData.capital === 'mais-800k') {
        recommendations.push({
            name: 'EB-5 (Investidor)',
            description: 'Você possui capital suficiente para o visto de investidor EB-5. Invista $800k+ e obtenha Green Card.'
        });
    }

    if (formData.jobOffer === 'sim' && score >= 50) {
        recommendations.push({
            name: 'H1-B (Trabalho Especializado)',
            description: 'Com oferta de trabalho e suas qualificações, você é elegível para o visto H1-B.'
        });
    }

    if (formData.companyTransfer === 'sim') {
        recommendations.push({
            name: 'L-1 (Transferência)',
            description: 'Você pode se qualificar para transferência interna com visto L-1.'
        });
    }

    if (formData.objective === 'estudar') {
        recommendations.push({
            name: 'F-1 (Estudante)',
            description: 'O visto de estudante F-1 é uma excelente opção para você.'
        });
    }

    if (formData.familyInUS === 'sim') {
        recommendations.push({
            name: 'Visto de Família',
            description: 'Com família nos EUA, você pode se qualificar para reunificação familiar.'
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            name: 'Consulta Personalizada',
            description: 'Sua situação requer análise detalhada. Vamos entrar em contato para orientá-lo melhor.'
        });
    }

    return recommendations;
}

// Envio de dados
async function sendPartialData() {
    try {
        const payload = {
            formId: generateFormId(),
            formType: 'partial',
            currentStep: currentStep,
            ...formData,
            timestamp: new Date().toISOString()
        };

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error('Erro ao enviar dados parciais:', error);
    }
}

async function submitForm() {
    const score = calculateScore();
    const recommendations = getVisaRecommendations(score);

    // Enviar dados completos
    try {
        const payload = {
            formId: generateFormId(),
            formType: 'complete',
            ...formData,
            totalScore: score,
            visaRecommendations: recommendations.map(r => r.name),
            timestamp: new Date().toISOString()
        };

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Mostrar resultados
        showResults(score, recommendations);
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Erro ao enviar formulário. Por favor, tente novamente.');
    }
}

function showResults(score, recommendations) {
    // Esconder step atual
    steps.forEach(s => s.classList.remove('active'));

    // Mostrar tela de resultados
    const resultsStep = document.querySelector('.results');
    resultsStep.style.display = 'block';
    resultsStep.classList.add('active');

    // Atualizar pontuação
    document.getElementById('scoreNumber').textContent = score;

    // Atualizar recomendações
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <h3>${rec.name}</h3>
            <p>${rec.description}</p>
        </div>
    `).join('');

    // Atualizar progresso
    progressBar.style.width = '100%';
    progressText.textContent = 'Concluído!';
}

// Utilitários
function generateFormId() {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
