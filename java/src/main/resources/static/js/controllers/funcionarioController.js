async function cargarDispositivosFuncionario() {

    try {

        const usuario = obtenerUsuarioActual();

        const controles = await obtenerControlesDeFuncionario(usuario.id_usuario);

        const select = document.getElementById("controlFuncionario");

        if (controles.length === 0) {

            select.innerHTML = `
                <option value="">
                    No hay dispositivos vinculados
                </option>
            `;

            return;

        }

        let opciones = "";

        for (const control of controles) {

            opciones += `
                <option value="${control.id_control}">
                    #${control.id_control} - ${control.descripcion}
                </option>
            `;

        }

        select.innerHTML = opciones;

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}

async function registrarNuevoDispositivo() {

    try {

        const descripcion = document.getElementById("descripcionDispositivo").value.trim();

        if (descripcion === "") {

            alert("Debe ingresar una descripción.");

            return;

        }

        const usuario = obtenerUsuarioActual();

        const dispositivo = await registrarDispositivo({
            descripcion: descripcion
        });

        await vincularDispositivo({
            idFuncionario: usuario.id_usuario,
            idDispositivo: dispositivo.id
        });

        alert("Dispositivo registrado correctamente.");

        document.getElementById("descripcionDispositivo").value = "";

        cargarDispositivosFuncionario();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function confirmarValidacionEntrada() {

    try {

        const idEntrada = Number(document.getElementById("idEntradaValidar").value);
        const idControl = Number(document.getElementById("controlFuncionario").value);
        const codigoToken = document.getElementById("tokenValidar").value.trim();

        if (!idEntrada || !idControl || codigoToken === "") {

            alert("Debe completar todos los campos.");

            return;

        }

        await validarEntrada({
            idEntrada: idEntrada,
            idControl: idControl,
            codigoToken: codigoToken,
            momento: new Date().toISOString()
        });

        alert("Entrada validada correctamente.");

        mostrarFuncionario();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}