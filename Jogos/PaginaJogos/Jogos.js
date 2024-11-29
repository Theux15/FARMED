const perguntas = [
    {
        pergunta: "Qual das seguintes práticas agrícolas é caracterizada pelo uso de métodos tradicionais e técnicas sustentáveis de cultivo?",
        alternativas: ["Agricultura convencional", "Agricultura orgânica", "Agricultura hidropônica", "Agricultura de precisão"],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual é o método de cultivo que envolve o uso de água e nutrientes minerais em uma solução, sem a necessidade de solo?",
        alternativas: ["Trigo", "Arroz", "Milho", "Soja "],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual tecnologia agrícola utiliza sensores e sistemas de GPS para otimizar o uso de água e fertilizantes, de forma precisa?",
        alternativas: ["Agricultura de conservação", "Agricultura orgânica", "Agricultura hidropônica", "Agricultura de precisão "],
        alternativaCorreta: 3
    },
    {
        pergunta: "Qual das seguintes inovações agrícolas é projetada para reduzir o desperdício de água, proteger o solo e conservar os recursos naturais?",
        alternativas: ["Agricultura de precisão", "Agricultura hidropônica", "Agricultura de conservação ", "Agricultura orgânica"],
        alternativaCorreta: 2 
    },
    {
        pergunta: "Qual é o nome do método de cultivo que evita o uso de agrotóxicos, fertilizantes sintéticos e organismos geneticamente modificados, promovendo práticas sustentáveis e ecológicas?",
        alternativas: ["Agricultura hidropônica", "Agricultura orgânica", "Agricultura hidropônica", "Agricultura de precisão"],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual é o principal método de criação de gado que envolve a liberdade de movimento e acesso a pastagens naturais?",
        alternativas: ["Confinamento", "Pastoreio rotativo", "Integração ILPF", "Estabulação permanente"],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual é o principal objetivo da integração lavoura-pecuária-floresta (ILPF)?",
        alternativas: ["Aumentar a produtividade", "Reduzir agrotóxicos", "Sustentabilidade ambiental", "Minimizar os custos"],
        alternativaCorreta: 2
    },
    {
        pergunta: "Qual das seguintes culturas é conhecida por ser uma fonte versátil de alimentos, roupas e biocombustíveis?",
        alternativas: ["Trigo", "Milho", "Soja", "Algodão"],
        alternativaCorreta: 3
    },
    {
        pergunta: "Qual é a prática agrícola que se concentra na diversificação das culturas e na rotação de culturas para aumentar a fertilidade do solo e reduzir pragas e doenças?",
        alternativas: ["Agricultura de precisão", "Monocultura", "Policultura", "Agrofloresta"],
        alternativaCorreta: 3
    },
    {
        pergunta: "Qual é o termo usado para descrever o processo de adaptação genética de plantas para resistir a pragas, doenças e condições ambientais adversas?",
        alternativas: ["Biodiversidade", "Transgênese", "Melhoramento genético", "Sustentabilidade"],
        alternativaCorreta: 2
    }
]

const p = document.querySelector("h2")
const np = document.querySelector(".pergunta p")
const prox = document.querySelector(".prox")
const opcoes = document.querySelectorAll(".opcao")
const barraProgresso = document.querySelector(".barra_progresso div")

let i = 0
let acertos = 0
let respostaSelecionada = false;

localStorage.removeItem('acertos');
mudarPergunta()

prox.addEventListener("click", () => {

    if (!respostaSelecionada) {
        alert("Por favor, selecione uma alternativa antes de continuar.");
        return;
    }

    i++
    if (i < perguntas.length) {
        mudarPergunta()
        respostaSelecionada = false;
    } else {
        finalizarQuiz()
    }
})

function mudarPergunta() {

    if (i > 0 ) {
        opcoes.forEach(botao => {
            botao.disabled = false
            botao.removeAttribute('id')
        })
    }

    p.innerHTML =  perguntas[i].pergunta
    np.innerHTML = `Questão ${i+1} de ${perguntas.length}`



    opcoes.forEach((botao, index) => {
        botao.innerHTML = perguntas[i].alternativas[index];
    })

    const progresso = ((i + 1) / perguntas.length) * 100
    barraProgresso.style.width = `${progresso}%`
}

function verificarResposta(index) {
    opcoes.forEach(botao => {
        botao.disabled = true
    })
    const respostaCorreta = perguntas[i].alternativaCorreta

    console.log(`Resposta selecionada: ${index}`);
    console.log(`Resposta correta: ${respostaCorreta}`);

    if (index === respostaCorreta) {
        opcoes[index].id = 'correto'

        acertos++
        console.log(acertos)
    } else {
        opcoes[index].id = 'incorreto'
        opcoes[respostaCorreta].id = 'correto'
    }

    respostaSelecionada = true;
}

function finalizarQuiz() {
    localStorage.setItem('acertos', acertos)
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para salvar sua pontuação.');
        return;
    }

    fetch('http://localhost:3000/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pontuacao: acertos, quiz: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            localStorage.setItem('quiz', '1');
            window.location.href = "../FinalJogos/FinalJogos.html";
        } else {
            alert('Erro ao salvar pontuação!');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar pontuação!');
    });
}

window.addEventListener('beforeunload', (event) => {
    if (i < perguntas.length - 1) {
        event.preventDefault();
        event.returnValue = "Tem certeza que deseja sair do quiz? Seu progresso será perdido.";
    }
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
});
