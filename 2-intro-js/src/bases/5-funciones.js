const saludar = function (nombre){
    return `Hola, soy ${nombre}`;
}

const salu2 = (nombre) =>{
    return `Hola, soy ${nombre}`;
}

const saludo3 = (nombre) => `Hola, soy ${nombre}`;

const saludo4 = () => ("Hola mundo");



console.log(saludar("Camilo"));
console.log(salu2("Camilo 2"));
console.log(saludo3("Camilo 3"));
console.log(saludo4());

const getUser = () => ({ // sin el return se tiene que poner los ().
    uId: "ABC123",
    userName: "Pepito",
});

console.log(getUser());


const getActiveUser = (nombre) => ({
    userId: "ABC123",
    userName: nombre,    
});

const activeUser = getActiveUser('Camilo');
console.log(activeUser);