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