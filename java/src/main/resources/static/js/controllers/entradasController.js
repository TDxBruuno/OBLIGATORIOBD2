async function cargarMisEntradas() {

    try {

        const usuario = obtenerUsuarioActual();

        const entradas = await listarEntradasDeUsuario(usuario.id_usuario);

        mostrarEntradas(entradas);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function renovarTokenDesdeEntrada(idEntrada) {

    try {

        await renovarTokenEntrada(idEntrada);

        alert("Token renovado correctamente.");

        cargarMisEntradas();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}