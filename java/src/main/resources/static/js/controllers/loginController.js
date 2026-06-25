async function manejarLogin(mail) {
    if (mail === "") {
        alert("Ingrese un correo electrónico.");
        return;
    }

    try {
        const usuario = await buscarUsuarioPorMail(mail);

        if (usuario === null) {
            alert("Ese correo no está registrado.");
            return;
        }

        iniciarSesion(usuario);
        mostrarInicio(usuario);

    } catch (error) {
        console.error(error);
        alert("No fue posible conectar con el servidor.");
    }
}