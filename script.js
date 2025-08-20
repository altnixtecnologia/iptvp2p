// Este código agora roda em todas as páginas e decide o que fazer.
document.addEventListener('DOMContentLoaded', function() {
    // Se encontrar o elemento da página inicial, busca os jogos de HOJE.
    if (document.getElementById('match-list-dynamic')) {
        getRapidApiMatches(); 
    }

    // Se encontrar o elemento da página de resultados, busca os resultados de ONTEM.
    if (document.getElementById('results-list-dynamic')) {
        getRapidApiResults();
    }
    
    // O chat de dúvidas funciona em todas as páginas.
    setupChat();
});


// FUNÇÃO PARA BUSCAR JOGOS DO DIA (PÁGINA INICIAL)
async function getRapidApiMatches() {
    // A variável foi renomeada para 'keyapi' como solicitado.
    const keyapi = 'SSOpjvhT8h3CFzJUIcvfPNQvTo4q5HJGmVyfxAwdOsptco7cwsz8IxYHuGh5';

    if (keyapi === 'SSOpjvhT8h3CFzJUIcvfPNQvTo4q5HJGmVyfxAwdOsptco7cwsz8IxYHuGh5') {
        document.getElementById('football-title').innerText = 'Insira sua chave da KeyAPI no script.js';
        return;
    }

    const matchListContainer = document.getElementById('match-list-dynamic');
    const footballTitle = document.getElementById('football-title');

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    footballTitle.innerText = `Jogos do Dia - ${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    
    const apiUrl = `https://wosti-futebol-tv-brasil.p.rapidapi.com/api/Matches/date/${formattedDate}`;

    try {
        const response = await fetch(apiUrl, { headers: { 'x-rapidapi-host': 'wosti-futebol-tv-brasil.p.rapidapi.com', 'x-rapidapi-key': keyapi } }); // Usando 'keyapi' aqui
        const responseData = await response.json();
        const matches = responseData.matches || responseData; 
        if (!response.ok) { throw new Error(matches.message || 'Erro na API.'); }
        if (matches.length === 0) { matchListContainer.innerHTML = '<p style="color: #fff;">Nenhum jogo encontrado para hoje.</p>'; return; }

        matchListContainer.innerHTML = '';
        matches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            matchElement.innerHTML = `<span class="championship">${match.championship || 'Campeonato'}</span><span class="teams">${match.homeTeam || 'Time Casa'} vs ${match.awayTeam || 'Time Visitante'}</span><span class="time">Hoje - ${match.matchTime || 'Horário'}</span>`;
            matchListContainer.appendChild(matchElement);
        });
    } catch (error) {
        console.error('Erro ao buscar os jogos:', error);
        matchListContainer.innerHTML = `<p style="color: #ffcccc;">Não foi possível carregar os jogos. Erro: ${error.message}</p>`;
    }
}


// NOVA FUNÇÃO PARA BUSCAR RESULTADOS DO DIA ANTERIOR (PÁGINA DE RESULTADOS)
async function getRapidApiResults() {
    // A variável foi renomeada para 'keyapi' como solicitado.
    const keyapi = 'COLE_AQUI_SUA_NOVA_CHAVE_DA_RAPIDAPI';

    if (keyapi === 'COLE_AQUI_SUA_NOVA_CHAVE_DA_RAPIDAPI') {
        document.getElementById('results-title').innerText = 'Insira sua chave da RapidAPI no script.js';
        return;
    }

    const resultsListContainer = document.getElementById('results-list-dynamic');
    const resultsTitle = document.getElementById('results-title');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    resultsTitle.innerText = `Resultados de Ontem - ${String(yesterday.getDate()).padStart(2, '0')}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${yesterday.getFullYear()}`;

    const apiUrl = `https://wosti-futebol-tv-brasil.p.rapidapi.com/api/Matches/date/${formattedDate}`;

    try {
        const response = await fetch(apiUrl, { headers: { 'x-rapidapi-host': 'wosti-futebol-tv-brasil.p.rapidapi.com', 'x-rapidapi-key': keyapi } }); // Usando 'keyapi' aqui
        const responseData = await response.json();
        const matches = responseData.matches || responseData;
        if (!response.ok) { throw new Error(matches.message || 'Erro na API.'); }
        if (matches.length === 0) { resultsListContainer.innerHTML = '<p style="color: #fff;">Nenhum resultado encontrado para ontem.</p>'; return; }

        resultsListContainer.innerHTML = '';
        matches.forEach(match => {
            const homeScore = match.homeScore !== undefined ? match.homeScore : '-';
            const awayScore = match.awayScore !== undefined ? match.awayScore : '-';
            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            matchElement.innerHTML = `<span class="championship">${match.championship || 'Campeonato'}</span><span class="teams">${match.homeTeam || 'Time Casa'} <strong>${homeScore} x ${awayScore}</strong> ${match.awayTeam || 'Time Visitante'}</span><span class="time">Finalizado</span>`;
            resultsListContainer.appendChild(matchElement);
        });
    } catch (error) {
        console.error('Erro ao buscar os resultados:', error);
        resultsListContainer.innerHTML = `<p style="color: #ffcccc;">Não foi possível carregar os resultados. Erro: ${error.message}</p>`;
    }
}


// LÓGICA DO CHAT DE DÚVIDAS (Continua a mesma)
function setupChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    const faqs = {
        'pagamento': { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX e Cartão de Crédito.' },
        'como_funciona': { q: 'Como funciona o serviço?', a: 'Você recebe um usuário e senha para acessar nosso aplicativo em sua TV Smart, Celular ou TV Box.' },
        'teste': { q: 'Posso fazer um teste grátis?', a: 'Sim! Chame um de nossos atendentes no WhatsApp para solicitar.' },
        'atendente': { q: 'Falar com um atendente', a: 'Claro! Clique aqui para ir para o WhatsApp: <a href="https://wa.me/5548991004780?text=Olá!%20Preciso%20de%20ajuda." target="_blank">Iniciar Conversa</a>' }
    };
    if (!chatToggle) return;
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
