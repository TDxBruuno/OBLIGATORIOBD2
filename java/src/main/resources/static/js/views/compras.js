function mostrarCompras(compras) {
    let html = `
        <div class="login-container">
            <h1>Mis compras</h1>
    `;

    if (compras.length === 0) {
        html += `<p>No tenés compras registradas.</p>`;
    } else {
        for (const compra of compras) {
            html += `
                <div class="card">
                    <h3>Compra #${compra.id_compra}</h3>
                    <p><strong>Fecha:</strong> ${compra.fecha}</p>
                    <p><strong>Estado:</strong> ${compra.estado}</p>
                    <p><strong>Monto total:</strong> ${compra.monto_total}</p>
                    <p><strong>Comisión:</strong> ${compra.comision}%</p>
                    <p><strong>Cantidad de entradas:</strong> ${compra.cantidad_entradas}</p>
                </div>
            `;
        }
    }

    html += `
            <br>
            <button id="btnVolverInicio" class="secundario">Volver</button>
        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}