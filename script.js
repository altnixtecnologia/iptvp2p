document.addEventListener('DOMContentLoaded', function() {
    getRealMatches();
    setupChat();
});

// =========================================================================
// LÓGICA DA API DE FUTEBOL
// =========================================================================
async function getRealMatches() {
    // Insira sua chave de API aqui. Apenas a chave, dentro das aspas.
    const apiKey = 'e32f3474261d4ee387d09471e2808205';

    // Esta verificação garante que a chave foi alterada.
    if (apiKey === 'e32f3474261d4ee387d09471e2808205') {
        document.getElementById('football-title').innerText = 'Insira a Chave da API no script.js';
        return; // Para a execução se a chave não foi inserida
    }

    const matchListContainer = document.getElementById('match-list-dynamic');
    const footballTitle = document.getElementById('football-title');
    matchListContainer.innerHTML = '<p style="color: #fff;">Buscando jogos de hoje...</p>';

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    footballTitle.innerText = `Jogos do Dia - ${dd}/${mm}/${yyyy}`;
    const apiUrl = `https://api.football-data.org/v4/matches?date=${formattedDate}`;
    const desiredCompetitions = ['BSA', 'CL', 'CLI'];

    try {
        const response = await fetch(apiUrl, { headers: { 'X--Auth-Token': apiKey } });
        const data = await response.json();
        const filteredMatches = data.matches.filter(match => desiredCompetitions.includes(match.competition.code));
        
        if (filteredMatches.length === 0) {
            matchListContainer.innerHTML = '<p style="color: #fff;">Nenhum jogo das ligas principais (Série A, Champions, Libertadores) agendado para hoje.</p>';
            return;
        }

        matchListContainer.innerHTML = '';
        filteredMatches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            const matchTime = new Date(match.utcDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
            matchElement.innerHTML = `<span class="championship">${match.competition.name}</span><span class="teams">${match.homeTeam.name} vs ${match.awayTeam.name}</span><span class="time">Hoje - ${matchTime}</span>`;
            matchListContainer.appendChild(matchElement);
        });
    } catch (error) {
        console.error('Erro ao buscar os jogos:', error);
        footballTitle.innerText = 'Agenda de Jogos';
        matchListContainer.innerHTML = '<p style="color: #ffcccc;">Não foi possível carregar a agenda. Verifique sua chave de API.</p>';
    }
}

// =========================================================================
// LÓGICA DO CHAT DE DÚVIDAS
// =========================================================================
function setupChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    const faqs = {
        'pagamento': { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX e Cartão de Crédito. O pagamento é feito de forma 100% segura e a liberação é imediata.' },
        'como_funciona': { q: 'Como funciona o serviço?', a: 'Após a assinatura, você recebe um usuário e senha para acessar nosso aplicativo exclusivo em sua TV Smart, Celular ou TV Box.' },
        'teste': { q: 'Posso fazer um teste grátis?', a: 'Sim! Oferecemos um teste gratuito para você conhecer nosso serviço sem compromisso. Chame um de nossos atendentes no WhatsApp para solicitar.' },
        'atendente': { q: 'Falar com um atendente', a: 'Claro! Clique aqui para ser direcionado ao nosso WhatsApp: <a href="https://wa.me/5548991004780?text=Olá!%20Vim%20pelo%20chat%20do%20site%20e%20preciso%20de%20ajuda." target="_blank">Iniciar Conversa</a>' }
    };
    if (!chatToggle) return; // Adiciona uma verificação para segurança
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
    addMessage('Olá! Sou seu assistente virtual. Como posso te ajudar hoje?', 'bot');
    showOptions();
}
