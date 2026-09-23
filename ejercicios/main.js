
const clave = "redragon"
let intentos = 0 
let log = false



while(intentos < 3 && !log){

const contraseña = prompt("Escriba su contraseña"); 


   if (contraseña === clave) {
        console.log("Su contraseña es correcta acceso consedido")
        log = true
    }else{
        intentos++
        console.log(`Su contraseña es incorrecta intentos disponibles: ${3 - intentos}`)
        
    }
}

if(!log){
    console.log("Su cuenta ha sido bloqueada, llego a 3/3 intentos")
}