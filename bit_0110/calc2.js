// var calc = {};
// calc.add=function(a,b){
//     return a+b;
// }
// module.exports = calc;

var Calc= require('./calc3');
var calc = new Calc();
calc.emit('stop');
console.log(Calc.title + '에 stop 이벤트 전달함');