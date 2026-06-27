function mostrarInicio(usuario) {

    let html = `
        <div class="inicio-card">
            <div class="inicio-top-row">
                <span class="inicio-chip">⚽ Mundial Ticketing</span>
                <span class="inicio-chip">${usuario.mail}</span>
            </div>

            <h1>¿Qué querés hacer?</h1>
            <p class="subtitulo">Seleccioná una opción para continuar.</p>
    `;

    if (usuario.tipo_usuario === "GENERAL") {
        html += `
            <button class="option-btn" id="btnComprarEntrada">
                <div class="opt-icon"></div>
                <div>
                    <div class="opt-title">Comprar entrada</div>
                    <div class="opt-sub">Buscá y comprá entradas para los partidos</div>
                </div>
            </button>
            <button class="option-btn" id="btnMisEntradas">
                <div class="opt-icon"></div>
                <div>
                    <div class="opt-title">Mis entradas</div>
                    <div class="opt-sub">Revisá las entradas que ya tenés</div>
                </div>
            </button>
            <button class="option-btn" id="btnMisCompras">
                <div class="opt-icon"></div>
                <div>
                    <div class="opt-title">Mis compras</div>
                    <div class="opt-sub">Historial de todas tus compras</div>
                </div>
            </button>
            <button class="option-btn" id="btnTransferencias">
                <div class="opt-icon"></div>
                <div>
                    <div class="opt-title">Transferencias</div>
                    <div class="opt-sub">Transferí entradas a otros usuarios</div>
                </div>
            </button>
        `;
    } else if (usuario.tipo_usuario === "FUNCIONARIO") {
        html += `
            <button class="option-btn" id="btnValidarEntrada">
                <div class="opt-icon"></div>
                <div>
                    <div class="opt-title">Validar entrada</div>
                    <div class="opt-sub">Escaneá y validá entradas en el estadio</div>
                </div>
            </button>
        `;
    } else if (usuario.tipo_usuario === "ADMIN") {
        html += `
            <button class="option-btn" id="btnAdministracion">
                <div class="opt-icon">⚙</div>
                <div>
                    <div class="opt-title">Administración</div>
                    <div class="opt-sub">Gestioná usuarios, partidos y configuraciones</div>
                </div>
            </button>
        `;
    }

    html += `
            <button class="btn-primary" id="btnCerrarSesion">Cerrar sesión</button>
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
    } else if (usuario.tipo_usuario === "ADMIN") {
        document.getElementById("btnAdministracion")
            .addEventListener("click", mostrarAdministrador);
    }

    document.getElementById("btnCerrarSesion")
        .addEventListener("click", () => {
            cerrarSesion();
            mostrarLogin();
        });
}