const persona ={
    nombre: "Pepe",
    apellido: "Perez",
    edad: 45,
    direccion: {
        ciudad: "New-York",
        zip: 1000,
        lat: 10221,
        lng: 2341,
    }
};

// asignación erronea const persona2 = persona;

const persona2 = {...persona};

persona2.nombre = "Pepito";

console.table({persona});
console.log(persona2);