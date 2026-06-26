function mostrarPantallaCompra(sectores) {

    let html = `
        <div class="login-container">

            <h1>Comprar entradas</h1>
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

                <button onclick="confirmarCompra(${sector.id_evento_sector})">
                    Comprar
                </button>

            </div>
            <br>
        `;
    }

    html += `
        <button id="btnVolverInicio" class="secundario">
            Volver
        </button>

        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document
        .getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));

}