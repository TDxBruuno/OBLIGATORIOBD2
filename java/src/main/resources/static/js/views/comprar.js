function mostrarPantallaCompra(sectores) {

    let html = `
        <div class="compra-wrap">
            <div class="compra-header">
                <h1>Comprar entradas</h1>
            </div>
            <p class="compra-sub">Seleccioná la cantidad de entradas por sector. Máximo 5 por compra.</p>
            <div class="compra-grid">
    `;

    for (const sector of sectores) {
        html += `
            <div class="partido-card">
                <div class="partido-title">${sector.equipo_local} vs ${sector.equipo_visitante}</div>
                <div class="partido-info">
                    <span>📅 ${sector.fecha}</span>
                    <span>🕐 ${sector.hora}</span>
                    <span>🏟️ ${sector.estadio}</span>
                    <span>🪑 Sector ${sector.sector}</span>
                </div>
                <div class="partido-precio">USD ${sector.precio} <small>/ entrada</small></div>
                <div class="partido-disponibles">${sector.disponibles} disponibles</div>
                <div class="cantidad-row">
                    <label>Cantidad</label>
                    <input
                        class="cantidad-compra"
                        type="number"
                        min="0"
                        max="${Math.min(5, sector.disponibles)}"
                        value="0"
                        data-id-evento-sector="${sector.id_evento_sector}">
                </div>
            </div>
        `;
    }

    html += `
            </div>
            <div class="compra-footer">
                <button class="btn-sec" id="btnVolverInicio">Volver</button>
                <button class="btn-primary" id="btnConfirmarCompra">Confirmar compra</button>
            </div>
        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document.getElementById("btnConfirmarCompra")
        .addEventListener("click", confirmarCompraMultiple);

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}