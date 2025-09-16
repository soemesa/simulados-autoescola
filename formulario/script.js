import { questoes } from "../questoes.js";

const QTD_PERGUNTAS_TODAS = 10; // Altere aqui se quiser mudar a quantidade

removerPerguntasRepetidas(questoes);

const disciplinaSelecionada =
    localStorage.getItem("disciplinaSelecionada") || "todas";
montarQuiz(disciplinaSelecionada);

detectarPerguntasRepetidasNaTela();

document.getElementById("enviar").addEventListener("click", function (e) {
    e.preventDefault();
    salvarResultados();
    window.location.href = "../resultado/resultado.html";
});

// Função para montar o quiz
function montarQuiz(disciplinaSelecionada = "todas") {
    const form = document.getElementById("quizForm");
    form.innerHTML = "";

    if (disciplinaSelecionada === "todas") {
        // Junta todas as perguntas de todas as disciplinas
        let todasPerguntas = [];
        Object.entries(questoes).forEach(([disciplina, questoesDisciplina]) => {
            questoesDisciplina.forEach((q) => {
                todasPerguntas.push({ ...q, disciplina });
            });
        });

        // Sorteia perguntas aleatórias
        const perguntasSorteadas = sortearAleatorias(
            todasPerguntas,
            QTD_PERGUNTAS_TODAS
        );

        // Cria um único fieldset para todas as perguntas
        let fieldset = document.createElement("fieldset");
        // Se quiser, pode adicionar um legend geral:
        // fieldset.innerHTML = `<legend><b>Simulado Geral</b></legend>`;

        perguntasSorteadas.forEach((q, i) => {
            let div = document.createElement("div");
            div.innerHTML = `<p><b>Questão ${i + 1}:</b> <b>${
                q.pergunta
            }</b></p>`;
            q.alternativas.forEach((alt, idx) => {
                div.innerHTML += `
                <label>
                    <input type="radio" name="q${i}" value="${alt}">
                    ${String.fromCharCode(65 + idx)}. "${alt}"
                </label><br>`;
            });
            fieldset.appendChild(div);
        });

        form.appendChild(fieldset);

        // Salva as perguntas sorteadas para correção e detalhamento
        localStorage.setItem(
            "perguntasSorteadas",
            JSON.stringify(perguntasSorteadas)
        );
    } else {
        // Fluxo para disciplina única (como já está)
        let questoesDisciplina = questoes[disciplinaSelecionada];
        let fieldset = document.createElement("fieldset");
        fieldset.innerHTML = `<legend><b>${disciplinaSelecionada}</b></legend>`;
        questoesDisciplina.forEach((q, i) => {
            let div = document.createElement("div");
            div.innerHTML = `<p><b>Questão ${i + 1}:</b> <b>${
                q.pergunta
            }</b></p>`;
            q.alternativas.forEach((alt, idx) => {
                div.innerHTML += `
                <label>
                    <input type="radio" name="q0_${i}" value="${alt}">
                    ${String.fromCharCode(65 + idx)}. "${alt}"
                </label><br>`;
            });
            fieldset.appendChild(div);
        });
        form.appendChild(fieldset);
    }
}

// Função para sortear perguntas aleatórias
function sortearAleatorias(array, n) {
    const copia = [...array];
    const resultado = [];
    while (resultado.length < n && copia.length > 0) {
        const idx = Math.floor(Math.random() * copia.length);
        resultado.push(copia.splice(idx, 1)[0]);
    }
    return resultado;
}

// Função para salvar resultados e detalhamento no localStorage
function salvarResultados() {
    const disciplinaSelecionada =
        localStorage.getItem("disciplinaSelecionada") || "todas";

    let resultadoHTML = "";
    let detalhesHTML = "";

    if (disciplinaSelecionada === "todas") {
        const perguntasSorteadas = JSON.parse(
            localStorage.getItem("perguntasSorteadas") || "[]"
        );
        let certas = 0;
        perguntasSorteadas.forEach((q, i) => {
            let marcada = document.querySelector(`input[name="q${i}"]:checked`);
            if (
                marcada &&
                marcada.value.trim() === (q.correta ? q.correta.trim() : "")
            ) {
                certas++;
            }
        });
        let nota = (certas / perguntasSorteadas.length) * 10;
        resultadoHTML += `<h4>Simulado Geral</h4><p><b>Nota:</b> ${nota.toFixed(
            1
        )}</p>`;

        // Detalhamento
        detalhesHTML = "<h3>Detalhamento das respostas:</h3>";
        perguntasSorteadas.forEach((q, i) => {
            detalhesHTML += `<div class="detalhe-pergunta">
                <b>${q.disciplina} - Questão ${i + 1}:</b> <b>${
                q.pergunta
            }</b><br>`;
            q.alternativas.forEach((alt, idx) => {
                const letra = String.fromCharCode(65 + idx);
                if (alt === q.correta) {
                    detalhesHTML += `<div><span class="correta">${letra}. "${alt}"</span></div>`;
                } else if (
                    document
                        .querySelector(`input[name="q${i}"]:checked`)
                        ?.value.trim() === alt
                ) {
                    detalhesHTML += `<div><span class="errada">${letra}. "${alt}"</span></div>`;
                }
            });
            detalhesHTML += `</div>`;
        });
    } else {
        // Fluxo para disciplina única
        let questoesDisciplina = questoes[disciplinaSelecionada];
        let certas = 0;
        questoesDisciplina.forEach((q, i) => {
            let marcada = document.querySelector(
                `input[name="q0_${i}"]:checked`
            );
            if (
                marcada &&
                marcada.value.trim() === (q.correta ? q.correta.trim() : "")
            ) {
                certas++;
            }
        });
        let nota = (certas / questoesDisciplina.length) * 10;
        resultadoHTML += `<h4>${disciplinaSelecionada}</h4><p><b>Nota:</b> ${nota.toFixed(
            1
        )}</p>`;

        // Detalhamento
        detalhesHTML = "<h3>Detalhamento das respostas:</h3>";
        questoesDisciplina.forEach((q, i) => {
            detalhesHTML += `<div class="detalhe-pergunta">
                <b>Questão ${i + 1}:</b> <b>${q.pergunta}</b><br>`;
            q.alternativas.forEach((alt, idx) => {
                const letra = String.fromCharCode(65 + idx);
                if (alt === q.correta) {
                    detalhesHTML += `<div><span class="correta">${letra}. "${alt}"</span></div>`;
                } else if (
                    document
                        .querySelector(`input[name="q0_${i}"]:checked`)
                        ?.value.trim() === alt
                ) {
                    detalhesHTML += `<div><span class="errada">${letra}. "${alt}"</span></div>`;
                }
            });
            detalhesHTML += `</div>`;
        });
    }

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
