async function cargarMisCompras() {
    try {
        const usuario = obtenerUsuarioActual();

        const compras = await listarComprasDeUsuario(usuario.id_usuario);

        mostrarCompras(compras);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}