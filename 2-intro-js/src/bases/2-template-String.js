const nombre = "Camilo";
const apellido = "Ramirez";

const fullName = `${nombre} ${apellido}`;

console.log(fullName);

function getSaludo(nombre){
    return `Hola ${nombre}`;
}

console.log(`Esto es un saludo: ${getSaludo(fullName)}`);