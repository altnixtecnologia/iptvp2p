document.addEventListener('DOMContentLoaded', function() {
    setupChat();
});

function setupChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    if (!chatToggle || !chatWidget || !closeChat) { return; }
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    const faqs = {
        'pagamento': { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX e Cartão de Crédito.' },
        'como_funciona': { q: 'Como funciona o serviço?', a: 'Você recebe um usuário e senha para acessar nosso aplicativo exclusivo.' },
        'teste': { q: 'Posso fazer um teste grátis?', a: 'Sim! Chame um de nossos atendentes no WhatsApp para solicitar.' },
        'atendente': { q: 'Falar com um atendente', a: 'Claro! Clique aqui para ir para o WhatsApp: <a href="https://wa.me/5548991004780?text=Olá!%20Preciso%20de%20ajuda." target="_blank">Iniciar Conversa</a>' }
    };
    chatToggle.addEventListener('click', () => chatWidget.style.display = 'flex');
    closeChat.addEventListener('click', () => chatWidget.style.display = 'none');
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.innerHTML = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    function showOptions() {
        optionsContainer.innerHTML = '';
        for (const key in faqs) {
            const button = document.createElement('button');
            button.innerText = faqs[key].q;
            button.dataset.key = key;
            button.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(button);
        }
    }
    function handleOptionClick(event) {
        const key = event.target.dataset.key;
        addMessage(faqs[key].q, 'user');
        setTimeout(() => { addMessage(faqs[key].a, 'bot'); }, 500);
    }
    addMessage('Olá! Sou seu assistente virtual. Como posso te ajudar?', 'bot');
    showOptions();
}
