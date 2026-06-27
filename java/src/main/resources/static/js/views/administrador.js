/* =============================================
   NAVBAR
   ============================================= */
function renderNav(titulo = "") {
    return `
        <nav class="adm-nav">
            <div class="adm-nav-brand">
                <span class="adm-nav-badge">⚽ FIFA</span>
                Ticketing Mundial
            </div>
            <span class="adm-nav-role">${titulo}</span>
        </nav>
    `;
}

/* =============================================
   PANEL PRINCIPAL DE ADMINISTRACIÓN
   ============================================= */
function mostrarAdministrador() {

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card">
                    <p class="adm-page-label">Panel de control</p>
                    <h1 class="adm-page-title">Administración</h1>

                    <div class="adm-actions-grid">
                        <button class="adm-action-btn" id="btnCrearEstadio">
                            <span class="adm-action-icon">🏟️</span>
                            <span class="adm-action-label">Agregar estadio</span>
                            <span class="adm-action-desc">Registrar nueva sede</span>
                        </button>
                        <button class="adm-action-btn" id="btnCrearSector">
                            <span class="adm-action-icon">🗺️</span>
                            <span class="adm-action-label">Agregar sector</span>
                            <span class="adm-action-desc">Sector en estadio existente</span>
                        </button>
                        <button class="adm-action-btn" id="btnCrearEquipo">
                            <span class="adm-action-icon">🚩</span>
                            <span class="adm-action-label">Agregar equipo</span>
                            <span class="adm-action-desc">Registrar selección</span>
                        </button>
                        <button class="adm-action-btn" id="btnCrearEvento">
                            <span class="adm-action-icon">📅</span>
                            <span class="adm-action-label">Crear evento</span>
                            <span class="adm-action-desc">Nuevo partido</span>
                        </button>
                        <button class="adm-action-btn" id="btnHabilitarSector">
                            <span class="adm-action-icon">✅</span>
                            <span class="adm-action-label">Habilitar sector</span>
                            <span class="adm-action-desc">Para un evento puntual</span>
                        </button>
                        <button class="adm-action-btn" id="btnAsignarFuncionarioEventoSector">
                            <span class="adm-action-icon">👤</span>
                            <span class="adm-action-label">Asignar funcionario</span>
                            <span class="adm-action-desc">A evento-sector</span>
                        </button>
                    </div>

                    <button class="adm-action-btn adm-action-btn-full" id="btnEstadisticas">
                        <span class="adm-action-icon">📊</span>
                        <div>
                            <div class="adm-action-label">Estadísticas</div>
                            <div class="adm-action-desc">Ventas y compradores destacados</div>
                        </div>
                    </button>

                    <button class="adm-btn-volver" id="btnVolver">← Cerrar sesión</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnCrearEstadio").addEventListener("click", crearEstadio);
    document.getElementById("btnCrearSector").addEventListener("click", crearSector);
    document.getElementById("btnCrearEquipo").addEventListener("click", crearEquipo);
    document.getElementById("btnCrearEvento").addEventListener("click", crearEvento);
    document.getElementById("btnHabilitarSector").addEventListener("click", habilitarSectorEvento);
    document.getElementById("btnAsignarFuncionarioEventoSector").addEventListener("click", asignarFuncionarioEventoSector);
    document.getElementById("btnEstadisticas").addEventListener("click", cargarEstadisticas);
    document.getElementById("btnVolver").addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}

/* =============================================
   FORMULARIO: SECTOR
   ============================================= */
function mostrarFormularioSector(estadios) {

    const opcionesEstadios = estadios.map(e =>
        `<option value="${e.id_estadio}">${e.nombre}</option>`
    ).join("");

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card">
                    <p class="adm-page-label">Estadios</p>
                    <h1 class="adm-page-title">Agregar sector</h1>

                    <div class="adm-form">
                        <div class="adm-field">
                            <label class="adm-label">Estadio</label>
                            <select id="sectorEstadio" class="adm-select">${opcionesEstadios}</select>
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Nombre del sector</label>
                            <input id="sectorNombre" class="adm-input" type="text" placeholder="Ej. Tribuna Norte">
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Capacidad máxima</label>
                            <input id="sectorCapacidad" class="adm-input" type="number" placeholder="Ej. 5000">
                        </div>
                        <div class="adm-form-actions">
                            <button id="btnGuardarSector" class="adm-btn-primary">Guardar sector →</button>
                            <button id="btnVolverAdmin" class="adm-btn-volver">← Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnGuardarSector").addEventListener("click", guardarSector);
    document.getElementById("btnVolverAdmin").addEventListener("click", mostrarAdministrador);
}

/* =============================================
   FORMULARIO: EVENTO
   ============================================= */
function mostrarFormularioEvento(estadios, equipos) {

    const opcionesEstadios = estadios.map(e =>
        `<option value="${e.id_estadio}">${e.nombre}</option>`
    ).join("");

    const opcionesEquipos = equipos.map(e =>
        `<option value="${e.id_equipo}">${e.nombre}</option>`
    ).join("");

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card">
                    <p class="adm-page-label">Eventos</p>
                    <h1 class="adm-page-title">Crear partido</h1>

                    <div class="adm-form">
                        <div class="adm-form-grid2">
                            <div class="adm-field">
                                <label class="adm-label">Fecha</label>
                                <input id="eventoFecha" class="adm-input" type="date">
                            </div>
                            <div class="adm-field">
                                <label class="adm-label">Hora</label>
                                <input id="eventoHora" class="adm-input" type="time">
                            </div>
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Estadio</label>
                            <select id="eventoEstadio" class="adm-select">${opcionesEstadios}</select>
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Equipo local</label>
                            <select id="eventoLocal" class="adm-select">${opcionesEquipos}</select>
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Equipo visitante</label>
                            <select id="eventoVisitante" class="adm-select">${opcionesEquipos}</select>
                        </div>
                        <div class="adm-form-actions">
                            <button id="btnGuardarEvento" class="adm-btn-primary">Crear evento →</button>
                            <button id="btnVolverAdmin" class="adm-btn-volver">← Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnGuardarEvento").addEventListener("click", guardarEvento);
    document.getElementById("btnVolverAdmin").addEventListener("click", mostrarAdministrador);
}

/* =============================================
   FORMULARIO: EQUIPO
   ============================================= */
function mostrarFormularioEquipo() {

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card">
                    <p class="adm-page-label">Equipos</p>
                    <h1 class="adm-page-title">Agregar selección</h1>

                    <div class="adm-form">
                        <div class="adm-field">
                            <label class="adm-label">Nombre del equipo</label>
                            <input id="equipoNombre" class="adm-input" type="text" placeholder="Ej. Argentina">
                        </div>
                        <div class="adm-form-actions">
                            <button id="btnGuardarEquipo" class="adm-btn-primary">Guardar equipo →</button>
                            <button id="btnVolverAdmin" class="adm-btn-volver">← Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnGuardarEquipo").addEventListener("click", guardarEquipo);
    document.getElementById("btnVolverAdmin").addEventListener("click", mostrarAdministrador);
}

/* =============================================
   FORMULARIO: HABILITAR SECTOR PARA EVENTO
   ============================================= */
function mostrarFormularioHabilitarSector(eventos, sectores) {

    const opcionesEventos = eventos.map(e =>
        `<option value="${e.id_evento}">${e.fecha} ${e.hora} — ${e.equipo_local} vs ${e.equipo_visitante} · ${e.estadio}</option>`
    ).join("");

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card">
                    <p class="adm-page-label">Sectores</p>
                    <h1 class="adm-page-title">Habilitar sector</h1>

                    <div class="adm-form">
                        <div class="adm-field">
                            <label class="adm-label">Partido</label>
                            <select id="habilitarEvento" class="adm-select">${opcionesEventos}</select>
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Sector</label>
                            <select id="habilitarSector" class="adm-select"></select>
                        </div>
                        <div class="adm-form-grid2">
                            <div class="adm-field">
                                <label class="adm-label">Precio (USD)</label>
                                <input id="habilitarPrecio" class="adm-input" type="number" min="0" step="0.01" placeholder="0.00">
                            </div>
                            <div class="adm-field">
                                <label class="adm-label">Capacidad</label>
                                <input id="habilitarCapacidad" class="adm-input" type="number" min="1" placeholder="Ej. 1000">
                            </div>
                        </div>
                        <div class="adm-form-actions">
                            <button id="btnGuardarSectorEvento" class="adm-btn-primary">Habilitar sector →</button>
                            <button id="btnVolverAdmin" class="adm-btn-volver">← Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    function actualizarSectoresPorEvento() {
        const idSel = Number(document.getElementById("habilitarEvento").value);
        const eventoSel = eventos.find(e => Number(e.id_evento) === idSel);
        const filtrados = sectores.filter(s => s.estadio === eventoSel.estadio);
        document.getElementById("habilitarSector").innerHTML = filtrados.map(s =>
            `<option value="${s.id_sector}">${s.estadio} — Sector ${s.nombre} · Cap. ${s.cap_max}</option>`
        ).join("");
    }

    document.getElementById("habilitarEvento").addEventListener("change", actualizarSectoresPorEvento);
    actualizarSectoresPorEvento();
    document.getElementById("btnGuardarSectorEvento").addEventListener("click", guardarSectorEvento);
    document.getElementById("btnVolverAdmin").addEventListener("click", mostrarAdministrador);
}

/* =============================================
   FORMULARIO: ASIGNAR FUNCIONARIO
   ============================================= */
function mostrarFormularioAsignarFuncionario(funcionarios, eventoSectores) {

    const opcionesFuncionarios = funcionarios.map(f =>
        `<option value="${f.id_usuario}">${f.mail} — Legajo ${f.num_legajo}</option>`
    ).join("");

    const opcionesEventoSectores = eventoSectores.map(es =>
        `<option value="${es.id_evento_sector}">${es.fecha} ${es.hora} — ${es.equipo_local} vs ${es.equipo_visitante} · ${es.estadio} · Sector ${es.sector}</option>`
    ).join("");

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card">
                    <p class="adm-page-label">Personal</p>
                    <h1 class="adm-page-title">Asignar funcionario</h1>

                    <div class="adm-form">
                        <div class="adm-field">
                            <label class="adm-label">Funcionario</label>
                            <select id="asignarFuncionario" class="adm-select">${opcionesFuncionarios}</select>
                        </div>
                        <div class="adm-field">
                            <label class="adm-label">Partido y sector</label>
                            <select id="asignarEventoSector" class="adm-select">${opcionesEventoSectores}</select>
                        </div>
                        <div class="adm-form-actions">
                            <button id="btnGuardarAsignacionFuncionario" class="adm-btn-primary">Guardar asignación →</button>
                            <button id="btnVolverAdmin" class="adm-btn-volver">← Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnGuardarAsignacionFuncionario").addEventListener("click", guardarAsignacionFuncionarioEventoSector);
    document.getElementById("btnVolverAdmin").addEventListener("click", mostrarAdministrador);
}

/* =============================================
   ESTADÍSTICAS
   ============================================= */
function mostrarEstadisticas(eventos, compradores) {

    let htmlEventos = "";

    if (eventos.length === 0) {
        htmlEventos = `<div class="adm-empty">Sin ventas registradas aún.</div>`;
    } else {
        htmlEventos = eventos.map(ev => `
            <div class="adm-stat-card">
                <div class="adm-stat-card-title">${ev.equipo_local} vs ${ev.equipo_visitante}</div>
                <div class="adm-stat-row">
                    <span class="adm-stat-key">📅 Fecha</span>
                    <span class="adm-stat-val">${ev.fecha} · ${ev.hora}</span>
                </div>
                <div class="adm-stat-row">
                    <span class="adm-stat-key">🏟️ Estadio</span>
                    <span class="adm-stat-val">${ev.estadio}</span>
                </div>
                <div class="adm-stat-row">
                    <span class="adm-stat-key">🎟️ Entradas vendidas</span>
                    <span class="adm-stat-highlight">${ev.total_entradas_vendidas}</span>
                </div>
            </div>
        `).join("");
    }

    let htmlCompradores = "";

    if (compradores.length === 0) {
        htmlCompradores = `<div class="adm-empty">Sin compradores registrados aún.</div>`;
    } else {
        htmlCompradores = compradores.map(c => `
            <div class="adm-stat-card">
                <div class="adm-stat-card-title">${c.mail}</div>
                <div class="adm-stat-row">
                    <span class="adm-stat-key">🛒 Compras</span>
                    <span class="adm-stat-val">${c.total_compras}</span>
                </div>
                <div class="adm-stat-row">
                    <span class="adm-stat-key">🎟️ Entradas</span>
                    <span class="adm-stat-val">${c.total_entradas}</span>
                </div>
                <div class="adm-stat-row">
                    <span class="adm-stat-key">💰 Total gastado</span>
                    <span class="adm-stat-highlight">USD ${c.total_gastado}</span>
                </div>
            </div>
        `).join("");
    }

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            ${renderNav("Administrador")}
            <div class="adm-content">
                <div class="adm-card adm-card-wide">
                    <p class="adm-page-label">Resumen</p>
                    <h1 class="adm-page-title">Estadísticas</h1>

                    <div class="adm-stats-section">
                        <div class="adm-stats-section-title">🏆 Eventos con más entradas vendidas</div>
                        ${htmlEventos}
                    </div>

                    <hr class="adm-divider">

                    <div class="adm-stats-section">
                        <div class="adm-stats-section-title">👑 Ranking de mayores compradores</div>
                        ${htmlCompradores}
                    </div>

                    <button id="btnVolverAdmin" class="adm-btn-volver">← Volver al panel</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("btnVolverAdmin").addEventListener("click", mostrarAdministrador);
}