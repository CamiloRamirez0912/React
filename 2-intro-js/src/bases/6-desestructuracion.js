//Desestructuración

const persona = {
    nombre: 'Pepe',
    edad: 21,
    clave: 'Ironman',
    rango: 'Soldado',
}

//const {nombre, edad, clave} = persona;

//console.log(nombre);
//console.log(edad);
//console.log(clave);

const useContext = ({clave, nombre, edad, rango = 'Capital'}) =>{ //si el objeto no tiene rango, por defecto seria capitan, si tiene rango toma el valor que tiene el objeto :0

    //console.log(nombre, edad, rango);
    return{
        nombreClave: clave,
        anios: edad,
        latlng:{
            lat: 12.345,
            lng: -12.531,
        }
    }
}

const {nombreClave, anios, latlng:{lat, lng}} = useContext(persona);

console.log(nombreClave, anios);
console.log(lat, lng); 