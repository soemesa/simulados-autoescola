const detalhesHTML = localStorage.getItem("detalhesSimulado");
document.getElementById("detalhes").innerHTML =
    detalhesHTML || "<p>Nenhum detalhamento encontrado.</p>";

document.getElementById("finalizarBtn").addEventListener("click", function () {
    window.location.href = "../index.html";
});
