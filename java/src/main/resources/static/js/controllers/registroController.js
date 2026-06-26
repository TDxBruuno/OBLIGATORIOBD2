async function manejarRegistro(datos) {

    console.log("Entró al registro");

    for (const valor of Object.values(datos)) {
        if (valor === "") {
            alert("Debe completar todos los campos.");
            return;
        }
    }

    const request = {
        base: {
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
        },
        fechaRegistro: new Date().toISOString().substring(0, 10),
        estado: "ACTIVO"
    };

    try {

        await registrarUsuarioGeneral(request);

        alert("Usuario registrado correctamente.");

        mostrarLogin();

    } catch (error) {

        alert(error.message);

    }
}