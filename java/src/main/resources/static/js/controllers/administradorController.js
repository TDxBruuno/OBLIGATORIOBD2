async function crearEstadio() {

    const nombre = prompt("Nombre del estadio:");

    if (!nombre || nombre.trim() === "") {
        return;
    }

    try {

        await registrarEstadio({
            nombre: nombre.trim()
        });

        alert("Estadio agregado correctamente.");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

async function crearSector() {

    try {

        const estadios = await obtenerEstadios();

        mostrarFormularioSector(estadios);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

async function guardarSector() {

    const idEstadio = document.getElementById("sectorEstadio").value;
    const nombre = document.getElementById("sectorNombre").value.trim();
    const capMax = Number(document.getElementById("sectorCapacidad").value);

    if (!idEstadio || nombre === "" || !capMax || capMax <= 0) {
        alert("Debe completar todos los campos correctamente.");
        return;
    }

    try {

        await registrarSector(idEstadio, {
            nombre: nombre,
            capMax: capMax
        });

        alert("Sector agregado correctamente.");

        mostrarAdministrador();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

function crearEquipo() {
    mostrarFormularioEquipo();
}

async function guardarEquipo() {

    const nombre = document.getElementById("equipoNombre").value.trim();

    if (nombre === "") {
        alert("Debe ingresar el nombre del equipo.");
        return;
    }

    try {

        await registrarEquipo({
            nombre: nombre
        });

        alert("Equipo agregado correctamente.");

        mostrarAdministrador();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

async function crearEvento() {

    try {

        const estadios = await obtenerEstadios();
        const equipos = await obtenerEquipos();

        mostrarFormularioEvento(estadios, equipos);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

async function guardarEvento() {

    const fecha = document.getElementById("eventoFecha").value;
    const hora = document.getElementById("eventoHora").value;
    const idEstadio = Number(document.getElementById("eventoEstadio").value);
    const equipoLocalId = Number(document.getElementById("eventoLocal").value);
    const equipoVisitanteId = Number(document.getElementById("eventoVisitante").value);
    const usuario = obtenerUsuarioActual();

    if (!fecha || !hora || !idEstadio || !equipoLocalId || !equipoVisitanteId) {
        alert("Debe completar todos los campos.");
        return;
    }

    if (equipoLocalId === equipoVisitanteId) {
        alert("El equipo local y visitante no pueden ser el mismo.");
        return;
    }

    try {

        await crearEventoApi({
            fecha: fecha,
            hora: hora,
            idEstadio: idEstadio,
            idAdmPaisSede: usuario.id_usuario,
            equipoLocalId: equipoLocalId,
            equipoVisitanteId: equipoVisitanteId
        });

        alert("Evento creado correctamente.");

        mostrarAdministrador();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

async function habilitarSectorEvento() {

    try {

        const eventos = await obtenerEventos();
        const sectores = await obtenerSectores();

        mostrarFormularioHabilitarSector(eventos, sectores);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

async function guardarSectorEvento() {

    const idEvento = Number(document.getElementById("habilitarEvento").value);
    const idSector = Number(document.getElementById("habilitarSector").value);
    const precio = Number(document.getElementById("habilitarPrecio").value);
    const capacidad = Number(document.getElementById("habilitarCapacidad").value);

    if (!idEvento || !idSector || precio < 0 || !capacidad || capacidad <= 0) {
        alert("Debe completar todos los campos correctamente.");
        return;
    }

    try {

        await habilitarSectorApi(idEvento, {
            idSector: idSector,
            precio: precio,
            capacidad: capacidad
        });

        alert("Sector habilitado correctamente.");

        mostrarAdministrador();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}