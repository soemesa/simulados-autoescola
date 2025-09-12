const resultadoHTML = localStorage.getItem("resultadoSimulado");
const detalhesHTML = localStorage.getItem("detalhesSimulado");

document.getElementById("resultado").innerHTML =
    resultadoHTML || "<p>Nenhum resultado encontrado.</p>";

document.getElementById("detalhesBtn").addEventListener("click", function () {
    document.getElementById("resultado").innerHTML =
        detalhesHTML || "<p>Nenhum detalhamento encontrado.</p>";
    this.style.display = "none"; // Esconde o botão após mostrar detalhes
});

document.getElementById("finalizarBtn").addEventListener("click", function () {
    // Redireciona para o menu ou página inicial
    window.location.href = "index.html";
});
