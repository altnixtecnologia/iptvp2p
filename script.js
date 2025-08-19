document.addEventListener('DOMContentLoaded', () => {
const openFaqChatBtn = document.getElementById('openFaqChat');
const closeFaqChatBtn = document.getElementById('closeFaqChat');
const faqChatPopup = document.getElementById('faqChatPopup');
const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendMessageBtn = document.getElementById('sendMessage');

// Mapeamento de respostas para as perguntas frequentes
const faqAnswers = {
    "como-instalar": "Para instalar, você precisa de um aplicativo compatível (Smart IPTV, IPTV Smarters, etc.) e sua lista de reprodução (m3u) que enviaremos após a contratação. Temos um tutorial completo disponível!",
    "canais": "Oferecemos milhares de canais, incluindo esportes, filmes, séries, noticiários e muito mais. A lista exata pode variar, mas sempre buscamos a maior variedade e qualidade.",
    "precos": "Temos planos mensais a partir de R$ 30,00 e planos anuais com desconto. Confira a seção 'Nossos Planos' para mais detalhes!",
    "teste": "Sim, oferecemos um teste grátis de 2 horas! Entre em contato conosco pelo WhatsApp para solicitar o seu.",
    "suporte": "Entendido! Para suporte humano, por favor, clique no botão do WhatsApp e nossa equipe irá te atender o mais rápido possível."
};

// Função para adicionar mensagem ao chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Lógica para abrir o popup do chat
openFaqChatBtn.addEventListener('click', () => {
    faqChatPopup.classList.add('active');
    userInput.disabled = true;
    sendMessageBtn.disabled = true;
});

// Lógica para fechar o popup do chat
closeFaqChatBtn.addEventListener('click', () => {
    faqChatPopup.classList.remove('active');
});

// Lógica para lidar com as opções de FAQ
chatBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('faq-option')) {
        const questionKey = event.target.dataset.question;
        const questionText = event.target.textContent;

        addMessage(questionText, 'user');
        setTimeout(() => {
            const answer = faqAnswers[questionKey] || "Desculpe, não entendi sua pergunta. Por favor, tente reformular ou entre em contato via WhatsApp.";
            addMessage(answer, 'bot');

            if (questionKey === "suporte") {
                userInput.disabled = true;
                sendMessageBtn.disabled = true;
            }
        }, 500);
    }
});

// (Opcional) Lógica para enviar mensagem do usuário (atualmente desabilitada para focar nas opções de FAQ)
// Se quiser habilitar, remova `disabled` do input e do botão no HTML e adicione o código abaixo:
/*
sendMessageBtn.addEventListener('click', () => {
    const userText = userInput.value.trim();
    if (userText) {
        addMessage(userText, 'user');
        userInput.value = '';
        setTimeout(() => {
            addMessage("Desculpe, no momento meu atendimento é baseado nas opções pré-definidas. Para outras dúvidas, por favor, use nosso WhatsApp.", 'bot');
        }, 500);
    }
});

userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessageBtn.click();
    }
});
*/
});
```
