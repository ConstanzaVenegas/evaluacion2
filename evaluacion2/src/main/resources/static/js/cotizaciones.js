const API_MUEBLES = "http://localhost:8082/muebles";
const API_VARIACIONES = "http://localhost:8082/variaciones";
const API_COTIZACIONES = "http://localhost:8082/cotizaciones";

let detalles = [];
let total = 0;

// === INICIALIZAR ===
document.addEventListener("DOMContentLoaded", () => {
  cargarMuebles();
  cargarVariaciones();

  document.getElementById("agregarBtn").addEventListener("click", agregarItem);
  document.getElementById("crearCotizacionBtn").addEventListener("click", crearCotizacion);
});

// === CARGAR MUEBLES ===
async function cargarMuebles() {
  const res = await fetch(API_MUEBLES);
  const muebles = await res.json();
  const select = document.getElementById("muebleSelect");
  select.innerHTML = "<option value=''>Seleccione un mueble</option>";

  muebles.forEach(m => {
    if (m.estado === "activo") {
      const option = document.createElement("option");
      option.value = m.idMueble;
      option.textContent = `${m.nombre} — ${m.precioBase.toLocaleString("es-CL")} CLP (stock ${m.stock})`;
      select.appendChild(option);
    }
  });
}

// === CARGAR VARIACIONES ===
async function cargarVariaciones() {
  const res = await fetch(API_VARIACIONES);
  const variaciones = await res.json();
  const select = document.getElementById("variacionSelect");

  select.innerHTML = "<option value=''>Normal (sin variación)</option>";
  variaciones.forEach(v => {
    const option = document.createElement("option");
    option.value = v.idVariacion;
    option.textContent = `${v.nombre} (+${v.incrementoPrecio.toLocaleString("es-CL")} CLP)`;
    select.appendChild(option);
  });
}

// === AGREGAR ITEM A LA COTIZACIÓN ===
async function agregarItem() {
  const muebleId = document.getElementById("muebleSelect").value;
  const variacionId = document.getElementById("variacionSelect").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  if (!muebleId || cantidad <= 0) {
    mostrarToast("⚠️ Selecciona un mueble y cantidad válida", true);
    return;
  }

  const muebleRes = await fetch(`${API_MUEBLES}/${muebleId}`);
  const mueble = await muebleRes.json();

  // Verificar stock
  if (cantidad > mueble.stock) {
    mostrarToast(`❌ Stock insuficiente (${mueble.stock} disponibles)`, true);
    return;
  }

  let precioUnitario = mueble.precioBase;
  let variacion = { idVariacion: null, nombre: "Normal", incrementoPrecio: 0 };

  if (variacionId) {
    const varRes = await fetch(`${API_VARIACIONES}/${variacionId}`);
    variacion = await varRes.json();
    precioUnitario += variacion.incrementoPrecio;
  }

  const subtotal = precioUnitario * cantidad;

  detalles.push({
    mueble,
    variacion,
    cantidad,
    precioUnitario,
    subtotal
  });

  total += subtotal;
  actualizarTabla();
}

// === ACTUALIZAR TABLA DE DETALLES ===
function actualizarTabla() {
  const tbody = document.querySelector("#tablaDetalles tbody");
  tbody.innerHTML = "";

  detalles.forEach((d, index) => {
    const fila = `
      <tr>
        <td>${d.mueble.nombre}</td>
        <td>${d.variacion.nombre}</td>
        <td>${d.cantidad}</td>
        <td>${d.precioUnitario.toLocaleString("es-CL")}</td>
        <td>${d.subtotal.toLocaleString("es-CL")}</td>
        <td><button onclick="eliminarItem(${index})">🗑️</button></td>
      </tr>
    `;
    tbody.innerHTML += fila;
  });

  document.getElementById("totalDisplay").textContent = `Total: ${total.toLocaleString("es-CL")} CLP`;
}

// === ELIMINAR ITEM ===
function eliminarItem(index) {
  total -= detalles[index].subtotal;
  detalles.splice(index, 1);
  actualizarTabla();
  mostrarToast("🗑️ Ítem eliminado");
}

// === CREAR COTIZACIÓN ===
async function crearCotizacion() {
  const cliente = document.getElementById("cliente").value.trim();

  if (!cliente || detalles.length === 0) {
    mostrarToast("⚠️ Agrega al menos un producto y cliente", true);
    return;
  }

  const cotizacion = {
    cliente,
    detalles: detalles.map(d => ({
      mueble: { idMueble: d.mueble.idMueble },
      variacion: d.variacion.idVariacion ? { idVariacion: d.variacion.idVariacion } : null,
      cantidad: d.cantidad
    }))
  };

  const res = await fetch(API_COTIZACIONES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cotizacion)
  });

  if (res.ok) {
    mostrarToast("✅ Cotización creada correctamente");
    detalles = [];
    total = 0;
    actualizarTabla();
  } else {
    mostrarToast("❌ Error al crear la cotización", true);
  }
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

