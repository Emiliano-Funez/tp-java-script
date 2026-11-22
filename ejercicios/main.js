class Producto {
  constructor(id, nombre, precio, categoria, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }

  sumarIva() {
    return this.precio * 1.21;
  }
 
  descontarStock(cantidad) {
    if (cantidad > this.stock) {
      return false;
    }
    this.stock -= cantidad;
    return true;
  }
}

const productos = [
  new Producto(1, "Teclado mecánico", 45000, "Periféricos", 8),
  new Producto(2, "Mouse inalámbrico", 22000, "Periféricos", 15),
  new Producto(3, "Monitor 24''", 180000, "Monitores", 4)
];

let proximoId = 4;           
let idResaltado = null;       
let temporizadorMensaje;      

const formulario = document.querySelector("#formulario");
const inputNombre = document.querySelector("#nombre");
const inputPrecio = document.querySelector("#precio");
const selectCategoria = document.querySelector("#categoria");
const inputStock = document.querySelector("#stock");
const btnAgregar = document.querySelector("#btn-agregar");
const mensaje = document.querySelector("#mensaje");
const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtro-categoria");
const contenedor = document.querySelector("#contenedor-items");
const resumenProductos = document.querySelector("#resumen-productos");
const resumenUnidades = document.querySelector("#resumen-unidades");
const resumenValor = document.querySelector("#resumen-valor");

// ===== FUNCIONES AUXILIARES =====
function formatearPrecio(numero) {
  return "$" + Math.round(numero).toLocaleString("es-AR");
}

// Feedback visual: muestra un mensaje en pantalla (tipo: "ok", "error" o "info")
function mostrarMensaje(texto, tipo) {
  clearTimeout(temporizadorMensaje);
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
  temporizadorMensaje = setTimeout(() => {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }, 3500);
}

function actualizarResumen() {
  let unidades = 0;
  let valor = 0;
  for (const producto of productos) {
    unidades += producto.stock;
    valor += producto.sumarIva() * producto.stock;
  }
  resumenProductos.textContent = productos.length;
  resumenUnidades.textContent = unidades;
  resumenValor.textContent = formatearPrecio(valor);
}

// ===== RENDERIZADO DINÁMICO =====
function renderizarProductos(lista) {
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="vacio">No hay productos para mostrar.</p>`;
    actualizarResumen();
    return;
  }

  let html = "";

  for (const producto of lista) {
    const agotado = producto.stock === 0;
    const stockBajo = producto.stock > 0 && producto.stock <= 3;

    let textoStock = "Stock: " + producto.stock;
    let claseStock = "";
    if (agotado) {
      textoStock = "Agotado";
      claseStock = "agotado";
    } else if (stockBajo) {
      textoStock = "Quedan " + producto.stock;
      claseStock = "alerta";
    }

    html += `
      <article class="producto ${agotado ? "sin-stock" : ""} ${producto.id === idResaltado ? "resaltado" : ""}">
        <div class="info">
          <h3>${producto.nombre}</h3>
          <p class="precio">${formatearPrecio(producto.precio)} <small>(${formatearPrecio(producto.sumarIva())} con IVA)</small></p>
          <span class="etiqueta">${producto.categoria}</span>
          <span class="etiqueta ${claseStock}">${textoStock}</span>
        </div>
        <div class="acciones">
          <button type="button" class="btn btn-vender" data-id="${producto.id}" ${agotado ? "disabled" : ""}>Vender 1</button>
          <button type="button" class="btn btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>
      </article>
    `;
  }

  contenedor.innerHTML = html;
  idResaltado = null;
  asignarEventosItems();
  actualizarResumen();
}

function asignarEventosItems() {
  const botonesVender = contenedor.querySelectorAll(".btn-vender");
  const botonesEliminar = contenedor.querySelectorAll(".btn-eliminar");

  botonesVender.forEach((boton) => {
    boton.addEventListener("click", () => venderProducto(Number(boton.dataset.id)));
  });

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => eliminarProducto(Number(boton.dataset.id), boton));
  });
}

function aplicarFiltros() {
  const texto = buscador.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;

  const filtrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  renderizarProductos(filtrados);
}

function agregarProducto() {
  const nombre = inputNombre.value.trim();
  const precio = Number(inputPrecio.value);
  const stock = Number(inputStock.value);
  const categoria = selectCategoria.value;

  if (nombre === "") {
    mostrarMensaje("Escribe el nombre del producto.", "error");
    inputNombre.focus();
    return;
  }
  if (!(precio > 0)) {
    mostrarMensaje("El precio debe ser un número mayor a 0.", "error");
    inputPrecio.focus();
    return;
  }
  if (inputStock.value === "" || stock < 0 || !Number.isInteger(stock)) {
    mostrarMensaje("El stock debe ser un número entero, desde 0.", "error");
    inputStock.focus();
    return;
  }

  const nuevo = new Producto(proximoId, nombre, precio, categoria, stock);
  proximoId++;
  productos.push(nuevo);
  idResaltado = nuevo.id;

  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";
  buscador.value = "";
  filtroCategoria.value = "todas";

  aplicarFiltros();
  mostrarMensaje(`Agregaste "${nombre}" a la lista.`, "ok");
  inputNombre.focus();
}

function venderProducto(id) {
  const producto = productos.find((p) => p.id === id);

  if (producto.descontarStock(1)) {
    idResaltado = id;
    aplicarFiltros();
    mostrarMensaje(`Vendiste 1 unidad de ${producto.nombre}. Quedan ${producto.stock}.`, "ok");
  } else {
    mostrarMensaje(`${producto.nombre} no tiene stock.`, "error");
  }
}

function eliminarProducto(id, boton) {
  const producto = productos.find((p) => p.id === id);
  const tarjeta = boton.closest(".producto");

  boton.disabled = true;
  tarjeta.classList.add("saliendo"); 

  setTimeout(() => {
    const indice = productos.findIndex((p) => p.id === id);
    if (indice === -1) {
      return;
    }
    productos.splice(indice, 1);
    aplicarFiltros();
    mostrarMensaje(`Eliminaste "${producto.nombre}" de la lista.`, "info");
  }, 250);
}

btnAgregar.addEventListener("click", agregarProducto);

formulario.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" && evento.target.tagName === "INPUT") {
    agregarProducto();
  }
});
buscador.addEventListener("keyup", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);

aplicarFiltros();

