function mostrarInicio(usuario) {

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Mundial Ticketing</h1>

            <p>Usuario: ${usuario.mail}</p>
            <p>Rol: ${usuario.tipo_usuario}</p>

            <button id="btnComprarEntrada">Comprar entrada</button>
            <button id="btnMisEntradas">Mis entradas</button>
            <button id="btnMisCompras">Mis compras</button>
            <button id="btnTransferencias">Transferencias</button>
            <button id="btnCerrarSesion">Cerrar sesión</button>

        </div>
    `;

    document.getElementById("btnComprarEntrada")
        .addEventListener("click", cargarPantallaCompra);

    document.getElementById("btnMisEntradas")
        .addEventListener("click", cargarMisEntradas);

    document.getElementById("btnMisCompras")
        .addEventListener("click", cargarMisCompras);

    document.getElementById("btnCerrarSesion")
        .addEventListener("click", () => {
            cerrarSesion();
            mostrarLogin();
        });

    document.getElementById("btnTransferencias")
        .addEventListener("click", cargarMisTransferencias);
}