const API_URL = "http://localhost:8082/variaciones";

// === CARGAR AL INICIO ===
document.addEventListener("DOMContentLoaded", () => {
    cargarVariaciones();
    document.getElementById("guardarBtn").addEventListener("click", guardarVariacion);
    document.getElementById("recargarBtn").addEventListener("click", cargarVariaciones);
});

// === LISTAR ===
async function cargarVariaciones() {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.querySelector("#tablaVariaciones tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:gray;">Sin registros aún</td></tr>`;
        return;
    }

    data.forEach(v => {
        const fila = `
            <tr>
                <td>${v.idVariacion}</td>
                <td>${v.nombre}</td>
                <td>${v.incrementoPrecio.toLocaleString("es-CL")}</td>
                <td>${v.descripcion}</td>
                <td>
                    <button class="editarBtn" onclick="editarVariacion(${v.idVariacion})">✏️ Editar</button>
                    <button class="eliminarBtn" onclick="eliminarVariacion(${v.idVariacion})">🗑️ Eliminar</button>
                </td>
            </tr>`;
        tbody.innerHTML += fila;
    });

    mostrarToast("🔄 Lista de variaciones actualizada");
}

// === GUARDAR / ACTUALIZAR ===
async function guardarVariacion() {
    const id = document.getElementById("idVariacion")?.value || null;
    const variacion = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        incrementoPrecio: parseFloat(document.getElementById("incrementoPrecio").value)
    };

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variacion)
    });

    if (res.ok) {
        mostrarToast(id ? "✅ Variación actualizada correctamente" : "💾 Variación registrada con éxito");
        limpiarFormulario();
        cargarVariaciones();
    } else {
        mostrarToast("❌ Error al guardar la variación", true);
    }
}

// === EDITAR ===
async function editarVariacion(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const variacion = await res.json();

    document.getElementById("idVariacion").value = variacion.idVariacion;
    document.getElementById("nombre").value = variacion.nombre;
    document.getElementById("descripcion").value = variacion.descripcion;
    document.getElementById("incrementoPrecio").value = variacion.incrementoPrecio;

    mostrarToast("✏️ Editando variación...");
}

// === ELIMINAR ===
async function eliminarVariacion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta variación?")) return;

    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (res.ok) {
        mostrarToast("🗑️ Variación eliminada correctamente");
        cargarVariaciones();
    } else {
        mostrarToast("❌ No se pudo eliminar la variación", true);
    }
}

// === LIMPIAR ===
function limpiarFormulario() {
    document.querySelectorAll("input, textarea").forEach(input => (input.value = ""));
    mostrarToast("Formulario limpiado 🧹");
}

// === TOAST ===
function mostrarToast(mensaje, error = false) {
    const toast = document.createElement("div");
    toast.textContent = mensaje;
    toast.className = `toast ${error ? "error" : "success"}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

