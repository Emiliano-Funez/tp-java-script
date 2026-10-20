class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.stock = stock;
    }

        sumarIva() {
    this.precio *= 1.21;
    }

        vender(cantidad = 1){
            if (cantidad <= 0 || cantidad > this.stock){
                return false
            }
            this.stock -= cantidad;
                return true
        }
}

const productos = [];

productos.push(new Producto(0, "arroz", 125, 10));
productos.push(new Producto(1, "burger", 75, 10));
productos.push(new Producto(2, "fideo", 35, 10));

for (const producto of productos){
    producto.sumarIva();
}

let Listado = "";
for (const producto of productos){
    Listado += producto.id +" "+ producto.nombre + "\n"
}

productos[0].vender(2);

for (const producto of productos) {
    console.log(producto);
}


