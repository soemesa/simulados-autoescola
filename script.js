const questoes = [
  
    {
        pergunta: "",
        alternativas: ["", "", "", ""],
        correta: ""
    },
    {
        pergunta: "",
        alternativas: ["", "", "", ""],
        correta: ""
    },
];

 


function montarQuiz() {
    const form = document.getElementById("quizForm");
    questoes.forEach((q, i) => {
        let div = document.createElement("div");
        div.innerHTML = `<p>${i + 1}. ${q.pergunta}</p>`;
        q.alternativas.forEach(alt => {
            div.innerHTML += `
          <label>
            <input type="radio" name="q${i}" value="${alt}"> ${alt}
          </label><br>`;
        });
        form.appendChild(div);
    });
}

function verificar() {
    let certas = 0;
    let resultadoHTML = "<h3>Resultados:</h3>";

    questoes.forEach((q, i) => {
        let marcada = document.querySelector(`input[name="q${i}"]:checked`);
        if (marcada && marcada.value === q.correta) {
            certas++;
            resultadoHTML += `<p style="color:green">Questão ${i + 1}: Correta ✅</p>`;
        } else {
            resultadoHTML += `<p style="color:red">Questão ${i + 1}: Errada ❌ (Correta: ${q.correta})</p>`;
        }
    });

    let nota = (certas / questoes.length) * 10;
    resultadoHTML += `<p><b>Nota final:</b> ${nota.toFixed(1)}</p>`;
    document.getElementById("resultado").innerHTML = resultadoHTML;
}

montarQuiz();
  