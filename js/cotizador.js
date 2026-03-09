document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checkbox-box input[type="checkbox"]');
    const resumenLista = document.getElementById('resumen-lista');
    const precioTotalEl = document.getElementById('precio-total');
    const btnEnviarWa = document.getElementById('btn-enviar-wa');
    
    let total = 0;
    let examenesSeleccionados = [];

    // Manejar cambios en los checkboxes
    checkboxes.forEach(chk => {
        chk.addEventListener('change', function() {
            const labelContent = this.closest('.checkbox-box');
            
            if (this.checked) {
                // Agregar clase para estilo visual
                labelContent.classList.add('selected');
            } else {
                // Remover clase
                labelContent.classList.remove('selected');
            }
            
            actualizarResumen();
        });
    });

    function actualizarResumen() {
        total = 0;
        examenesSeleccionados = [];
        resumenLista.innerHTML = ''; // Limpiar lista
        
        // Recopilar elementos seleccionados
        checkboxes.forEach(chk => {
            if (chk.checked) {
                const nombre = chk.getAttribute('data-nombre');
                const precio = parseFloat(chk.value);
                
                total += precio;
                examenesSeleccionados.push({ nombre, precio });
                
                // Crear nodo HTML para el resumen
                const itemDiv = document.createElement('div');
                itemDiv.className = 'resumen-item';
                itemDiv.innerHTML = `<span>${nombre}</span> <span class="item-precio">$${precio.toFixed(2)}</span>`;
                resumenLista.appendChild(itemDiv);
            }
        });

        // Actualizar UI
        precioTotalEl.innerText = `$${total.toFixed(2)}`;

        if (examenesSeleccionados.length === 0) {
            resumenLista.innerHTML = '<p class="empty-state">No has seleccionado exámenes aún.</p>';
            btnEnviarWa.disabled = true;
        } else {
            btnEnviarWa.disabled = false;
        }
    }

    // Manejar el clic en "Enviar por WhatsApp"
    btnEnviarWa.addEventListener('click', () => {
        if (examenesSeleccionados.length === 0) return;

        const telefono = "593996405647"; // Número Accu-Lab
        let mensaje = "Hola Accu-Lab Clínico, me gustaría agendar y confirmar el precio para los siguientes exámenes que calculé en su página web:\n\n";
        
        examenesSeleccionados.forEach(ex => {
            mensaje += `✅ ${ex.nombre} ($${ex.precio.toFixed(2)})\n`;
        });
        
        mensaje += `\n*Total Estimado: $${total.toFixed(2)}* \n\n¿Poseen disponibilidad para el día de hoy o mañana?`;

        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWa = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
        
        // Abrir WhatsApp en nueva pestaña
        window.open(urlWa, '_blank');
    });
});
