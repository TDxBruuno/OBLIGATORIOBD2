function mostrarFuncionario() {

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Validación de entrada</h1>

            <p>Ingrese los datos de la entrada a validar.</p>

            <input
                id="idEntradaValidar"
                type="number"
                placeholder="ID de entrada">

            <input
                id="idControlValidar"
                type="number"
                placeholder="ID de control/dispositivo">

            <input
                id="tokenValidar"
                type="text"
                placeholder="Token de la entrada">

            <button id="btnValidarEntrada">
                Validar entrada
            </button>

            <button id="btnVolverInicio" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("btnValidarEntrada")
        .addEventListener("click", confirmarValidacionEntrada);

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));

}