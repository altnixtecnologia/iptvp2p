// Arquivo pronto para futuras funcionalidades.
// Por exemplo, uma galeria de imagens interativa ou animações.
console.log("Site carregado com sucesso!");

// Exemplo: Rolagem suave para as âncoras do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
