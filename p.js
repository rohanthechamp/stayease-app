const args = [10, 20, 30];
function multiply(a, b, c) {
    console.log('values:= ',a,b,c)
}

multiply(...args);//^ apply = ... rest operator


// *call 
// const data1 = {
//     name:'rock'
// }

// const data2 = {
//     name: 'john'
// }

// const data3 = {
//     name: 'rey'
// }

// function greet() {
//     console.log(this.name)
// }

// greet.call(data2)