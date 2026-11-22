class Producto {
  constructor(nombre, precio, categoria, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }

  sumarIva() {
    return this.precio * 1.21;
  }

  descontarStock(cantidad) {
    if (cantidad <= this.stock) {
      this.stock -= cantidad;
      return true;
    }
    return false;
  }
}

const productos = [];

function guardar() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

const inputNombre = document.querySelector("#nombre");
const inputPrecio = document.querySelector("#precio");
const selectCategoria = document.querySelector("#categoria");
const inputStock = document.querySelector("#stock");
const btnAgregar = document.querySelector("#btn-agregar");
const buscador = document.querySelector("#buscador");
const cargando = document.querySelector("#cargando");
const contenedor = document.querySelector("#contenedor-items");

//(librería Toastify) 
const VERDE = "#2E7D4F";
const ROJO = "#B83A30";
const AZUL = "#17506B";

function notificar(texto, color) {
  Toastify({
    text: texto,
    duration: 3500,
    gravity: "top",
    position: "right",
    style: { background: color }
  }).showToast();
}

function esperar(milisegundos) {
  return new Promise((resolve) => setTimeout(resolve, milisegundos));
}

async function cargarProductos() {
  btnAgregar.disabled = true; 
  cargando.textContent = "⏳ Cargando productos...";

  try {
    const respuesta = await fetch("./data.json");

    if (!respuesta.ok) {
      throw new Error("Error " + respuesta.status);
    }

    const datosServidor = await respuesta.json();
    await esperar(1000); 

    const datos = JSON.parse(localStorage.getItem("productos")) ?? datosServidor;

    for (const dato of datos) {
      const { nombre, precio, categoria, stock } = dato;
      productos.push(new Producto(nombre, precio, categoria, stock));
    }

    notificar("✅ Productos cargados con éxito", VERDE);
  } catch (error) {
    notificar("❌ No se pudieron cargar los productos. Intenta de nuevo más tarde", ROJO);
  } finally {

    cargando.textContent = "";
    btnAgregar.disabled = false;
    mostrar();
  }
}

function mostrarAviso() {
  if (productos.length === 0) {
    return;
  }

  let stockBajo = 0;
  for (const p of productos) {
    if (p.stock <= 3) {
      stockBajo++;
    }
  }

  notificar(
    stockBajo > 0
      ? "🔔 Recordatorio: tienes " + stockBajo + " producto(s) con stock bajo"
      : "🔔 Recordatorio: todos tus productos tienen buen stock",
    AZUL
  );
}

function renderizar(lista) {
  let html = "";

  for (const p of lista) {
    const { nombre, precio, categoria, stock } = p;

    html += `
      <div class="producto">
        <div>
          <h3>${nombre}</h3>
          <p>$${precio} (con IVA: $${p.sumarIva().toFixed(2)})</p>
          <p>${categoria} - ${stock === 0 ? "Agotado" : "Stock: " + stock}</p>
        </div>
        <div class="acciones">
          <button class="btn-vender">Vender 1</button>
          <button class="btn-eliminar">Eliminar</button>
        </div>
      </div>
    `;
  }

  contenedor.innerHTML = html;

  const botonesVender = document.querySelectorAll(".btn-vender");
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

  for (let i = 0; i < lista.length; i++) {
    botonesVender[i].addEventListener("click", function () {
      vender(lista[i]);
    });
    botonesEliminar[i].addEventListener("click", function () {
      eliminar(lista[i]);
    });
  }
}

function mostrar() {
  const texto = buscador.value.toLowerCase();
  const resultados = [];

  for (const p of productos) {
    if (p.nombre.toLowerCase().includes(texto)) {
      resultados.push(p);
    }
  }

  renderizar(resultados);
}

function agregar() {
  const nombre = inputNombre.value;
  const precio = Number(inputPrecio.value);
  const stock = Number(inputStock.value);

  if (nombre === "" || precio <= 0 || stock <= 0) {
    notificar("Completa nombre, precio y stock con valores válidos", ROJO);
    return;
  }

  productos.push(new Producto(nombre, precio, selectCategoria.value, stock));
  guardar();

  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";

  notificar("Agregaste " + nombre, VERDE);
  mostrar();
}

function vender(producto) {
  const { nombre } = producto;
  const vendido = producto.descontarStock(1);

  notificar(
    vendido ? "Vendiste 1 unidad de " + nombre : nombre + " no tiene stock",
    vendido ? VERDE : ROJO
  );

  guardar();
  mostrar();
}

function eliminar(producto) {
  const posicion = productos.indexOf(producto);
  productos.splice(posicion, 1);
  guardar();

  notificar("Eliminaste " + producto.nombre, AZUL);
  mostrar();
}


btnAgregar.addEventListener("click", agregar);
buscador.addEventListener("keyup", mostrar);


cargarProductos();               
setTimeout(mostrarAviso, 4000);  