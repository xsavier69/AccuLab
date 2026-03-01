document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnWhatsApp');

    // Ejemplo: Un mensaje de bienvenida en consola
    console.log("Accu_lab web cargada correctamente.");

    // Podríamos añadir una función para que el botón parpadee suavemente
    setInterval(() => {
        btn.style.opacity = btn.style.opacity === '0.8' ? '1' : '0.8';
    }, 1000);
});