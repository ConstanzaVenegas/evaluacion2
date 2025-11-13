const API_URL = "http://localhost:8082/muebles";

// === CARGAR LISTA DE MUEBLES ===
document.addEventListener("DOMContentLoaded", () => {
    cargarMuebles();

    document.getElementById("guardarBtn").addEventListener("click", guardarMueble);
    document.getElementById("recargarBtn").addEventListener("click", cargarMuebles);
    document.getElementById("limpiarBtn").addEventListener("click", limpiarFormulario);
});

// === LISTAR ===
async function cargarMuebles() {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.querySelector("#tablaMuebles tbody");
    tbody.innerHTML = "";

    data.forEach(mueble => {
        const fila = `
            <tr>
                <td>${mueble.idMueble}</td>
                <td>${mueble.nombre}</td>
                <td>${mueble.tipo}</td>
                <td>${mueble.precioBase.toLocaleString("es-CL")}</td>
                <td>${mueble.stock}</td>
                <td>${mueble.estado}</td>
                <td>${mueble.tamano}</td>
                <td>${mueble.material}</td>
                <td>
                    <button class="editarBtn" onclick="editarMueble(${mueble.idMueble})">✏️ Editar</button>
                    <button class="desactivarBtn" onclick="desactivarMueble(${mueble.idMueble})">🚫 Desactivar</button>
                </td>
            </tr>`;
        tbody.innerHTML += fila;
    });
}

// === GUARDAR / ACTUALIZAR ===
async function guardarMueble() {
    const id = document.getElementById("idMueble").value;
    const mueble = {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        precioBase: parseFloat(document.getElementById("precioBase").value),
        stock: parseInt(document.getElementById("stock").value),
        estado: document.getElementById("estado").value,
        tamano: document.getElementById("tamano").value,
        material: document.getElementById("material").value
    };

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mueble)
    });

    if (res.ok) {
        mostrarToast(id ? "Mueble actualizado correctamente ✅" : "Mueble guardado exitosamente 💾");
        limpiarFormulario();
        cargarMuebles();
    } else {
        mostrarToast("❌ Error al guardar el mueble", true);
    }
}

// === EDITAR ===
async function editarMueble(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const mueble = await res.json();

    document.getElementById("idMueble").value = mueble.idMueble;
    document.getElementById("nombre").value = mueble.nombre;
    document.getElementById("tipo").value = mueble.tipo;
    document.getElementById("precioBase").value = mueble.precioBase;
    document.getElementById("stock").value = mueble.stock;
    document.getElementById("estado").value = mueble.estado;
    document.getElementById("tamano").value = mueble.tamano;
    document.getElementById("material").value = mueble.material;

    mostrarToast("✏️ Editando mueble...");
}

// === DESACTIVAR ===
async function desactivarMueble(id) {
    const res = await fetch(`${API_URL}/desactivar/${id}`, { method: "PUT" });

    if (res.ok) {
        mostrarToast("🚫 Mueble desactivado correctamente");
        cargarMuebles();
    } else {
        mostrarToast("❌ No se pudo desactivar", true);
    }
}

// === LIMPIAR ===
function limpiarFormulario() {
    document.querySelectorAll("input, select").forEach(input => input.value = "");
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


