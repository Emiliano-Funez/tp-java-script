const productos = [
  { nombre: "Laptop",  precio: 800, stock: 5, categoria: "tecnologia" },
  { nombre: "Teclado", precio: 50,  stock: 0, categoria: "tecnologia" },
  { nombre: "Monitor", precio: 300, stock: 3, categoria: "tecnologia"},
  { nombre: "Silla Gamer", precio: 200, stock: 4, categoria: "muebles" },
  { nombre: "Escritorio", precio: 150, stock: 2, categoria: "muebles" }
];
 
//Filter 
const categorias = [...new Set(productos.map(p => p.categoria))];

const chose = prompt("Categorías disponibles: " + categorias + "\n¿Qué categoría quiere ver:").toLowerCase();
const tipo = productos.filter(p => p.categoria === chose);
console.log("Productos Tecnologicos ", tipo);

//Map 
const Iva = productos.map(p => p.precio * 0.21);
console.log("El Iva de cada producto es: ", Iva)

//forEach 
productos.forEach(p => { 
  console.log("nombre: " + p.nombre + "precio: " + p.precio);
});


