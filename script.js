import { questoes } from "./questoes.js";

function montarQuiz() {
    const form = document.getElementById("quizForm");
    Object.entries(questoes).forEach(
        ([disciplina, questoesDisciplina], dIndex) => {
            let fieldset = document.createElement("fieldset");
            fieldset.innerHTML = `<legend><b>${disciplina}</b></legend>`;
            questoesDisciplina.forEach((q, i) => {
                let div = document.createElement("div");
                div.innerHTML = `<p>${i + 1}. ${q.pergunta}</p>`;
                q.alternativas.forEach((alt) => {
                    div.innerHTML += `
                <label>
                    <input type="radio" name="q${dIndex}_${i}" value="${alt}"> ${alt}
                </label><br>`;
                });
                fieldset.appendChild(div);
            });
            form.appendChild(fieldset);
        }
    );
}

function verificar() {
    let resultadoHTML = "<h3>Resultados por disciplina:</h3>";
    Object.entries(questoes).forEach(
        ([disciplina, questoesDisciplina], dIndex) => {
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
        }
    );
    resultadoHTML += `<button id="detalhesBtn">Ver detalhes</button>`;
    document.getElementById("resultado").innerHTML = resultadoHTML;

    // Adiciona evento para mostrar detalhes
    document.getElementById("detalhesBtn").onclick = mostrarDetalhes;
}

function mostrarDetalhes() {
    let detalhesHTML = "<h3>Detalhamento das respostas:</h3>";
    Object.entries(questoes).forEach(
        ([disciplina, questoesDisciplina], dIndex) => {
            detalhesHTML += `<h4>${disciplina}</h4>`;
            questoesDisciplina.forEach((q, i) => {
                let marcada = document.querySelector(
                    `input[name="q${dIndex}_${i}"]:checked`
                );
                let correta = q.correta ? q.correta.trim() : "";
                let respostaUsuario = marcada ? marcada.value.trim() : "";
                if (correta === "") {
                    detalhesHTML += `<p><b>${
                        i + 1
                    }.</b> <span style="color:gray;">(Sem resposta cadastrada)</span></p>`;
                    return;
                }
                if (respostaUsuario === correta) {
                    detalhesHTML += `<p><b>${
                        i + 1
                    }.</b> <span style="color:green;">Correta ✅</span><br>
                <b>Pergunta:</b> ${q.pergunta}<br>
                <b>Sua resposta:</b> ${respostaUsuario}</p>`;
                } else {
                    detalhesHTML += `<p><b>${
                        i + 1
                    }.</b> <span style="color:red;">Errada ❌</span><br>
                <b>Pergunta:</b> ${q.pergunta}<br>
                <b>Sua resposta:</b> ${
                    respostaUsuario || "<i>Não respondida</i>"
                }<br>
                <b>Correta:</b> <span style="color:green;">${correta}</span></p>`;
                }
            });
        }
    );
    document.getElementById("resultado").innerHTML = detalhesHTML;
}

function detectarPerguntasRepetidas() {
    const perguntasMap = new Map();
    const repetidas = [];

    Object.entries(questoes).forEach(([disciplina, questoesDisciplina]) => {
        questoesDisciplina.forEach((q, i) => {
            // Remove espaços extras e quebra de linha para comparar melhor
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

    if (repetidas.length > 0) {
        console.log("Perguntas repetidas encontradas:");
        repetidas.forEach((rep) => {
            console.log(
                `Repetida em "${rep.disciplina}" (índice ${rep.indice + 1}):`
            );
            console.log(rep.pergunta);
            console.log(
                `Primeira ocorrência em "${rep.original.disciplina}" (índice ${
                    rep.original.indice + 1
                })`
            );
            console.log("---");
        });
    } else {
        console.log("Nenhuma pergunta repetida encontrada.");
    }
}

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

    let html = "<h3>Perguntas repetidas:</h3>";
    if (repetidas.length > 0) {
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
    } else {
        html += "<p>Nenhuma pergunta repetida encontrada.</p>";
    }
    // Crie ou use um elemento para mostrar o resultado
    let div = document.getElementById("repetidas");
    if (!div) {
        div = document.createElement("div");
        div.id = "repetidas";
        document.body.appendChild(div);
    }
    div.innerHTML = html;
}

function removerPerguntasRepetidas(questoes) {
    Object.keys(questoes).forEach((disciplina) => {
        const perguntasUnicas = [];
        const perguntasSet = new Set();
        questoes[disciplina].forEach((q) => {
            // Normaliza o texto para comparar
            const texto = q.pergunta.replace(/\s+/g, " ").trim().toLowerCase();
            if (!perguntasSet.has(texto)) {
                perguntasSet.add(texto);
                perguntasUnicas.push(q);
            }
        });
        questoes[disciplina] = perguntasUnicas;
    });
}

// Chame antes de montar o quiz
removerPerguntasRepetidas(questoes);

montarQuiz();
verificar();
detectarPerguntasRepetidas();
detectarPerguntasRepetidasNaTela();
