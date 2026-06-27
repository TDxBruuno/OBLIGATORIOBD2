function mostrarCompras(compras) {

    let html = `
        <div class="compras-wrap">
            <h1>Mis compras</h1>
            <p class="compras-sub">Historial de todas tus compras.</p>
    `;

    if (compras.length === 0) {
        html += `<p style="color:#aaa; font-size:14px;">No tenés compras registradas.</p>`;
    } else {
        for (const compra of compras) {
            const fecha = new Date(compra.fecha);
            const dia = fecha.getDate();
            const mes = fecha.toLocaleString('es', { month: 'short' });
            const estadoClase = compra.estado === "COMPLETADA" ? "estado-activa" :
                compra.estado === "CANCELADA" ? "estado-usada" : "estado-transferida";

            html += `
                <div class="compra-row">
                    <div class="compra-fecha">
                        <div class="dia">${dia}</div>
                        <div class="mes">${mes}</div>
                    </div>
                    <div class="compra-divider"></div>
                    <div class="compra-info">
                        <div class="compra-title">Compra #${compra.id_compra}</div>
                        <div class="compra-meta">
                            <span>🎫 ${compra.cantidad_entradas} entrada${compra.cantidad_entradas > 1 ? 's' : ''}</span>
                            <span>💸 Comisión ${compra.comision}%</span>
                        </div>
                    </div>
                    <span class="estado-badge ${estadoClase}">${compra.estado}</span>
                    <div class="compra-monto">USD ${compra.monto_total}<br><small>total</small></div>
                </div>
            `;
        }
    }

    html += `
            <div class="compras-footer">
                <button class="btn-sec" id="btnVolverInicio">Volver</button>
            </div>
        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}