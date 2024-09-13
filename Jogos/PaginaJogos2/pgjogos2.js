const perguntas = [
    {
        pergunta: "Qual é o principal componente do solo responsável por sua fertilidade?",
        alternativas: ["Areia", "Argila", "Matéria orgânica", "Calcário"],
        alternativaCorreta: 2
    },
    {
        pergunta: "Qual é a técnica de plantio que minimiza a perturbação do solo e ajuda a conservar a umidade?",
        alternativas: ["Plantio direto", "Queimada controlada", "Aração profunda", "Rotação de culturas"],
        alternativaCorreta:  0
    },
    {
        pergunta: "Qual das seguintes práticas é essencial para determinar o momento ideal da colheita?",
        alternativas: ["Análise de solo", "Monitoramento climático", " Irrigação controlada", "Fertilização orgânica"],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual é a principal commodity agrícola exportada pelo Brasil?",
        alternativas: ["Milho", "Café", "Soja", "Cana-de-açúcar"],
        alternativaCorreta: 2
    },
    {
        pergunta: "Qual país é o maior importador de trigo do mundo?",
        alternativas: ["China", "Índia", "Japão", "Egito"],
        alternativaCorreta: 3
    },
    {
        pergunta: "Qual tipo de solo é ideal para o cultivo de arroz?",
        alternativas: ["Solo arenoso", "Solo argiloso", "Solo alagadiço", "Solo calcário"],
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
    window.location.href = "../FinalJogos/FinalJogos.html"
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