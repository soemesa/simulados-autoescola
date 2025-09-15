const resultadoHTML = localStorage.getItem("resultadoSimulado");

document.getElementById("resultado").innerHTML =
    resultadoHTML || "<p>Nenhum resultado encontrado.</p>";


document.getElementById("finalizarBtn").addEventListener("click", function () {
    // Redireciona para o menu ou página inicial
    window.location.href = "../index.html";
});
