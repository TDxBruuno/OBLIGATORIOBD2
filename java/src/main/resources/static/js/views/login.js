function mostrarLogin() {
    document.getElementById("app").innerHTML = `
        <div class="login-container">

            <h1>Mundial Ticketing</h1>

            <p class="subtitulo">
                Sistema de gestión de entradas
            </p>

            <input
                type="email"
                id="mail"
                placeholder="Correo electrónico">

            <button id="btnContinuar">
                Continuar
            </button>

            <p class="registro">
                ¿No estás registrado?
            </p>

            <button class="secundario">
                Registrarme
            </button>

        </div>
    `;

    document.getElementById("btnContinuar").addEventListener("click", () => {
        const mail = document.getElementById("mail").value.trim();
        manejarLogin(mail);
    });
}

