function mostrarEntradas(entradas) {

    let html = `
        <div class="login-container">

            <h1>Mis entradas</h1>
    `;

    if (entradas.length === 0) {

        html += `
            <p>No tenés entradas asignadas.</p>
        `;

    } else {

        for (const entrada of entradas) {

            html += `
                <div class="card">

                    <h3>${entrada.equipo_local} vs ${entrada.equipo_visitante}</h3>

                    <p><strong>ID entrada:</strong> ${entrada.id_entrada}</p>
                    <p><strong>Fecha:</strong> ${entrada.fecha_evento}</p>
                    <p><strong>Hora:</strong> ${entrada.hora_evento}</p>
                    <p><strong>Estadio:</strong> ${entrada.estadio}</p>
                    <p><strong>Sector:</strong> ${entrada.sector}</p>
                    <p><strong>Estado:</strong> ${entrada.estado_entrada}</p>

                    <p><strong>Token actual:</strong></p>
                    <p style="word-break: break-all;">${entrada.codigo_token}</p>
            `;

            if (entrada.estado_entrada === "ACTIVA") {
                html += `
                    <button onclick="renovarTokenDesdeEntrada(${entrada.id_entrada})">
                        Renovar token
                    </button>

                    <button onclick="iniciarTransferencia(${entrada.id_entrada})">
                        Transferir
                    </button>
                `;
            }

            html += `
                </div>
                <br>
            `;
        }
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