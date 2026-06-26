function mostrarInicio(usuario) {

    let html = `
        <div class="login-container">

            <h1>Mundial Ticketing</h1>

            <p>Usuario: ${usuario.mail}</p>
            <p>Rol: ${usuario.tipo_usuario}</p>
    `;

    if (usuario.tipo_usuario === "GENERAL") {

        html += `
            <button id="btnComprarEntrada">Comprar entrada</button>
            <button id="btnMisEntradas">Mis entradas</button>
            <button id="btnMisCompras">Mis compras</button>
            <button id="btnTransferencias">Transferencias</button>
        `;

    } else if (usuario.tipo_usuario === "FUNCIONARIO") {

        html += `
            <button id="btnValidarEntrada">Validar entrada</button>
        `;

    } else if (usuario.tipo_usuario === "ADMINISTRADOR") {

        html += `
            <button id="btnAdministracion">Administración</button>
        `;
    }

    html += `
            <button id="btnCerrarSesion">
                Cerrar sesión
            </button>

        </div>
    `;

    document.getElementById("app").innerHTML = html;

    if (usuario.tipo_usuario === "GENERAL") {

        document.getElementById("btnComprarEntrada")
            .addEventListener("click", cargarPantallaCompra);

        document.getElementById("btnMisEntradas")
            .addEventListener("click", cargarMisEntradas);

        document.getElementById("btnMisCompras")
            .addEventListener("click", cargarMisCompras);

        document.getElementById("btnTransferencias")
            .addEventListener("click", cargarMisTransferencias);

    } else if (usuario.tipo_usuario === "FUNCIONARIO") {

        document.getElementById("btnValidarEntrada")
            .addEventListener("click", mostrarFuncionario);

    } else if (usuario.tipo_usuario === "ADMINISTRADOR") {

        document.getElementById("btnAdministracion")
            .addEventListener("click", () => {
                alert("Pantalla de administración en construcción.");
            });

    }

    document.getElementById("btnCerrarSesion")
        .addEventListener("click", () => {
            cerrarSesion();
            mostrarLogin();
        });

}