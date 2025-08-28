import {questoes} from './questoes.js';

function montarQuiz() {
    const form = document.getElementById("quizForm");
    Object.entries(questoes).forEach(([disciplina, questoesDisciplina], dIndex) => {
        let fieldset = document.createElement("fieldset");
        fieldset.innerHTML = `<legend><b>${disciplina}</b></legend>`;
        questoesDisciplina.forEach((q, i) => {
            let div = document.createElement("div");
            div.innerHTML = `<p>${i + 1}. ${q.pergunta}</p>`;
            q.alternativas.forEach(alt => {
                div.innerHTML += `
                <label>
                    <input type="radio" name="q${dIndex}_${i}" value="${alt}"> ${alt}
                </label><br>`;
            });
            fieldset.appendChild(div);
        });
        form.appendChild(fieldset);
    });
}

function verificar() {
    let resultadoHTML = "<h3>Resultados por disciplina:</h3>";
    Object.entries(questoes).forEach(([disciplina, questoesDisciplina], dIndex) => {
        let certas = 0;
        let detalhes = "";
        questoesDisciplina.forEach((q, i) => {
            let marcada = document.querySelector(`input[name="q${dIndex}_${i}"]:checked`);
            if (marcada && marcada.value === q.correta) {
                certas++;
                detalhes += `<p style="color:green">Questão ${i + 1}: Correta ✅</p>`;
            } else {
                detalhes += `<p style="color:red">Questão ${i + 1}: Errada ❌ (Correta: ${q.correta})</p>`;
            }
        });
        let nota = (certas / questoesDisciplina.length) * 10;
        resultadoHTML += `<h4>${disciplina}</h4>${detalhes}<p><b>Nota:</b> ${nota.toFixed(1)}</p>`;
    });
    document.getElementById("resultado").innerHTML = resultadoHTML;
}

/*function detectarPerguntasRepetidas() {
    const perguntasMap = new Map();
    const repetidas = [];

    Object.entries(questoes).forEach(([disciplina, questoesDisciplina]) => {
        questoesDisciplina.forEach((q, i) => {
            // Remove espaços extras e quebra de linha para comparar melhor
            const texto = q.pergunta.replace(/\s+/g, ' ').trim();
            if (perguntasMap.has(texto)) {
                repetidas.push({
                    disciplina,
                    indice: i,
                    pergunta: q.pergunta,
                    original: perguntasMap.get(texto)
                });
            } else {
                perguntasMap.set(texto, { disciplina, indice: i });
            }
        });
    });

    if (repetidas.length > 0) {
        console.log("Perguntas repetidas encontradas:");
        repetidas.forEach(rep => {
            console.log(`Repetida em "${rep.disciplina}" (índice ${rep.indice + 1}):`);
            console.log(rep.pergunta);
            console.log(`Primeira ocorrência em "${rep.original.disciplina}" (índice ${rep.original.indice + 1})`);
            console.log('---');
        });
    } else {
        console.log("Nenhuma pergunta repetida encontrada.");
    }
}*/


function detectarPerguntasRepetidasNaTela() {
    const perguntasMap = new Map();
    const repetidas = [];

    Object.entries(questoes).forEach(([disciplina, questoesDisciplina]) => {
        questoesDisciplina.forEach((q, i) => {
            const texto = q.pergunta.replace(/\s+/g, ' ').trim();
            if (perguntasMap.has(texto)) {
                repetidas.push({
                    disciplina,
                    indice: i,
                    pergunta: q.pergunta,
                    original: perguntasMap.get(texto)
                });
            } else {
                perguntasMap.set(texto, { disciplina, indice: i });
            }
        });
    });

    let html = "<h3>Perguntas repetidas:</h3>";
    if (repetidas.length > 0) {
        repetidas.forEach(rep => {
            html += `<div style="border:1px solid #f00; margin:8px; padding:8px;">
                <b>Repetida em:</b> ${rep.disciplina} (índice ${rep.indice + 1})<br>
                <b>Pergunta:</b> ${rep.pergunta}<br>
                <b>Primeira ocorrência em:</b> ${rep.original.disciplina} (índice ${rep.original.indice + 1})
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

montarQuiz();
detectarPerguntasRepetidas();
detectarPerguntasRepetidasNaTela();
