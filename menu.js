import { questoes } from "./questoes.js";

const grid = document.getElementById("disciplinasGrid");

// Botão para todas as disciplinas
const btnTodas = document.createElement("button");
btnTodas.className = "disciplina-btn";
btnTodas.textContent = "Todas as disciplinas";
btnTodas.onclick = () => {
    localStorage.setItem("disciplinaSelecionada", "todas");
    window.location.href = "simulado.html";
};
grid.appendChild(btnTodas);

// Botões para cada disciplina
Object.keys(questoes).forEach((disciplina) => {
    const btn = document.createElement("button");
    btn.className = "disciplina-btn";
    btn.textContent = disciplina;
    btn.onclick = () => {
        localStorage.setItem("disciplinaSelecionada", disciplina);
        window.location.href = "simulado.html";
    };
    grid.appendChild(btn);
});
