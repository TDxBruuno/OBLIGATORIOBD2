const mailInput = document.getElementById("mail");
const btnContinuar = document.getElementById("btnContinuar");

btnContinuar.addEventListener("click", async () => {

    const mail = mailInput.value.trim();

    if (mail === "") {
        alert("Ingrese un correo electrónico.");
        return;
    }

    try {

        const response = await fetch(`/api/usuarios?mail=${encodeURIComponent(mail)}`);

        if (response.ok) {

            const usuario = await response.json();

            console.log(usuario);

            alert(`Bienvenido ${usuario.mail}`);

        } else if (response.status === 404) {

            alert("Ese correo no está registrado.");

        } else {

            alert("Ocurrió un error.");

        }

    } catch (error) {

        console.error(error);
        alert("No fue posible conectar con el servidor.");

    }

});