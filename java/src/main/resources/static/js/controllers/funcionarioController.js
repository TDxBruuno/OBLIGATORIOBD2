async function confirmarValidacionEntrada() {

    try {

        const idEntrada = Number(document.getElementById("idEntradaValidar").value);
        const idControl = Number(document.getElementById("idControlValidar").value);
        const codigoToken = document.getElementById("tokenValidar").value.trim();

        if (!idEntrada || !idControl || codigoToken === "") {
            alert("Debe completar todos los campos.");
            return;
        }

        const datos = {
            idEntrada: idEntrada,
            idControl: idControl,
            codigoToken: codigoToken,
            momento: new Date().toISOString()
        };

        await validarEntrada(datos);

        alert("Entrada validada correctamente.");

        mostrarFuncionario();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}