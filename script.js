const setaBaixo = document.querySelector('.seta-baixo');
const destaquesSection = document.querySelector('#destaques');

setaBaixo.addEventListener('click', function() {
    destaquesSection.scrollIntoView({ behavior: 'smooth' });
});

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

    const logoutBtn = document.querySelector('.logout-btn');
    const authButtons = document.querySelector('.auth-buttons');

    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            authButtons.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            authButtons.style.display = 'flex';
            logoutBtn.style.display = 'none';
        }
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        checkLoginStatus();
    });

    checkLoginStatus();
});
