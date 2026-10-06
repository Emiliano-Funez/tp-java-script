const sumar = (a,b) => a + b
const restar = (a,b) => a - b
const multiplicar = (a,b) => a * b
const dividir = (a,b) => a / b

function Calculadora(primernum, segundonum, operacion){
    switch(operacion){
        case "+": return(sumar(primernum, segundonum))
        case "-": return(restar(primernum, segundonum))
        case "*": return(multiplicar(primernum, segundonum))
        case "/": return(dividir(primernum, segundonum))
        default: 
        alert("Ingreso invalido")
        }
    }

    while(confirm("Desea usar la calculadora?")){
    let operacion = prompt(`¿Qué operación desea realizar?
            +: sumar
            -: restar
            *: multiplicar
            /: dividir`)
        let primernum = Number(prompt("Ingrese su primero numero"))
        let segundonum = Number(prompt("Ingrese su segundo numero"))
        Calculadora(primernum, segundonum, operacion)
    }
  

