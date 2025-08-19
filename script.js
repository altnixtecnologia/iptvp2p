// Adicione um ouvinte para executar nosso código quando o HTML da página estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    getRealMatches();
});

async function getRealMatches() {
    // -----------------------------------------------------------------------
    // PASSO 1: INSIRA SUA *NOVA* CHAVE DA API AQUI (A ANTIGA FOI EXPOSTA!)
    // -----------------------------------------------------------------------
    const apiKey = 8daeca9075894ea59785818f0b4e8428;

    // Verificação para garantir que a chave foi inserida
    if (apiKey === 8daeca9075894ea59785818f0b4e8428) {
        alert('ATENÇÃO: Vá ao site football-data.org, gere uma NOVA chave de API e cole no arquivo script.js!');
        return;
    }

    // Pega as referências aos elementos HTML que vamos manipular
    const matchListContainer = document.getElementById('match-list-dynamic');
    const footballTitle = document.getElementById('football-title');
    
    // Mostra uma mensagem de carregamento para o usuário
    matchListContainer.innerHTML = '<p style="color: #fff;">Buscando jogos de hoje...</p>';

    // Pega a data de hoje e formata para YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Atualiza o título da seção com a data de hoje
    footballTitle.innerText = `Jogos do Dia - ${dd}/${mm}/${yyyy}`;

    // Monta a URL da API para buscar os jogos da data de hoje
    const apiUrl = `https://api.football-data.org/v4/matches?date=${formattedDate}`;

    // Lista de campeonatos que nos interessam (códigos da API)
    const desiredCompetitions = [
        'BSA', // Brasileirão Série A
        'CL',  // UEFA Champions League
        'CLI', // Copa Libertadores
    ];

    try {
        // Faz a chamada à API usando a sua chave
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        // Converte a resposta em formato JSON
        const data = await response.json();

        // Filtra os jogos para mostrar apenas os dos campeonatos que definimos na lista
        const filteredMatches = data.matches.filter(match => desiredCompetitions.includes(match.competition.code));
        
        if (filteredMatches.length === 0) {
            matchListContainer.innerHTML = '<p style="color: #fff;">Nenhum jogo das ligas principais (Série A, Champions, Libertadores) agendado para hoje.</p>';
            return;
        }

        // Limpa a mensagem de "carregando"
        matchListContainer.innerHTML = '';

        // Cria o HTML para cada jogo encontrado
        filteredMatches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            
            // Converte a hora UTC da API para a hora local do Brasil (Florianópolis)
            const matchTime = new Date(match.utcDate).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
            });

            // Cria o HTML para o jogo
            matchElement.innerHTML = `
                <span class="championship">${match.competition.name}</span>
                <span class="teams">${match.homeTeam.name} vs ${match.awayTeam.name}</span>
                <span class="time">Hoje - ${matchTime}</span>
            `;
            
            // Adiciona o elemento do jogo na lista do site
            match
