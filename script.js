// Este código agora roda em todas as páginas e decide o que fazer.
document.addEventListener('DOMContentLoaded', function() {
    // Se encontrar o elemento da página inicial, busca os jogos de HOJE.
    if (document.getElementById('match-list-dynamic')) {
        getSportMonksMatches(); 
    }

    // Se encontrar o elemento da página de resultados, busca os resultados de ONTEM.
    if (document.getElementById('results-list-dynamic')) {
        getSportMonksResults();
    }
    
    // O chat de dúvidas funciona em todas as páginas.
    setupChat();
});


// FUNÇÃO PARA BUSCAR JOGOS DO DIA COM A SPORTMONKS
async function getSportMonksMatches() {
    // Insira seu API Token da SportMonks aqui
    const sportmonksApiToken = 'COLE_AQUI_SEU_API_TOKEN_DA_SPORTMONKS';

    if (sportmonksApiToken === 'COLE_AQUI_SEU_API_TOKEN_DA_SPORTMONKS') {
        document.getElementById('football-title').innerText = 'Insira seu API Token da SportMonks no script.js';
        return;
    }

    const matchListContainer = document.getElementById('match-list-dynamic');
    const footballTitle = document.getElementById('football-title');

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    footballTitle.innerText = `Jogos do Dia - ${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    
    // Montagem da URL no formato da SportMonks
    const apiUrl = `https://api.sportmonks.com/v3/football/fixtures/date/${formattedDate}?api_token=${sportmonksApiToken}&include=league,participants&tz=America/Sao_Paulo`;

    try {
        const response = await fetch(apiUrl); // Headers não são necessários para a autenticação
        const data = await response.json();

        if (!response.ok) { throw new Error(data.message || 'Erro na API da SportMonks.'); }
        if (data.data.length === 0) { matchListContainer.innerHTML = '<p style="color: #fff;">Nenhum jogo encontrado para hoje.</p>'; return; }

        matchListContainer.innerHTML = '';
        data.data.forEach(match => {
            // A SportMonks usa um array 'participants' para os times. Precisamos identificar quem é casa e quem é visitante.
            const homeTeam = match.participants.find(p => p.meta.location === 'home');
            const awayTeam = match.participants.find(p => p.meta.location === 'away');
            
            // Pega a hora do jogo já convertida pelo parâmetro tz=America/Sao_Paulo
            const matchTime = new Date(match.starting_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            matchElement.innerHTML = `
                <span class="championship">${match.league.name}</span>
                <span class="teams">${homeTeam.name} vs ${awayTeam.name}</span>
                <span class="time">Hoje - ${matchTime}</span>`;
            matchListContainer.appendChild(matchElement);
        });
    } catch (error) {
        console.error('Erro ao buscar os jogos:', error);
        matchListContainer.innerHTML = `<p style="color: #ffcccc;">Não foi possível carregar os jogos. Erro: ${error.message}</p>`;
    }
}


// FUNÇÃO PARA BUSCAR RESULTADOS DE ONTEM COM A SPORTMONKS
async function getSportMonksResults() {
    const sportmonksApiToken = 'COLE_AQUI_SEU_API_TOKEN_DA_SPORTMONKS';
    if (sportmonksApiToken === 'COLE_AQUI_SEU_API_TOKEN_DA_SPORTMONKS') {
        document.getElementById('results-title').innerText = 'Insira seu API Token da SportMonks no script.js';
        return;
    }

    const resultsListContainer = document.getElementById('results-list-dynamic');
    const resultsTitle = document.getElementById('results-title');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    resultsTitle.innerText = `Resultados de Ontem - ${String(yesterday.getDate()).padStart(2, '0')}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${yesterday.getFullYear()}`;

    const apiUrl = `https://api.sportmonks.com/v3/football/fixtures/date/${formattedDate}?api_token=${sportmonksApiToken}&include=league,participants,scores&tz=America/Sao_Paulo`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!response.ok) { throw new Error(data.message || 'Erro na API da SportMonks.'); }
        
        // Para resultados, filtramos apenas os jogos que têm o status 'FT' (Full Time / Finalizado)
        const finishedMatches = data.data.filter(match => match.state === 'FT');

        if (finishedMatches.length === 0) { resultsListContainer.innerHTML = '<p style="color: #fff;">Nenhum resultado encontrado para ontem.</p>'; return; }

        resultsListContainer.innerHTML = '';
        finishedMatches.forEach(match => {
            const homeTeam = match.participants.find(p => p.meta.location === 'home');
            const awayTeam = match.participants.find(p => p.meta.location === 'away');

            // Buscamos os placares dentro do array 'scores'
            const homeScore = match.scores.find(s => s.description === 'CURRENT' && s.participant_id === homeTeam.id)?.score.goals ?? '-';
            const awayScore = match.scores.find(s => s.description === 'CURRENT' && s.participant_id === awayTeam.id)?.score.goals ?? '-';

            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            matchElement.innerHTML = `
                <span class="championship">${match.league.name}</span>
                <span class="teams">${homeTeam.name} <strong>${homeScore} x ${awayScore}</strong> ${awayTeam.name}</span>
                <span class="time">Finalizado</span>`;
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
    function addMessage(text, sender) { /* ...código do chat ... */ }
    function showOptions() { /* ...código do chat ... */ }
    function handleOptionClick(event) { /* ...código do chat ... */ }
    addMessage('Olá! Sou seu assistente virtual. Como posso te ajudar?', 'bot');
    showOptions();
}

// (As funções do chat estão abreviadas aqui para não repetir, mas no código completo elas devem estar presentes)
// Cole o código completo que já inclui as funções do chat abaixo:
function addMessage(text, sender) {
    const chatWidget = document.getElementById('chat-widget');
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function showOptions() {
    const optionsContainer = document.getElementById('chat-options');
    const faqs = {
        'pagamento': { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX e Cartão de Crédito.' },
        'como_funciona': { q: 'Como funciona o serviço?', a: 'Você recebe um usuário e senha para acessar nosso aplicativo em sua TV Smart, Celular ou TV Box.' },
        'teste': { q: 'Posso fazer um teste grátis?', a: 'Sim! Chame um de nossos atendentes no WhatsApp para solicitar.' },
        'atendente': { q: 'Falar com um atendente', a: 'Claro! Clique aqui para ir para o WhatsApp: <a href="https://wa.me/5548991004780?text=Olá!%20Preciso%20de%20ajuda." target="_blank">Iniciar Conversa</a>' }
    };
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
    const faqs = {
        'pagamento': { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX e Cartão de Crédito.' },
        'como_funciona': { q: 'Como funciona o serviço?', a: 'Você recebe um usuário e senha para acessar nosso aplicativo em sua TV Smart, Celular ou TV Box.' },
        'teste': { q: 'Posso fazer um teste grátis?', a: 'Sim! Chame um de nossos atendentes no WhatsApp para solicitar.' },
        'atendente': { q: 'Falar com um atendente', a: 'Claro! Clique aqui para ir para o WhatsApp: <a href="https://wa.me/5548991004780?text=Olá!%20Preciso%20de%20ajuda." target="_blank">Iniciar Conversa</a>' }
    };
    const key = event.target.dataset.key;
    addMessage(faqs[key].q, 'user');
    setTimeout(() => { addMessage(faqs[key].a, 'bot'); }, 500);
}
