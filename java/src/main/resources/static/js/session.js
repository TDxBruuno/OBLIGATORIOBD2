let usuarioActual = null;

function iniciarSesion(usuario) {
    usuarioActual = usuario;
}

function cerrarSesion() {
    usuarioActual = null;
}

function obtenerUsuarioActual() {
    return usuarioActual;
}