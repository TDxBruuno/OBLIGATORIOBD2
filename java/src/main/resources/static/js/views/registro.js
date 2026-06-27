function mostrarRegistro() {
    document.getElementById("app").innerHTML = `
        <div class="reg-card">

            <div class="reg-left">
                <svg class="login-ball" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" fill="white"/>
                    <path d="M50 2 L62 18 L80 12 L80 32 L98 38 L86 52 L94 70 L76 72 L70 90 L50 82 L30 90 L24 72 L6 70 L14 52 L2 38 L20 32 L20 12 L38 18 Z" fill="none" stroke="black" stroke-width="1.5"/>
                </svg>
                <div>
                    <div class="login-badge">Mundial 2026</div>
                    <h2>Creá tu cuenta y viví el mundial</h2>
                    <p>Registrate para comprar, transferir y gestionar tus entradas al Mundial 2026.</p>
                </div>
            </div>

            <div class="reg-right">
                <div class="login-logo">
                    <div class="login-logo-icon">⚽</div>
                    <span>Mundial Ticketing</span>
                </div>

                <h1>Crear cuenta</h1>
                <p class="subtitulo">Completá tus datos para registrarte</p>

                <div class="section-label">Tipo de cuenta</div>
                <div class="reg-grid1">
                    <select id="regTipoUsuario">
                        <option value="GENERAL">Usuario general</option>
                        <option value="FUNCIONARIO">Funcionario de validación</option>
                        <option value="ADMIN">Administrador país sede</option>
                    </select>
                </div>

                <div class="section-label">Cuenta</div>
                <div class="reg-grid1">
                    <input id="regMail" type="email" placeholder="Correo electrónico">
                </div>

                <div class="section-label">Documento</div>
                <div class="reg-grid3">
                    <input id="regDocPais" type="text" placeholder="País">
                    <input id="regDocTipo" type="text" placeholder="Tipo">
                    <input id="regDocNumero" type="text" placeholder="Número">
                </div>

                <div class="section-label">Dirección</div>
                <div class="reg-grid2">
                    <input id="regDirPais" type="text" placeholder="País">
                    <input id="regDirLocalidad" type="text" placeholder="Localidad">
                </div>
                <div class="reg-grid3">
                    <input id="regDirCalle" type="text" placeholder="Calle">
                    <input id="regDirNumero" type="text" placeholder="Número">
                    <input id="regDirCodigoPostal" type="text" placeholder="Código postal">
                </div>

                <div class="section-label">Contacto</div>
                <div class="reg-grid1">
                    <input id="regTelefono" type="text" placeholder="Teléfono">
                </div>

                <div id="camposExtraRegistro"></div>

                <div class="btn-row">
                    <button id="btnVolverLogin" class="secundario">Volver</button>
                    <button id="btnCrearCuenta" class="btn-primary">Crear cuenta</button>
                </div>
            </div>

        </div>
    `;

    actualizarCamposExtraRegistro();

    document.getElementById("regTipoUsuario")
        .addEventListener("change", actualizarCamposExtraRegistro);

    document.getElementById("btnVolverLogin")
        .addEventListener("click", mostrarLogin);

    document.getElementById("btnCrearCuenta").addEventListener("click", () => {
        const datos = {
            tipoUsuario: document.getElementById("regTipoUsuario").value,
            mail: document.getElementById("regMail").value.trim(),
            docPais: document.getElementById("regDocPais").value.trim(),
            docTipo: document.getElementById("regDocTipo").value.trim(),
            docNumero: document.getElementById("regDocNumero").value.trim(),
            dirPais: document.getElementById("regDirPais").value.trim(),
            dirLocalidad: document.getElementById("regDirLocalidad").value.trim(),
            dirCalle: document.getElementById("regDirCalle").value.trim(),
            dirNumero: document.getElementById("regDirNumero").value.trim(),
            dirCodigoPostal: document.getElementById("regDirCodigoPostal").value.trim(),
            telefono: document.getElementById("regTelefono").value.trim()
        };

        if (datos.tipoUsuario === "FUNCIONARIO") {
            datos.legajo = document.getElementById("regLegajo").value.trim();
        }

        if (datos.tipoUsuario === "ADMIN") {
            datos.fechaAsignacion = document.getElementById("regFechaAsignacion").value;
        }

        manejarRegistro(datos);
    });
}

function actualizarCamposExtraRegistro() {

    const tipo = document.getElementById("regTipoUsuario").value;
    const contenedor = document.getElementById("camposExtraRegistro");

    if (tipo === "FUNCIONARIO") {
        contenedor.innerHTML = `
            <input id="regLegajo" type="text" placeholder="Número de legajo">
        `;
    } else if (tipo === "ADMIN") {
        contenedor.innerHTML = `
            <input id="regFechaAsignacion" type="date">
        `;
    } else {
        contenedor.innerHTML = "";
    }
}