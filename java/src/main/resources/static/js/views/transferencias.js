function mostrarTransferencias(transferencias) {

    let html = `
        <div class="transferencias-wrap">
            <h1>Mis transferencias</h1>
            <p class="transferencias-sub">Transferencias enviadas y recibidas.</p>
    `;

    if (transferencias.length === 0) {
        html += `<p style="color:#aaa; font-size:14px;">No tenés transferencias registradas.</p>`;
    } else {
        for (const transferencia of transferencias) {
            const fecha = new Date(transferencia.fecha_transferencia);
            const dia = fecha.getDate();
            const mes = fecha.toLocaleString('es', { month: 'short' });
            const estadoClase = transferencia.estado === "ACEPTADA" ? "estado-activa" :
                transferencia.estado === "RECHAZADA" ? "estado-usada" : "estado-transferida";
            const dirBadge = transferencia.direccion === "RECIBIDA" ? "📥 Recibida" : "📤 Enviada";

            html += `
                <div class="transferencia-row">
                    <div class="transferencia-fecha">
                        <div class="dia">${dia}</div>
                        <div class="mes">${mes}</div>
                    </div>
                    <div class="transferencia-divider"></div>
                    <div class="transferencia-info">
                        <div class="transferencia-title">${transferencia.equipo_local} vs ${transferencia.equipo_visitante} — Entrada #${transferencia.id_entrada}</div>
                        <div class="transferencia-meta">
                            <span>📅 ${transferencia.fecha_evento}</span>
                            <span>🏟️ ${transferencia.estadio}</span>
                            <span>🪑 ${transferencia.sector}</span>
                            <span>${dirBadge}</span>
                        </div>
                        <div class="transferencia-mails">
                            <span>De: ${transferencia.mail_origen}</span>
                            <span>→</span>
                            <span>Para: ${transferencia.mail_destino}</span>
                        </div>
                    </div>
                    <span class="estado-badge ${estadoClase}">${transferencia.estado}</span>
                    ${transferencia.estado === "PENDIENTE" && transferencia.direccion === "RECIBIDA" ? `
                        <div class="transferencia-acciones">
                            <button class="btn-aceptar" onclick="aceptar(${transferencia.id_transferencia})">Aceptar</button>
                            <button class="btn-rechazar" onclick="rechazar(${transferencia.id_transferencia})">Rechazar</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }

    html += `
            <div class="transferencias-footer">
                <button class="btn-sec" id="btnVolverInicio">Volver</button>
            </div>
        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}