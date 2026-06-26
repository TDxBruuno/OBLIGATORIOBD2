async function cargarPantallaCompra() {

    try {

        const sectores = await listarSectoresDisponibles();

        mostrarPantallaCompra(sectores);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function confirmarCompra(idEventoSector) {

    try {

        const usuario = obtenerUsuarioActual();

        const datos = {
            idUsuarioGeneral: usuario.id_usuario,
            fecha: new Date().toISOString().slice(0, 10),
            lineas: [
                {
                    idEventoSector: idEventoSector,
                    cantidad: 1
                }
            ]
        };

        await crearCompra(datos);

        alert("Compra realizada correctamente");

        cargarMisCompras();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}