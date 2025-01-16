const personajes = ['Goku', 'Vegeta', 'Trunks'];

//console.log(personajes[0]);
//console.log(personajes[1]);
//console.log(personajes[2])

const [, ,p3] = personajes; //para indicar que no se necesita el primer elemento del arreglo

//console.log(p1);
console.log(p3);


const returnArray = () =>{
    return ['ABC', 123];
}

const[letras, numeros] = returnArray();

console.log(letras);
console.log(numeros);


const useState = (nombre) =>{
    return [nombre, ()=>{console.log('Hola mundo')}];
}

const[nombre, setNombre] = useState('Goku');

console.log(nombre);
setNombre();