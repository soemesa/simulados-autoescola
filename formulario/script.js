import { questoes } from "../questoes.js";

// Remove perguntas repetidas antes de montar o quiz
removerPerguntasRepetidas(questoes);

// Monta o quiz na tela
const disciplinaSelecionada =
    localStorage.getItem("disciplinaSelecionada") || "todas";
montarQuiz(disciplinaSelecionada);

// Mostra perguntas repetidas apenas se existirem
detectarPerguntasRepetidasNaTela();

// Adiciona evento ao botão "Enviar"
document.getElementById("enviar").addEventListener("click", function (e) {
    e.preventDefault();
    salvarResultados(); // Salva resultado E detalhamento!
    window.location.href = "resultado/resultado.html";
    const disciplinaSelecionada =
        localStorage.getItem("disciplinaSelecionada") || "todas";

    let resultadoHTML = "";
    let disciplinas =
        disciplinaSelecionada === "todas"
            ? Object.entries(questoes)
            : [[disciplinaSelecionada, questoes[disciplinaSelecionada]]];

    disciplinas.forEach(([disciplina, questoesDisciplina], dIndex) => {
        let certas = 0;
        questoesDisciplina.forEach((q, i) => {
            let marcada = document.querySelector(
                `input[name="q${dIndex}_${i}"]:checked`
            );
            if (
                marcada &&
                marcada.value.trim() === (q.correta ? q.correta.trim() : "")
            ) {
                certas++;
            }
        });
        let nota = (certas / questoesDisciplina.length) * 10;
        resultadoHTML += `<h4>${disciplina}</h4><p><b>Nota:</b> ${nota.toFixed(
            1
        )}</p>`;
    });

    localStorage.setItem("resultadoSimulado", resultadoHTML);
    window.location.href = "resultado/resultado.html";
});

// Função para montar o quiz
function montarQuiz(disciplinaSelecionada = "todas") {
    const form = document.getElementById("quizForm");
    form.innerHTML = ""; // Limpa o formulário

    let disciplinas =
        disciplinaSelecionada === "todas"
            ? Object.entries(questoes)
            : [[disciplinaSelecionada, questoes[disciplinaSelecionada]]];

    disciplinas.forEach(([disciplina, questoesDisciplina], dIndex) => {
        let fieldset = document.createElement("fieldset");
        fieldset.innerHTML = `<legend><b>${disciplina}</b></legend>`;
        questoesDisciplina.forEach((q, i) => {
            let div = document.createElement("div");
            div.innerHTML = `<p><b>Questão ${i + 1}:</b> <b>${
                q.pergunta
            }</b></p>`;
            q.alternativas.forEach((alt, idx) => {
                div.innerHTML += `
                <label>
                    <input type="radio" name="q${dIndex}_${i}" value="${alt}">
                    ${String.fromCharCode(65 + idx)}. "${alt}"
                </label><br>`;
            });
            fieldset.appendChild(div);
        });
        form.appendChild(fieldset);
    });
}

// Função para salvar resultados e detalhamento no localStorage
function salvarResultados() {
    // Recupera a disciplina escolhida
    const disciplinaSelecionada =
        localStorage.getItem("disciplinaSelecionada") || "todas";

    // Resultado simples
    let resultadoHTML = "<h3>Pontuação por disciplina:</h3>";
    let disciplinas =
        disciplinaSelecionada === "todas"
            ? Object.entries(questoes)
            : [[disciplinaSelecionada, questoes[disciplinaSelecionada]]];

    disciplinas.forEach(([disciplina, questoesDisciplina], dIndex) => {
        let certas = 0;
        questoesDisciplina.forEach((q, i) => {
            let marcada = document.querySelector(
                `input[name="q${dIndex}_${i}"]:checked`
            );
            if (
                marcada &&
                marcada.value.trim() === (q.correta ? q.correta.trim() : "")
            ) {
                certas++;
            }
        });
        let nota = (certas / questoesDisciplina.length) * 10;
        resultadoHTML += `<h4>${disciplina}</h4><p><b>Nota:</b> ${nota.toFixed(
            1
        )}</p>`;
    });

    // Detalhamento das respostas
    let detalhesHTML = "<h3>Detalhamento das respostas:</h3>";
    disciplinas.forEach(([disciplina, questoesDisciplina], dIndex) => {
        detalhesHTML += `<h4>${disciplina}</h4>`;
        questoesDisciplina.forEach((q, i) => {
            detalhesHTML += `<div class="detalhe-pergunta">
                <b>Questão ${i + 1}:</b> <b>${q.pergunta}</b><br>`;
            q.alternativas.forEach((alt, idx) => {
                const letra = String.fromCharCode(65 + idx);
                if (alt === q.correta) {
                    detalhesHTML += `<div><span class="correta">${letra}. "${alt}"</span></div>`;
                } else if (
                    document
                        .querySelector(`input[name="q${dIndex}_${i}"]:checked`)
                        ?.value.trim() === alt
                ) {
                    detalhesHTML += `<div><span class="errada">${letra}. "${alt}"</span></div>`;
                }
            });
            detalhesHTML += `</div>`;
        });
    });


    // Salva no localStorage
    localStorage.setItem("resultadoSimulado", resultadoHTML);
    localStorage.setItem("detalhesSimulado", detalhesHTML);
}

// Função para detectar perguntas repetidas e mostrar na tela
function detectarPerguntasRepetidasNaTela() {
    const perguntasMap = new Map();
    const repetidas = [];

    Object.entries(questoes).forEach(([disciplina, questoesDisciplina]) => {
        questoesDisciplina.forEach((q, i) => {
            const texto = q.pergunta.replace(/\s+/g, " ").trim();
            if (perguntasMap.has(texto)) {
                repetidas.push({
                    disciplina,
                    indice: i,
                    pergunta: q.pergunta,
                    original: perguntasMap.get(texto),
                });
            } else {
                perguntasMap.set(texto, { disciplina, indice: i });
            }
        });
    });

    let div = document.getElementById("repetidas");
    if (!div) {
        div = document.createElement("div");
        div.id = "repetidas";
        document.body.appendChild(div);
    }
    if (repetidas.length > 0) {
        let html = "<h3>Perguntas repetidas:</h3>";
        repetidas.forEach((rep) => {
            html += `<div style="border:1px solid #f00; margin:8px; padding:8px;">
                <b>Repetida em:</b> ${rep.disciplina} (índice ${
                rep.indice + 1
            })<br>
                <b>Pergunta:</b> ${rep.pergunta}<br>
                <b>Primeira ocorrência em:</b> ${
                    rep.original.disciplina
                } (índice ${rep.original.indice + 1})
            </div>`;
        });
        div.innerHTML = html;
        div.style.display = "block";
    } else {
        div.innerHTML = "";
        div.style.display = "none";
    }
}

// Função para remover perguntas repetidas
function removerPerguntasRepetidas(questoes) {
    Object.keys(questoes).forEach((disciplina) => {
        const perguntasUnicas = [];
        const perguntasSet = new Set();
        questoes[disciplina].forEach((q) => {
            const texto = q.pergunta.replace(/\s+/g, " ").trim().toLowerCase();
            if (!perguntasSet.has(texto)) {
                perguntasSet.add(texto);
                perguntasUnicas.push(q);
            }
        });
        questoes[disciplina] = perguntasUnicas;
    });
}
