async function cargarMisTransferencias() {

    try {

        const usuario = obtenerUsuarioActual();

        const transferencias = await listarTransferenciasDeUsuario(usuario.id_usuario);

        mostrarTransferencias(transferencias);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function iniciarTransferencia(idEntrada) {

    const mail = prompt("Ingrese el correo del destinatario:");

    if (!mail) {
        return;
    }

    try {

        const usuarioDestino = await buscarUsuarioPorMail(mail);

        if (!usuarioDestino) {
            alert("No existe un usuario con ese correo.");
            return;
        }

        const usuarioActual = obtenerUsuarioActual();

        await transferirEntrada({
            idEntrada: idEntrada,
            idUsuarioTransfiere: usuarioActual.id_usuario,
            idUsuarioRecibe: usuarioDestino.id_usuario
        });

        alert("Transferencia creada correctamente.");

        cargarMisTransferencias();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function aceptar(idTransferencia) {

    try {

        await aceptarTransferencia(idTransferencia);

        cargarMisTransferencias();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function rechazar(idTransferencia) {

    try {

        await rechazarTransferencia(idTransferencia);

        cargarMisTransferencias();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}