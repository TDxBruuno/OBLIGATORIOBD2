function mostrarLogin() {
    document.getElementById("app").innerHTML = `
        <div class="login-card">

            <div class="login-left">
                <svg class="login-ball" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" fill="white"/>
                    <path d="M50 2 L62 18 L80 12 L80 32 L98 38 L86 52 L94 70 L76 72 L70 90 L50 82 L30 90 L24 72 L6 70 L14 52 L2 38 L20 32 L20 12 L38 18 Z" fill="none" stroke="black" stroke-width="1.5"/>
                </svg>
                <div class="login-left-content">
                    <div class="login-badge">Mundial 2026</div>
                    <h2>Tu entrada al<br>mundo del fútbol</h2>
                    <p>Gestión oficial de tickets</p>
                </div>
            </div>

            <div class="login-right">
                <div class="login-logo">
                    <div class="login-logo-icon">⚽</div>
                    <span>Mundial Ticketing</span>
                </div>

                <h1>Iniciá sesión</h1>
                <p class="subtitulo">Ingresá tu correo para continuar</p>

                <label class="field-label">Correo electrónico</label>
                <input type="email" id="mail" placeholder="nombre@correo.com">

                <button class="btn-primary" id="btnContinuar">Continuar</button>

                <div class="divider">
                    <hr><span>¿No tenés cuenta?</span><hr>
                </div>

                <button class="secundario" id="btnRegistrarme">Registrarme</button>

            </div>

        </div>
    `;

    document.getElementById("btnContinuar").addEventListener("click", () => {
        const mail = document.getElementById("mail").value.trim();
        manejarLogin(mail);
    });
    document.getElementById("btnRegistrarme").addEventListener("click", mostrarRegistro);
}


