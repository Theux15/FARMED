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
        pergunta: "Qual das seguintes inovações agrícolas é projetada para reduzir o desperdício de água, proteger o solo e conservar os recursos naturais?",
        alternativas: ["Agricultura de precisão", "Agricultura hidropônica", "Agricultura de conservação ", "Agricultura orgânica"],
        alternativaCorreta: 2 
    },
    {
        pergunta: "Qual tecnologia agrícola utiliza sensores e sistemas de GPS para otimizar o uso de água e fertilizantes, de forma precisa?",
        alternativas: ["Agricultura hidropônica", "Agricultura orgânica", "Agricultura hidropônica", "Agricultura de precisão"],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual é o principal método de criação de gado que envolve a liberdade de movimento e acesso a pastagens naturais?",
        alternativas: ["Confinamento", "Pastoreio rotativo", "Integração lavoura-pecuária-floresta (ILPF)", "Estabulação permanente"],
        alternativaCorreta: 1
    },
    {
        pergunta: "Qual é o principal objetivo da integração lavoura-pecuária-floresta (ILPF)?",
        alternativas: ["Aumentar a produtividade agrícola", "Reduzir a dependência de agrotóxicos", "Promover a sustentabilidade ambiental", "Minimizar os custos de produção"],
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

localStorage.removeItem('acertos');
mudarPergunta()

prox.addEventListener("click", () => {
    i++
    if (i < perguntas.length) {
        mudarPergunta()
    } else {
        finalizarQuiz()
    }
})

function mudarPergunta() {

    opcoes.forEach(botao => {
        botao.disabled = false
        botao.removeAttribute('id')
        botao.removeEventListener('click', verificarResposta)
    })

    p.innerHTML =  perguntas[i].pergunta
    np.innerHTML = `Questão ${i+1} de ${perguntas.length}`

    opcoes.forEach((botao, index) => {
        botao.innerHTML = perguntas[i].alternativas[index];
        botao.addEventListener('click', () => verificarResposta(index));
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
}

function finalizarQuiz() {
    localStorage.setItem('acertos', acertos)
    window.location.href = "../FinalJogos/FinalJogos.html"
}