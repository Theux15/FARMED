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

    const form = document.querySelector('form');
    const loginInput = document.getElementById('login');
    const senhaInput = document.getElementById('senha');
    const loginButton = document.querySelector('button[type="submit"]');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();

        const login = loginInput.value;
        const senha = senhaInput.value;

        const loginData = {
            nome_usuario: login,
            senha: senha
        };

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Login bem-sucedido!');
                window.location.href = 'bemvindo.html'; // Redirecionar para a tela de boas-vindas
            } else {
                alert('Erro ao fazer login!');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login!');
        });
    });
});