function aplicarTema(tema) {
    document.body.classList.remove("tema-claro", "tema-escuro");
    document.body.classList.add(`tema-${tema}`);
}

// Ao carregar a página, aplica o tema salvo
const tema = localStorage.getItem("temaSelecionado") || "claro";
aplicarTema(tema);

// Se existir o seletor de tema na página, adiciona o evento
const seletorTema = document.getElementById("tema");
if (seletorTema) {
    seletorTema.value = tema;
    seletorTema.addEventListener("change", function () {
        localStorage.setItem("temaSelecionado", this.value);
        aplicarTema(this.value);
    });
}
