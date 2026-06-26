let intervaloTokensEntradas = null;

async function cargarMisEntradas() {

    try {

        detenerRenovacionAutomaticaTokens();

        const usuario = obtenerUsuarioActual();

        const entradas = await listarEntradasDeUsuario(usuario.id_usuario);

        mostrarEntradas(entradas);

        iniciarRenovacionAutomaticaTokens(entradas);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

function iniciarRenovacionAutomaticaTokens(entradas) {

    detenerRenovacionAutomaticaTokens();

    const entradasActivas = entradas.filter(entrada => entrada.estado_entrada === "ACTIVA");

    if (entradasActivas.length === 0) {
        return;
    }

    intervaloTokensEntradas = setInterval(async () => {

        try {

            for (const entrada of entradasActivas) {
                await renovarTokenEntrada(entrada.id_entrada);
            }

            const usuario = obtenerUsuarioActual();

            const entradasActualizadas = await listarEntradasDeUsuario(usuario.id_usuario);

            mostrarEntradas(entradasActualizadas);

            iniciarRenovacionAutomaticaTokens(entradasActualizadas);

        } catch (error) {

            console.error(error);

            detenerRenovacionAutomaticaTokens();

            alert(error.message);

        }

    }, 30000);

}

function detenerRenovacionAutomaticaTokens() {

    if (intervaloTokensEntradas !== null) {
        clearInterval(intervaloTokensEntradas);
        intervaloTokensEntradas = null;
    }

}