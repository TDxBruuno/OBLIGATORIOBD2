function mostrarFuncionario() {

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Validación de entrada</h1>

            <input
                id="idEntradaValidar"
                type="number"
                placeholder="ID de entrada">

            <input
                id="tokenValidar"
                type="text"
                placeholder="Token de la entrada">

            <select id="controlFuncionario">
                <option>Cargando dispositivos...</option>
            </select>

            <button id="btnValidarEntrada">
                Validar entrada
            </button>

            <hr style="margin:25px 0">

            <h2>Registrar dispositivo</h2>

            <input
                id="descripcionDispositivo"
                type="text"
                placeholder="Descripción del dispositivo">

            <button id="btnRegistrarDispositivo">
                Registrar dispositivo
            </button>

            <button id="btnVolverInicio" class="secundario">
                Volver
            </button>

        </div>
    `;

    cargarDispositivosFuncionario();

    document.getElementById("btnValidarEntrada")
        .addEventListener("click", confirmarValidacionEntrada);

    document.getElementById("btnRegistrarDispositivo")
        .addEventListener("click", registrarNuevoDispositivo);

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));

}