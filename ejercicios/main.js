const sumar = (a, b) => a + b;
const restar = (a, b) => a - b;
const multiplicar = (a, b) => a * b;
const dividir = (a, b) => b !== 0 ? a / b : null;

function solicitarNumero(mensaje) {
    const entrada = prompt(mensaje);
    if (entrada === null || entrada.trim() === "") return null;
    const numero = Number(entrada);
    if (!Number.isFinite(numero)) {
        alert("Ingresá un número válido.");
        return null;
    }
    return numero;
}
function solicitarOperacion() {
    const operacion = prompt("Elegí una operación: +, -, * o /");
    if (operacion === null) return null;
    const opcion = operacion.trim();
    if (["+", "-", "*", "/"].includes(opcion)) return opcion;
    alert("Operación inválida.");
    return null;
}

function Calculadora(a, b, operacion) {
    switch (operacion) {
        case "+": return sumar(a, b);
        case "-": return restar(a, b);
        case "*": return multiplicar(a, b);
        case "/": return dividir(a, b);
        default: return null;
    }
}

const mostrarResultado = mensaje => {
    alert(mensaje);
    console.log(mensaje);
};

function iniciarCalculadora() {
    let continuar = true;

    while (continuar) {
        const a = solicitarNumero("Ingresá el primer número:");
        if (a === null) break;

        const b = solicitarNumero("Ingresá el segundo número:");
        if (b === null) break;

        const operacion = solicitarOperacion();

        if (operacion === null) {
            console.log("Operación cancelada o inválida.");
        } else if (operacion === "/" && b === 0) {
            mostrarResultado("Error: no se puede dividir por cero.");
        } else {
            const resultado = Calculadora(a, b, operacion);

            if (resultado !== null && Number.isFinite(resultado)) {
                mostrarResultado(`Resultado: ${a} ${operacion} ${b} = ${resultado}`);
            } else {
                mostrarResultado("No se pudo realizar la operación.");
            }
        }

        continuar = confirm("¿Querés realizar otra operación?");
    }
    console.log("Calculadora finalizada.");
}
iniciarCalculadora();
