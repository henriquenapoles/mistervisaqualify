// VisaQualify - Formulário Estático Completo
// Webhook e Configurações
const WEBHOOK_URL = 'https://n8n.stratia.app.br/webhook-test/650b310d-cd0b-465a-849d-7c7a3991572e';
const TOTAL_QUESTIONS = 18;

// Estado do formulário
let currentQuestion = 0;
let formData = {};
let totalScore = 0;
let showingComment = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('VisaQualify iniciado!');
});

// Função para mostrar comentário animado
function showComment(text) {
    const commentBalloon = document.getElementById('commentBalloon');
    const commentText = document.getElementById('commentText');
    
    commentText.textContent = text;
    commentBalloon.classList.add('show');
    
    setTimeout(() => {
        commentBalloon.classList.remove('show');
    }, 4000);
}

// Função para avançar pergunta
function nextQuestion() {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
        currentQuestion++;
        updateProgress();
        showQuestion(currentQuestion);
    }
}

// Função para voltar pergunta
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateProgress();
        showQuestion(currentQuestion);
    }
}

// Atualizar barra de progresso
function updateProgress() {
    const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Pergunta ${currentQuestion + 1} de ${TOTAL_QUESTIONS}`;
}

// Atualizar pontuação
function updateScore(points) {
    totalScore += points;
    document.getElementById('scoreValue').textContent = totalScore;
}

// Enviar para webhook
async function sendToWebhook(data) {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'visaqualify-static'
            })
        });
        
        console.log('Dados enviados:', response.ok ? 'Sucesso!' : 'Falhou');
    } catch (error) {
        console.error('Erro ao enviar webhook:', error);
    }
}

// Função para submeter formulário final
function submitForm() {
    const results = {
        formData: formData,
        totalScore: totalScore,
        timestamp: new Date().toISOString()
    };
    
    sendToWebhook(results);
    showResults();
}

// Mostrar tela de resultados
function showResults() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('finalScore').textContent = totalScore;
}

console.log('App.js carregado!');
