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

