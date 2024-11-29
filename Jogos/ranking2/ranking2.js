document.addEventListener('DOMContentLoaded', () => {
    const lupa = document.getElementById('lupa');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const buscar = document.querySelector('.buscar');

    const paginas = [
        { nome: 'Conteúdos', link: '../../Conteúdos/Carrossel/Carrossel.html' },
        { nome: 'Jogos', link: '../../Jogos/HomeJogos/Homejogos.html' },
        { nome: 'Sobre', link: '../../Sobre/sobre.html' },
        { nome: 'Exportação e Importação', link: '../../Conteúdos/exportacao_importacao/exportacao_importacao.html' },
        { nome: 'Solos', link: '../../Conteúdos/solos/solos.html' },
        { nome: 'Tipos de Agricultura', link: '../../Conteúdos/tipos_de_agricultura/tipos_de_agricultura.html' }
    ];

    function filtrarSugestoes(query) {
        const filtrado = paginas.filter(pagina =>
            pagina.nome.toLowerCase().includes(query.toLowerCase())
        );
        suggestions.innerHTML = '';
        if (query !== '') {
            filtrado.forEach(pagina => {
                const li = document.createElement('li');
                li.textContent = pagina.nome;
                li.addEventListener('click', () => {
                    window.location.href = pagina.link;
                });
                suggestions.appendChild(li);
            });
        }
    }

    lupa.addEventListener('click', () => {
        searchBox.classList.toggle('show');
        buscar.classList.toggle('lupa-ativa'); 
        searchInput.focus();
    });

    searchInput.addEventListener('input', (e) => {
        filtrarSugestoes(e.target.value);
    });

    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !lupa.contains(e.target)) {
            searchBox.classList.remove('show');
            buscar.classList.remove('lupa-ativa');
        }
    });

    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../../login/login.html';
        }
    }

    checkAuthentication();

    // Função para buscar e atualizar o ranking
    function fetchRankingData() {
        const token = localStorage.getItem('token');
        fetch('https://farmed-backend.vercel.app/ranking2', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(newData => {
            // Verifica se há mudanças comparando com os dados anteriores
            const currentRanking = document.querySelectorAll('#rankingTable tbody tr');
            let needsUpdate = false;

            if (currentRanking.length !== newData.length) {
                needsUpdate = true;
            } else {
                const uniqueUsers = new Set();
                newData.forEach((entry, index) => {
                    if (!uniqueUsers.has(entry.nome_usuario)) {
                        uniqueUsers.add(entry.nome_usuario);
                        const currentRow = currentRanking[uniqueUsers.size - 1];
                        if (currentRow) {
                            const currentScore = currentRow.lastElementChild.textContent;
                            if (currentScore !== entry.pontuacao.toString()) {
                                needsUpdate = true;
                            }
                        }
                    }
                });
            }

            // Se houver mudanças, atualiza a tabela
            if (needsUpdate) {
                const rankingTableBody = document.querySelector('#rankingTable tbody');
                rankingTableBody.innerHTML = '';
                const uniqueUsers = new Set();
                newData.forEach((entry, index) => {
                    if (!uniqueUsers.has(entry.nome_usuario)) {
                        uniqueUsers.add(entry.nome_usuario);
                        const row = document.createElement('tr');

                        const posicaoCell = document.createElement('td');
                        posicaoCell.textContent = index + 1;

                        const spacer1 = document.createElement('td');
                        spacer1.className = 'spacer';

                        const userCell = document.createElement('td');
                        userCell.textContent = entry.nome_usuario;
                        userCell.className = 'user-td';

                        const spacer2 = document.createElement('td');
                        spacer2.className = 'spacer';

                        const pontosCell = document.createElement('td');
                        pontosCell.textContent = entry.pontuacao;

                        row.appendChild(posicaoCell);
                        row.appendChild(spacer1);
                        row.appendChild(userCell);
                        row.appendChild(spacer2);
                        row.appendChild(pontosCell);

                        rankingTableBody.appendChild(row);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar ranking:', error);
        });
    }

    // Primeira busca ao carregar a página
    fetchRankingData();

    // Configura o intervalo de atualização (a cada 5 segundos)
    const updateInterval = setInterval(fetchRankingData, 5000);

    // Limpa o intervalo quando a página é fechada
    window.addEventListener('beforeunload', () => {
        clearInterval(updateInterval);
    });
});