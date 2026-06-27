function mostrarFuncionario() {

    document.getElementById("app").innerHTML = `
        <div class="adm-wrapper">
            <nav class="adm-nav">
                <div class="adm-nav-brand">
                    <span class="adm-nav-badge">⚽ FIFA</span>
                    Ticketing Mundial
                </div>
                <span class="adm-nav-role">Funcionario</span>
            </nav>

            <div class="adm-content">
                <div class="adm-card">

                    <p class="adm-page-label">Control de acceso</p>
                    <h1 class="adm-page-title">Validar entrada</h1>

                    <div class="adm-form">
                        <div class="adm-form-grid2">
                            <div class="adm-field">
                                <label class="adm-label">ID de entrada</label>
                                <input
                                    id="idEntradaValidar"
                                    class="adm-input"
                                    type="number"
                                    placeholder="Ej. 10042">
                            </div>
                            <div class="adm-field">
                                <label class="adm-label">Token</label>
                                <input
                                    id="tokenValidar"
                                    class="adm-input"
                                    type="text"
                                    placeholder="Token de la entrada">
                            </div>
                        </div>

                        <div class="adm-field">
                            <label class="adm-label">Dispositivo de control</label>
                            <select id="controlFuncionario" class="adm-select">
                                <option>Cargando dispositivos...</option>
                            </select>
                        </div>

                        <div class="adm-form-actions">
                            <button id="btnValidarEntrada" class="adm-btn-primary">
                                Validar entrada →
                            </button>
                        </div>
                    </div>

                    <hr class="adm-divider">

                    <p class="adm-page-label">Dispositivos</p>
                    <h2 class="adm-page-title" style="font-size:18px; margin-bottom:20px;">Registrar dispositivo</h2>

                    <div class="adm-form">
                        <div class="adm-field">
                            <label class="adm-label">Descripción</label>
                            <input
                                id="descripcionDispositivo"
                                class="adm-input"
                                type="text"
                                placeholder="Ej. Scanner puerta norte">
                        </div>
                        <div class="adm-form-actions">
                            <button id="btnRegistrarDispositivo" class="adm-btn-primary">
                                Registrar dispositivo →
                            </button>
                            <button id="btnVolverInicio" class="adm-btn-volver">
                                ← Volver
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    cargarDispositivosFuncionario();

    document.getElementById("btnValidarEntrada")
        .addEventListener("click", confirmarValidacionEntrada);

    document.getElementById("btnRegistrarDispositivo")
        .addEventListener("click", registrarNuevoDispositivo);

    document.getElementById("btnVolverInicio")
        .addEventListener("click", () => mostrarInicio(obtenerUsuarioActual()));
}