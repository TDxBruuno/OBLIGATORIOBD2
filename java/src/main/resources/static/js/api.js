async function buscarUsuarioPorMail(mail) {
    const response = await fetch(`/api/usuarios?mail=${encodeURIComponent(mail)}`);

    if (response.ok) {
        return await response.json();
    }

    if (response.status === 404) {
        return null;
    }

    throw new Error("Error al buscar usuario");
}

async function registrarUsuarioGeneral(datos) {
    const response = await fetch("/api/usuarios/general", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al registrar usuario");
}

async function listarEntradasDeUsuario(idUsuario) {
    const response = await fetch(`/api/usuarios/${idUsuario}/entradas`);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al listar entradas");
}

async function listarComprasDeUsuario(idUsuario) {
    const response = await fetch(`/api/usuarios/${idUsuario}/compras`);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al listar compras");
}

async function listarSectoresDisponibles() {
    const response = await fetch("/api/eventos/sectores-disponibles");

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al listar sectores disponibles");
}

async function crearCompra(datos) {
    const response = await fetch("/api/compras", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al crear compra");
}

async function transferirEntrada(datos) {
    const response = await fetch("/api/transferencias", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al transferir entrada");
}

async function listarTransferenciasDeUsuario(idUsuario) {
    const response = await fetch(`/api/usuarios/${idUsuario}/transferencias`);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al listar transferencias");
}

async function aceptarTransferencia(idTransferencia) {
    const response = await fetch(`/api/transferencias/${idTransferencia}/aceptar`, {
        method: "PUT"
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al aceptar transferencia");
    }
}

async function rechazarTransferencia(idTransferencia) {
    const response = await fetch(`/api/transferencias/${idTransferencia}/rechazar`, {
        method: "PUT"
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al rechazar transferencia");
    }
}

async function validarEntrada(datos) {
    const response = await fetch("/api/entradas/validar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al validar entrada");
    }
}

async function renovarTokenEntrada(idEntrada) {
    const response = await fetch(`/api/entradas/${idEntrada}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            momento: new Date().toISOString()
        })
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al renovar token");
}

async function registrarEstadio(datos) {

    const response = await fetch("/api/estadios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al agregar estadio");
    }

    return await response.json();
}

async function obtenerEstadios(idAdmin = null) {

    const url = idAdmin
        ? `/api/estadios?idAdmin=${idAdmin}`
        : "/api/estadios";

    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener estadios");
}

async function registrarSector(idEstadio, datos) {

    const response = await fetch(`/api/estadios/${idEstadio}/sectores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al agregar sector");
    }

    return await response.json();
}

async function obtenerEquipos() {

    const response = await fetch("/api/equipos");

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener equipos");
}

async function crearEventoApi(datos) {

    const response = await fetch("/api/eventos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al crear evento");
}

async function registrarEquipo(datos) {

    const response = await fetch("/api/equipos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al agregar equipo");
}

async function obtenerEventos(idAdmin = null) {

    const url = idAdmin
        ? `/api/eventos?idAdmin=${idAdmin}`
        : "/api/eventos";

    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener eventos");
}

async function obtenerSectores(idAdmin = null) {

    const url = idAdmin
        ? `/api/sectores?idAdmin=${idAdmin}`
        : "/api/sectores";

    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener sectores");
}

async function habilitarSectorApi(idEvento, datos) {

    const response = await fetch(`/api/eventos/${idEvento}/sectores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al habilitar sector");
}

async function registrarFuncionario(datos) {
    const response = await fetch("/api/usuarios/funcionarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al registrar funcionario");
}

async function registrarAdministrador(datos) {
    const response = await fetch("/api/usuarios/admins", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al registrar administrador");
}

async function registrarDispositivo(datos) {

    const response = await fetch("/api/dispositivos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al registrar dispositivo");
}

async function vincularDispositivo(datos) {

    const response = await fetch("/api/controles-dispositivo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al vincular dispositivo");
}

async function obtenerControlesDeFuncionario(idFuncionario) {

    const response = await fetch(`/api/funcionarios/${idFuncionario}/controles`);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener dispositivos del funcionario");
}

async function obtenerFuncionarios() {

    const response = await fetch("/api/funcionarios");

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener funcionarios");
}

async function obtenerEventoSectoresHabilitados(idAdmin = null) {

    const url = idAdmin
        ? `/api/eventos/sectores-habilitados?idAdmin=${idAdmin}`
        : "/api/eventos/sectores-habilitados";

    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener sectores habilitados");
}

async function asignarFuncionarioEventoSectorApi(datos) {

    const response = await fetch("/api/funcionarios/asignaciones-evento-sector", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al asignar funcionario");
}

async function obtenerEventosMasEntradas() {

    const response = await fetch("/api/estadisticas/eventos-mas-entradas");

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener eventos con más entradas");
}

async function obtenerMayoresCompradores() {

    const response = await fetch("/api/estadisticas/mayores-compradores");

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    throw new Error(error.error || "Error al obtener ranking de compradores");
}

