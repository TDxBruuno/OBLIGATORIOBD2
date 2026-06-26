function mostrarRegistro() {
    document.getElementById("app").innerHTML = `
        <div class="login-container">
            <h1>Registro</h1>

            <input id="regMail" type="email" placeholder="Correo electrónico">

            <input id="regDocPais" type="text" placeholder="País documento">
            <input id="regDocTipo" type="text" placeholder="Tipo documento">
            <input id="regDocNumero" type="text" placeholder="Número documento">

            <input id="regDirPais" type="text" placeholder="País">
            <input id="regDirLocalidad" type="text" placeholder="Localidad">
            <input id="regDirCalle" type="text" placeholder="Calle">
            <input id="regDirNumero" type="text" placeholder="Número">
            <input id="regDirCodigoPostal" type="text" placeholder="Código postal">

            <input id="regTelefono" type="text" placeholder="Teléfono">

            <button id="btnCrearCuenta">Crear cuenta</button>
            <button id="btnVolverLogin" class="secundario">Volver</button>
        </div>
    `;

    document.getElementById("btnVolverLogin").addEventListener("click", mostrarLogin);

    document.getElementById("btnCrearCuenta").addEventListener("click", () => {

        const datos = {
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

        manejarRegistro(datos);

    });
}