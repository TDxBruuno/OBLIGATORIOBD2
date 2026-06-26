async function manejarRegistro(datos) {

    for (const valor of Object.values(datos)) {
        if (valor === "") {
            alert("Debe completar todos los campos.");
            return;
        }
    }

    const base = {
        mail: datos.mail,
        docPais: datos.docPais,
        docTipo: datos.docTipo,
        docNumero: datos.docNumero,
        dirPais: datos.dirPais,
        dirLocalidad: datos.dirLocalidad,
        dirCalle: datos.dirCalle,
        dirNumero: datos.dirNumero,
        dirCodigoPostal: datos.dirCodigoPostal,
        telefonos: [datos.telefono]
    };

    try {

        if (datos.tipoUsuario === "GENERAL") {

            await registrarUsuarioGeneral({
                base: base,
                fechaRegistro: new Date().toISOString().substring(0, 10),
                estado: "ACTIVO"
            });

        } else if (datos.tipoUsuario === "FUNCIONARIO") {

            await registrarFuncionario({
                base: base,
                legajo: datos.legajo
            });

        } else if (datos.tipoUsuario === "ADMIN") {

            await registrarAdministrador({
                base: base,
                fechaAsignacion: datos.fechaAsignacion
            });

        }

        alert("Usuario registrado correctamente.");

        mostrarLogin();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}