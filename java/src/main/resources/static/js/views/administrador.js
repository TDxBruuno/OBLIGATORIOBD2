function mostrarAdministrador() {

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Administración</h1>

            <button id="btnCrearEstadio">
                Agregar estadio
            </button>

            <button id="btnCrearSector">
                Agregar sector a estadio
            </button>

            <button id="btnCrearEquipo">
                Agregar equipo
            </button>

            <button id="btnCrearEvento">
                Crear evento
            </button>

            <button id="btnHabilitarSector">
                Habilitar sector para evento
            </button>

            <button id="btnAsignarFuncionarioEventoSector">
                Asignar funcionario a evento-sector
            </button>

            <button id="btnEstadisticas">
                Estadísticas
            </button>

            <button id="btnVolver" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("btnCrearEstadio")
        .addEventListener("click", crearEstadio);

    document.getElementById("btnCrearSector")
        .addEventListener("click", crearSector);

    document.getElementById("btnCrearEquipo")
        .addEventListener("click", crearEquipo);

    document.getElementById("btnCrearEvento")
        .addEventListener("click", crearEvento);

    document.getElementById("btnHabilitarSector")
        .addEventListener("click", habilitarSectorEvento);

    document.getElementById("btnAsignarFuncionarioEventoSector")
        .addEventListener("click", asignarFuncionarioEventoSector);

    document.getElementById("btnEstadisticas")
        .addEventListener("click", cargarEstadisticas);

    document.getElementById("btnVolver")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}

function mostrarFormularioSector(estadios) {

    let opcionesEstadios = "";

    for (const estadio of estadios) {
        opcionesEstadios += `
            <option value="${estadio.id_estadio}">
                ${estadio.nombre}
            </option>
        `;
    }

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Agregar sector</h1>

            <input
                id="sectorNombre"
                type="text"
                placeholder="Nombre del sector">

            <input
                id="sectorCapacidad"
                type="number"
                placeholder="Capacidad máxima">

            <select id="sectorEstadio">
                ${opcionesEstadios}
            </select>

            <button id="btnGuardarSector">
                Guardar sector
            </button>

            <button id="btnVolverAdmin" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("btnGuardarSector")
        .addEventListener("click", guardarSector);

    document.getElementById("btnVolverAdmin")
        .addEventListener("click", mostrarAdministrador);
}

function mostrarFormularioEvento(estadios, equipos) {

    let opcionesEstadios = "";
    let opcionesEquipos = "";

    for (const estadio of estadios) {
        opcionesEstadios += `
            <option value="${estadio.id_estadio}">
                ${estadio.nombre}
            </option>
        `;
    }

    for (const equipo of equipos) {
        opcionesEquipos += `
            <option value="${equipo.id_equipo}">
                ${equipo.nombre}
            </option>
        `;
    }

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Crear evento</h1>

            <input
                id="eventoFecha"
                type="date">

            <input
                id="eventoHora"
                type="time">

            <select id="eventoEstadio">
                ${opcionesEstadios}
            </select>

            <select id="eventoLocal">
                ${opcionesEquipos}
            </select>

            <select id="eventoVisitante">
                ${opcionesEquipos}
            </select>

            <button id="btnGuardarEvento">
                Guardar evento
            </button>

            <button id="btnVolverAdmin" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("btnGuardarEvento")
        .addEventListener("click", guardarEvento);

    document.getElementById("btnVolverAdmin")
        .addEventListener("click", mostrarAdministrador);
}

function mostrarFormularioEquipo() {

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Agregar equipo</h1>

            <input
                id="equipoNombre"
                type="text"
                placeholder="Nombre del equipo">

            <button id="btnGuardarEquipo">
                Guardar equipo
            </button>

            <button id="btnVolverAdmin" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("btnGuardarEquipo")
        .addEventListener("click", guardarEquipo);

    document.getElementById("btnVolverAdmin")
        .addEventListener("click", mostrarAdministrador);
}

function mostrarFormularioHabilitarSector(eventos, sectores) {

    let opcionesEventos = "";
    let opcionesSectores = "";

    for (const evento of eventos) {
        opcionesEventos += `
            <option value="${evento.id_evento}">
                ${evento.fecha} ${evento.hora} - ${evento.equipo_local} vs ${evento.equipo_visitante} - ${evento.estadio}
            </option>
        `;
    }

    for (const sector of sectores) {
        opcionesSectores += `
            <option value="${sector.id_sector}">
                ${sector.estadio} - Sector ${sector.nombre} - Cap. máx: ${sector.cap_max}
            </option>
        `;
    }

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Habilitar sector para evento</h1>

            <select id="habilitarEvento">
                ${opcionesEventos}
            </select>

            <select id="habilitarSector">
                ${opcionesSectores}
            </select>

            <input
                id="habilitarPrecio"
                type="number"
                min="0"
                step="0.01"
                placeholder="Precio">

            <input
                id="habilitarCapacidad"
                type="number"
                min="1"
                placeholder="Capacidad habilitada">

            <button id="btnGuardarSectorEvento">
                Habilitar sector
            </button>

            <button id="btnVolverAdmin" class="secundario">
                Volver
            </button>

        </div>
    `;

    function actualizarSectoresPorEvento() {

        const idEventoSeleccionado = Number(document.getElementById("habilitarEvento").value);
        const eventoSeleccionado = eventos.find(e => Number(e.id_evento) === idEventoSeleccionado);

        let opcionesSectoresFiltrados = "";

        for (const sector of sectores) {

            if (sector.estadio === eventoSeleccionado.estadio) {
                opcionesSectoresFiltrados += `
                    <option value="${sector.id_sector}">
                        ${sector.estadio} - Sector ${sector.nombre} - Cap. máx: ${sector.cap_max}
                    </option>
                `;
            }
        }

        document.getElementById("habilitarSector").innerHTML = opcionesSectoresFiltrados;
    }

    document.getElementById("habilitarEvento")
        .addEventListener("change", actualizarSectoresPorEvento);

    actualizarSectoresPorEvento();

    document.getElementById("btnGuardarSectorEvento")
        .addEventListener("click", guardarSectorEvento);

    document.getElementById("btnVolverAdmin")
        .addEventListener("click", mostrarAdministrador);
}

function mostrarFormularioAsignarFuncionario(funcionarios, eventoSectores) {

    let opcionesFuncionarios = "";
    let opcionesEventoSectores = "";

    for (const funcionario of funcionarios) {
        opcionesFuncionarios += `
            <option value="${funcionario.id_usuario}">
                ${funcionario.mail} - Legajo: ${funcionario.num_legajo}
            </option>
        `;
    }

    for (const es of eventoSectores) {
        opcionesEventoSectores += `
            <option value="${es.id_evento_sector}">
                ${es.fecha} ${es.hora} - ${es.equipo_local} vs ${es.equipo_visitante} - ${es.estadio} - Sector ${es.sector}
            </option>
        `;
    }

    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Asignar funcionario</h1>

            <select id="asignarFuncionario">
                ${opcionesFuncionarios}
            </select>

            <select id="asignarEventoSector">
                ${opcionesEventoSectores}
            </select>

            <button id="btnGuardarAsignacionFuncionario">
                Guardar asignación
            </button>

            <button id="btnVolverAdmin" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("btnGuardarAsignacionFuncionario")
        .addEventListener("click", guardarAsignacionFuncionarioEventoSector);

    document.getElementById("btnVolverAdmin")
        .addEventListener("click", mostrarAdministrador);
}

function mostrarEstadisticas(eventos, compradores) {

    let html = `
        <div class="login-container">

            <h1>Estadísticas</h1>

            <h2>Eventos con más entradas vendidas</h2>
    `;

    if (eventos.length === 0) {

        html += `
            <p>No hay ventas registradas.</p>
        `;

    } else {

        for (const evento of eventos) {

            html += `
                <div class="card">
                    <h3>${evento.equipo_local} vs ${evento.equipo_visitante}</h3>
                    <p><strong>Fecha:</strong> ${evento.fecha}</p>
                    <p><strong>Hora:</strong> ${evento.hora}</p>
                    <p><strong>Estadio:</strong> ${evento.estadio}</p>
                    <p><strong>Entradas vendidas:</strong> ${evento.total_entradas_vendidas}</p>
                </div>
                <br>
            `;
        }
    }

    html += `
            <hr style="margin:25px 0">

            <h2>Ranking de mayores compradores</h2>
    `;

    if (compradores.length === 0) {

        html += `
            <p>No hay compradores registrados.</p>
        `;

    } else {

        for (const comprador of compradores) {

            html += `
                <div class="card">
                    <h3>${comprador.mail}</h3>
                    <p><strong>Total compras:</strong> ${comprador.total_compras}</p>
                    <p><strong>Total entradas:</strong> ${comprador.total_entradas}</p>
                    <p><strong>Total gastado:</strong> USD ${comprador.total_gastado}</p>
                </div>
                <br>
            `;
        }
    }

    html += `
            <button id="btnVolverAdmin" class="secundario">
                Volver
            </button>

        </div>
    `;

    document.getElementById("app").innerHTML = html;

    document.getElementById("btnVolverAdmin")
        .addEventListener("click", mostrarAdministrador);
}