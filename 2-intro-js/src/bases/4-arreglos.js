// Arreglos en js

//const arreglo = new Array();
const arreglo = [1, 2, 3, 4];
//arreglo.push(1); no usar push
//arreglo.push(2);
//arreglo.push(3);
//arreglo.push(4);

let arreglo2 = [...arreglo, 5];

let arreglo3 = arreglo2.map(function(number){
    return number * 2;
});

console.log(arreglo);
console.log(arreglo2);
console.log(arreglo3);
