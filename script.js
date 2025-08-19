document.addEventListener('DOMContentLoaded', function() {
    getRapidApiMatches(); // Mudamos o nome da função para a nova API
    setupChat();
});

// =========================================================================
// LÓGICA DA NOVA API DE FUTEBOL (RapidAPI)
// =========================================================================
async function getRapidApiMatches() {
    // -----------------------------------------------------------------------
    // 1. INSIRA SUA *NOVA* CHAVE GERADA NA RAPIDAPI AQUI
    // -----------------------------------------------------------------------
    const rapidApiKey = '9970670024msh21b2f0db829b872p155061jsn4331dbed709d';

    if (rapidApiKey === '9970670024msh21b2f0db829b872p155061jsn4331dbed709d') {
        document.getElementById('football-title').innerText = 'Insira sua chave da RapidAPI no script.js';
        return;
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
    
    // -----------------------------------------------------------------------
    // 2. VERIFIQUE SE O ENDPOINT ESTÁ CORRETO
    // URL da API para buscar os jogos de hoje. Verifique na documentação se é essa a URL correta.
    // -----------------------------------------------------------------------
    const apiUrl = `https://wosti-futebol-tv-brasil.p.rapidapi.com/api/Matches/date/${formattedDate}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'wosti-futebol-tv-brasil.p.rapidapi.com',
                'x-rapidapi-key': rapidApiKey
            }
        });

        // A resposta da RapidAPI geralmente vem dentro de um objeto, vamos extrair os dados
        const responseData = await response.json();
        
        // A maioria das APIs retorna uma lista (array) de jogos. Verifique a documentação para saber o nome exato.
        // Vou assumir que a lista se chama 'matches' ou que a resposta já é a própria lista.
        const matches = responseData.matches || responseData; 

        if (!response.ok) {
             // Se a API retornar um erro (chave inválida, etc.), ele será capturado aqui
            throw new Error(matches.message || 'Erro na comunicação com a API.');
        }

        if (matches.length === 0) {
            matchListContainer.innerHTML = '<p style="color: #fff;">Nenhum jogo encontrado para hoje nesta API.</p>';
            return;
        }

        matchListContainer.innerHTML = '';

        // -----------------------------------------------------------------------
        // 3. ADAPTAÇÃO AO FORMATO DA RESPOSTA
        // O código abaixo assume que cada 'jogo' tem as propriedades:
        // 'championship', 'homeTeam', 'awayTeam' e 'matchTime'.
        // Se os nomes forem diferentes, ajuste-os aqui.
        // -----------------------------------------------------------------------
        matches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';

            matchElement.innerHTML = `
                <span class="championship">${match.championship || 'Campeonato'}</span>
                <span class="teams">${match.homeTeam || 'Time Casa'} vs ${match.awayTeam || 'Time Visitante'}</span>
                <span class="time">Hoje - ${match.matchTime || 'Horário'}</span>
            `;
            
            matchListContainer.appendChild(matchElement);
        });

    } catch (error) {
        console.error('Erro ao buscar os jogos:', error);
        footballTitle.innerText = 'Agenda de Jogos';
        matchListContainer.innerHTML = `<p style="color: #ffcccc;">Não foi possível carregar a agenda. Erro: ${error.message}</p>`;
    }
}

// =========================================================================
// LÓGICA DO CHAT DE DÚVIDAS (Continua a mesma)
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
    addMessage('Olá! Sou seu assistente virtual. Como posso te ajudar hoje?', 'bot');
    showOptions();
}
