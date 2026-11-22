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


const productosIniciales = [
  { nombre: "Teclado mecánico", precio: 45000, categoria: "Periféricos", stock: 8 },
  { nombre: "Mouse inalámbrico", precio: 22000, categoria: "Periféricos", stock: 15 },
  { nombre: "Monitor 24''", precio: 180000, categoria: "Monitores", stock: 4 }
];


const datosGuardados = JSON.parse(localStorage.getItem("productos")) ?? productosIniciales;


const productos = [];
for (const datos of datosGuardados) {
  const { nombre, precio, categoria, stock } = datos;
  productos.push(new Producto(nombre, precio, categoria, stock));
}

function guardar() {
  localStorage.setItem("productos", JSON.stringify(productos));
}


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
    mensaje.textContent = "Completa nombre, precio y stock con valores válidos";
    mensaje.className = "error";
    return;
  }

  productos.push(new Producto(nombre, precio, selectCategoria.value, stock));
  guardar();

  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";

  mensaje.textContent = "Agregaste " + nombre;
  mensaje.className = "ok";
  mostrar();
}

function vender(producto) {
  const { nombre } = producto;
  const vendido = producto.descontarStock(1);

  mensaje.textContent = vendido ? "Vendiste 1 unidad de " + nombre : nombre + " no tiene stock";
  mensaje.className = vendido ? "ok" : "error";

  guardar();
  mostrar();
}

function eliminar(producto) {
  const posicion = productos.indexOf(producto);
  productos.splice(posicion, 1);
  guardar();

  mensaje.textContent = "Eliminaste " + producto.nombre;
  mensaje.className = "info";
  mostrar();
}

btnAgregar.addEventListener("click", agregar);
buscador.addEventListener("keyup", mostrar);

mostrar();