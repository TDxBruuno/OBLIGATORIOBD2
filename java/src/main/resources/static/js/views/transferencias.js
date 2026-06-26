function mostrarTransferencias(transferencias) {

    let html = `
        <div class="login-container">

            <h1>Mis transferencias</h1>
    `;

    if (transferencias.length === 0) {

        html += `
            <p>No tenés transferencias registradas.</p>
        `;

    } else {

        for (const transferencia of transferencias) {

            html += `
                <div class="card">

                    <h3>Entrada #${transferencia.id_entrada}</h3>

                    <p><strong>Partido:</strong> ${transferencia.equipo_local} vs ${transferencia.equipo_visitante}</p>
                    <p><strong>Fecha evento:</strong> ${transferencia.fecha_evento}</p>
                    <p><strong>Hora evento:</strong> ${transferencia.hora_evento}</p>
                    <p><strong>Estadio:</strong> ${transferencia.estadio}</p>
                    <p><strong>Sector:</strong> ${transferencia.sector}</p>

                    <p><strong>Origen:</strong> ${transferencia.mail_origen}</p>
                    <p><strong>Destino:</strong> ${transferencia.mail_destino}</p>
                    <p><strong>Dirección:</strong> ${transferencia.direccion}</p>

                    <p><strong>Fecha transferencia:</strong> ${transferencia.fecha_transferencia}</p>
                    <p><strong>Estado:</strong> ${transferencia.estado}</p>
            `;

            if (
                transferencia.estado === "PENDIENTE" &&
                transferencia.direccion === "RECIBIDA"
            ) {

                html += `
                    <button onclick="aceptar(${transferencia.id_transferencia})">
                        Aceptar
                    </button>

                    <button onclick="rechazar(${transferencia.id_transferencia})">
                        Rechazar
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