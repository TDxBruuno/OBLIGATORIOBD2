function mostrarEntradas(entradas) {

    let html = `
        <div class="entradas-wrap">
            <h1>Mis entradas</h1>
            <p class="entradas-sub">Tus entradas se actualizan automáticamente cada 30 segundos.</p>
    `;

    if (entradas.length === 0) {
        html += `<p style="color:#aaa; font-size:14px;">No tenés entradas asignadas.</p>`;
    } else {
        for (const entrada of entradas) {
            const fecha = new Date(entrada.fecha_evento);
            const dia = fecha.getDate();
            const mes = fecha.toLocaleString('es', { month: 'short' });
            const estadoClase = entrada.estado_entrada === "ACTIVA" ? "estado-activa" :
                entrada.estado_entrada === "USADA" ? "estado-usada" : "estado-transferida";

            html += `
                <div class="entrada-row">
                    <div class="entrada-fecha">
                        <div class="dia">${dia}</div>
                        <div class="mes">${mes}</div>
                    </div>
                    <div class="entrada-divider"></div>
                    <div class="entrada-info">
                        <div class="entrada-title">${entrada.equipo_local} vs ${entrada.equipo_visitante}</div>
                        <div class="entrada-meta">
                            <span>🕐 ${entrada.hora_evento}</span>
                            <span>🏟️ ${entrada.estadio}</span>
                            <span>🪑 ${entrada.sector}</span>
                            <span>ID #${entrada.id_entrada}</span>
                        </div>
                        <div class="entrada-token">${entrada.codigo_token}</div>
                    </div>
                    <span class="estado-badge ${estadoClase}">${entrada.estado_entrada}</span>
                    ${entrada.estado_entrada === "ACTIVA" ? `<button class="btn-transferir" onclick="iniciarTransferencia(${entrada.id_entrada})">Transferir</button>` : ''}
                </div>
            `;
        }
    }

    html += `
            <div class="entradas-footer">
                <button class="btn-sec" id="btnVolverInicio">Volver</button>
            </div>
        </div>
    `;

    document.getElementById("app").innerHTML = html;

    const btnVolverInicio = document.getElementById("btnVolverInicio");
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener("click", () => {
            detenerRenovacionAutomaticaTokens();
            mostrarInicio(obtenerUsuarioActual());
        });
    }
}