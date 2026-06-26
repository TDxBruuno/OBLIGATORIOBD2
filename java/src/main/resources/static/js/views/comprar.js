function mostrarPantallaCompra(sectores) {

    let html = `
        <div class="login-container">

            <h1>Comprar entradas</h1>

            <p>Seleccione la cantidad de entradas por sector.</p>
            <p><strong>Máximo:</strong> 5 entradas por compra.</p>
    `;

    for (const sector of sectores) {

        html += `
            <div class="card">

                <h3>${sector.equipo_local} vs ${sector.equipo_visitante}</h3>

                <p><strong>Fecha:</strong> ${sector.fecha}</p>
                <p><strong>Hora:</strong> ${sector.hora}</p>
                <p><strong>Estadio:</strong> ${sector.estadio}</p>
                <p><strong>Sector:</strong> ${sector.sector}</p>
                <p><strong>Precio:</strong> USD ${sector.precio}</p>
                <p><strong>Disponibles:</strong> ${sector.disponibles}</p>

                <input
                    class="cantidad-compra"
                    type="number"
                    min="0"
                    max="${Math.min(5, sector.disponibles)}"
                    value="0"
                    data-id-evento-sector="${sector.id_evento_sector}">
            </div>
            <br>
        `;
    }

    html += `
            <button id="btnConfirmarCompra">
                Confirmar compra
            </button>

            <button id="btnVolverInicio" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document
        .getElementById("btnConfirmarCompra")
        .addEventListener("click", confirmarCompraMultiple);

    document
        .getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));

}