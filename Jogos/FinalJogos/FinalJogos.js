const acertos = localStorage.getItem('acertos')
const numPontos = document.querySelector(".pontos")


console.log(`Acertos: ${acertos}`)
numPontos.innerHTML = acertos

