// Função para carregar os jogos do dia quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    getDailyMatches();
});

// --- SIMULAÇÃO DE UMA CHAMADA DE API ---
// No mundo real, você substituiria esta função por uma chamada a uma API de esportes real.
// Você precisaria de uma 'API Key' (chave de acesso) que o provedor da API lhe daria.

async function getDailyMatches() {
    const matchListContainer = document.getElementById('match-list-dynamic');
    matchListContainer.innerHTML = '<p style="color: #fff;">Buscando jogos de hoje...</p>'; // Mensagem de carregamento

    // URL da API (EXEMPLO - esta URL é fictícia)
    // Você precisaria substituir pela URL da API que você contratar.
    const apiUrl = 'https://v3.football.api-sports.io/fixtures?date=2025-08-19&status=NS'; // Exemplo de URL real da Api-Football
    const apiKey = 'SUA_CHAVE_DE_API_AQUI'; // Você precisa se cadastrar no serviço para obter uma chave

    // --- DADOS DE EXEMPLO (JÁ QUE NÃO TEMOS UMA CHAVE DE API AGORA) ---
    // Se a API estivesse funcionando, os dados viriam dela. Por agora, vamos usar dados fixos.
    const exampleData = [
        { championship: "Campeonato Catarinense", teams: "Avaí vs Figueirense", time: "16:00" },
        { championship: "Campeonato Gaúcho", teams: "Grêmio vs Internacional", time: "16:00" },
        { championship: "Brasileirão Série A", teams: "Palmeiras vs São Paulo", time: "19:00" },
        { championship: "Champions League", teams: "Barcelona vs Juventus", time: "21:00" }
    ];
    // --- FIM DOS DADOS DE EXEMPLO ---

    try {
        // NO CÓDIGO REAL, VOCÊ FARIA A CHAMADA ASSIM:
        /*
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': apiKey
            }
        });
        const data = await response.json();
        const matches = data.response; // Isso depende da estrutura da resposta da API
        */

        // Usando nossos dados de exemplo por enquanto:
        const matches = exampleData;
        
        if (matches.length === 0) {
            matchListContainer.innerHTML = '<p style="color: #fff;">Nenhum jogo importante agendado para hoje.</p>';
            return;
        }

        // Limpa a mensagem de "carregando"
        matchListContainer.innerHTML = '';

        // Cria o HTML para cada jogo encontrado
        matches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match-item';
            
            matchElement.innerHTML = `
                <span class="championship">${match.championship}</span>
                <span class="teams">${match.teams}</span>
                <span class="time">Hoje - ${match.time}</span>
            `;
            
            matchListContainer.appendChild(matchElement);
        });

    } catch (error) {
        console.error('Erro ao buscar os jogos:', error);
        matchListContainer.innerHTML = '<p style="color: #ffcccc;">Não foi possível carregar a agenda de jogos.</p>';
    }
}
