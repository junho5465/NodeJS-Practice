// console.log('asaaa');
// console.log('숫자 보여주기 : %d', 10);
// console.log('문자열 보여주기 : %s', '안녕!');
// console.log('JSON 객체 보여주기 : %j', {name:'코난'});

// var result = 0;
// console.time('elapsedTime');
// for(var i=1;i<=100;i++){
//     result +=i;
// }
// console.timeEnd('elapsedTime');
// console.log('1부터 100까지 합 : %d',result);

//__filename, __dirname 전역 변수 사용하여 파일 이름 출력
// console.log('현재 실행한 파일의 이름 : %s', __filename);
// console.log('현재 실행한 파일의 path : %s', __dirname);
// var Person = {name : "conan", age : 10};
// console.dir(Person);

//변수 호이스팅 - 변수 타입을 미리 선언할 필요가 없음
// console.log(dog);   //undefined
// var dog = "bark";
// console.log(dog);   //bark
// var dog = "happy";
// console.log(dog);   //happy

//let, const를 사용하여 변수를 중복 선언 못하게 함
// let dog;
// dog = "happy";
// console.log(dog);
// let dog = "happy";
// const dog = "happy";
// const dog = "very happy";

// var dog = "happy";
// console.log(dog);   //happy
// {
//     var dog = "sad";
// }
// console.log(dog);   //sad

// let dog = "happy";
// {
//     let dog = "sad";
// }
// console.log(dog);   //happy

//클로저 - 내부 함수가 외부 함수의 스코프에 접근할 수 있음
// function outer(){
//     var a = 'AA';
//     var b = 'BB';
//     function inner(){
//         var a = 'aa';
//         console.log("from inner : " + a);
//     }
//     return inner;
// }

// var outerFunc = outer();
// outerFunc();

//객체 - key와 value의 쌍으로 이루어진 property, method의 집합
// const car = {
//     name:'beetle',
//     spped:100,
//     color:'yellow',
//     start:function(){
//         return this.speed+10;
//     }
// }
// console.dir(car);

//함수 및 함수의 선언
// function add(a,b){
//     return a+b;
// }
// console.log(add(1,4));

//람다식을 이용한 함수 선언
// const lamda_add = (a,b)=>{
//     return a+b;
// }
// console.log("lamda add : " + lamda_add(2,4));

// const lamda_add=(a,b)=>a+b;
// console.log("lamda add : " + lamda_add(2,4));

//함수 생성시에 자신의 스코프 안에 자신을 가르키는 this와 패러미터가 담기는 arguments가 자동 생성됨.
// const myFunc = function(){
//     console.log(arguments);
// }
// myFunc(1,2,3,4);

//람다식 표현에는 arguments가 자동으로 생성하지 않으므로 필요한 경우 ...args로 생성
// const myFunc = (...args)=>{
//     console.log(args);
// }
// myFunc(1,2,3,4);

//프로토타입 : 객체 지향 프로그래밍을 할 수 있게 도와줌
// function person(){};
// console.log(person.prototype);

// person.prototype.name = 'conan';
// console.log(person.prototype);

//콜백 함수(비동기처리) - 나중에 실행되는 함수 , A()라는 함수의 인자로 함수를 넘겨준 경우
// setTimeout(()=>{
//     console.log('todo:first!');
// }, 3000);

// setTimeout(()=>{
//     console.log('todo:second!');
// }, 2000);

//동기처리 - 콜백함수를 이용하여 first를 출력 후 second 출력
// setTimeout(() => {
//     setTimeout(() => {
//         console.log('todo:second!');
//     }, 2000);
//     console.log('todo:first!');
// }, 3000)

//사용자 정의 함수의 동기 처리 - 콜백 큐를 거치지 않고 동기적으로 처리됨
// function mySetTimeout(callback){
//     callback();
// }
// console.log(0);
// mySetTimeout(function(){
//     console.log('hello');
// });
// console.log(1);

//API의 비동기 처리
// console.log(0);
// setTimeout(function(){
//     console.log('hello');
// }, 0);
// console.log(1);

//promise - 보낸 요청에 대해 응답이 준비되었을 때 알림을 주는 역할
//1초가 걸리는 작업을 first->second->third 순으로 동작시키ㅣ고 싶을때
// function work(sec, callback){
//     setTimeout(()=>{
//         callback(new Date().toISOString());
//     }, sec*1000);
// };
// work(1,(result)=>{
//     console.log('first', result);
// });
// work(1,(result)=>{
//     console.log('second', result);
// });
// work(1,(result)=>{
//     console.log('third', result);
// });

// function work(sec, callback) {
//     setTimeout(() => {
//         callback(new Date().toISOString());
//     }, sec * 1000);
// };
// work(1,(result)=>{
//     console.log('first', result);
//     work(1,(result)=>{
//         console.log('second', result);
//         work(1,(result)=>{
//             console.log('third', result);
//         })
//     })
// })

//promise 비동기 처리를 다루고 싶을때
// function workP(sec) {
//     //Promise 인스턴스를 반환하고, then에서는 성공시 콜백함수 호출
//     return new Promise((resolve, reject) => {
//         //Promise 생성시 넘기는 callback
//         //resolve : 동작 완료시 호출, reject : 오류 발생시
//         setTimeout(() => {
//             resolve(new Date().toISOString());
//         }, sec * 1000);
//     });
// }

// workP(1).then((result) => {
//     console.log('first', result);
//     return workP(1);
// }).then((result) => {
//     console.log('second', result);
// })

//Promise의 catch 사용(1/2)
// const flag = false;
// const promise = new Promise((resolve, reject)=>{
//     if(flag == true){
//         resolve('orange');
//     }else{
//         reject('apple');
//     }
// });
// promise.then((value)=>{
//     console.log(value);
// })
// promise.catch((value)=>{
//     console.log(value);
// })

//Promise의 catch 사용(2/2)
// const flag = false;
// const promise = new Promise((resolve,
//     reject) => {
//     if (flag === true) {
//         resolve('orange');
//     } else {
//         reject('apple');
//     }
// }).then((value) => {
//     console.log(value);
// }).catch((value) => {
//     console.log(value);
// })