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

const productos = [
  new Producto("Teclado mecánico", 45000, "Periféricos", 8),
  new Producto("Mouse inalámbrico", 22000, "Periféricos", 15),
  new Producto("Monitor 24''", 180000, "Monitores", 4)
];


const inputNombre = document.querySelector("#nombre");
const inputPrecio = document.querySelector("#precio");
const selectCategoria = document.querySelector("#categoria");
const inputStock = document.querySelector("#stock");
const btnAgregar = document.querySelector("#btn-agregar");
const mensaje = document.querySelector("#mensaje");
const buscador = document.querySelector("#buscador");
const contenedor = document.querySelector("#contenedor-items");

function renderizar(lista) {
  let html = "";

  for (const p of lista) {
    html += `
      <div class="producto">
        <div>
          <h3>${p.nombre}</h3>
          <p>$${p.precio} (con IVA: $${p.sumarIva().toFixed(2)})</p>
          <p>${p.categoria} - Stock: ${p.stock}</p>
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
    mensaje.textContent = "Completa nombre, precio y stock con valores válidos";
    mensaje.className = "error";
    return;
  }

  productos.push(new Producto(nombre, precio, selectCategoria.value, stock));

  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";

  mensaje.textContent = "Agregaste " + nombre;
  mensaje.className = "ok";
  mostrar();
}

function vender(producto) {
  if (producto.descontarStock(1)) {
    mensaje.textContent = "Vendiste 1 unidad de " + producto.nombre;
    mensaje.className = "ok";
  } else {
    mensaje.textContent = producto.nombre + " no tiene stock";
    mensaje.className = "error";
  }
  mostrar();
}

function eliminar(producto) {
  const posicion = productos.indexOf(producto);
  productos.splice(posicion, 1);

  mensaje.textContent = "Eliminaste " + producto.nombre;
  mensaje.className = "info";
  mostrar();
}


btnAgregar.addEventListener("click", agregar);
buscador.addEventListener("keyup", mostrar);


mostrar();

