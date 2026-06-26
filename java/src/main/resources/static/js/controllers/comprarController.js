async function cargarPantallaCompra() {

    try {

        const sectores = await listarSectoresDisponibles();

        mostrarPantallaCompra(sectores);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function confirmarCompraMultiple() {

    try {

        const usuario = obtenerUsuarioActual();

        const inputs = document.querySelectorAll(".cantidad-compra");

        const lineas = [];

        let totalEntradas = 0;

        inputs.forEach(input => {

            const cantidad = Number(input.value);
            const idEventoSector = Number(input.dataset.idEventoSector);

            if (cantidad > 0) {
                lineas.push({
                    idEventoSector: idEventoSector,
                    cantidad: cantidad
                });

                totalEntradas += cantidad;
            }

        });

        if (lineas.length === 0) {
            alert("Debe seleccionar al menos una entrada.");
            return;
        }

        if (totalEntradas > 5) {
            alert("No puede comprar más de 5 entradas en una misma transacción.");
            return;
        }

        const datos = {
            idUsuarioGeneral: usuario.id_usuario,
            fecha: new Date().toISOString().slice(0, 10),
            lineas: lineas
        };

        await crearCompra(datos);

        alert("Compra realizada correctamente.");

        cargarMisCompras();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}