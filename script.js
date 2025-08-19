document.addEventListener('DOMContentLoaded', () => {
const openFaqChatBtn = document.getElementById('openFaqChat');
const closeFaqChatBtn = document.getElementById('closeFaqChat');
const faqChatPopup = document.getElementById('faqChatPopup');
const chatBody = document.getElementById('chatBody');

// Mapeamento de respostas para as perguntas frequentes
const faqAnswers = {
    "como-instalar": "Para instalar, você precisa de um aplicativo compatível (Smart IPTV, IPTV Smarters, etc.) e sua lista de reprodução (m3u) que enviaremos após a contratação. Temos um tutorial completo disponível!",
    "canais": "Oferecemos milhares de canais, incluindo esportes, filmes, séries, noticiários e muito mais. A lista exata pode variar, mas sempre buscamos a maior variedade e qualidade.",
    "precos": "Temos planos mensais a partir de R$ 30,00 e planos anuais com desconto. Confira a seção 'Nossos Planos' para mais detalhes!",
    "teste": "Sim, oferecemos um teste grátis de 2 horas! Entre em contato conosco pelo WhatsApp para solicitar o seu.",
    "suporte": "Entendido! Para suporte humano, por favor, clique no botão do WhatsApp e nossa equipe irá te atender o mais rápido possível."
};

// Lógica para abrir o popup do chat
openFaqChatBtn.addEventListener('click', () => {
    faqChatPopup.classList.add('active');
});

// Lógica para fechar o popup do chat
closeFaqChatBtn.addEventListener('click', () => {
    faqChatPopup.classList.remove('active');
});

// Função para adicionar mensagem ao chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Lógica para lidar com as opções de FAQ
chatBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('faq-option')) {
        const questionKey = event.target.dataset.question;
        const questionText = event.target.textContent;

        addMessage(questionText, 'user');
        setTimeout(() => {
            const answer = faqAnswers[questionKey] || "Desculpe, não entendi sua pergunta. Por favor, tente reformular ou entre em contato via WhatsApp.";
            addMessage(answer, 'bot');
        }, 500);
    }
});
});
