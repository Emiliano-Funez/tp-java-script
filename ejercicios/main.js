const vinito = ["milanesa", "sorrentino", "osobuco", "fideos", "empanadas", "flan", "vigilante"]
console.log("Su inventario actual es:", vinito)

vinito.push("lasaña")
vinito.unshift("pizza")
const ultimafruta = vinito.pop()
console.log("Se ha eliminado el elemento:", ultimafruta)

let busca = prompt("Escribir el elemento que desea buscar")


if(vinito.includes(busca)){
    console.log("Su elemento si existe y esta en la posicion:", vinito.indexOf(busca))
}
else{
    console.log("Su elemento no existe.")
}

vinito.splice(1,1,"focaccia")
console.log("Tu menu actual es:", vinito)

for(const ev of vinito){
    console.log("Producto:", ev)
}