//멤버 1
// require() 메소드는 export 객체를 반환함
// var member1 = require('./member1');
// function showMember(){
//     return member1.getMember().userName +', ' + member1.group.userName;
// }
// console.log('사용자 정보 : %s', showMember());

//멤버2
// var member2 = require('./member2');
// function showMember(){
//     return member2.getMember().userName +', ' + member2.group.userName;
// }
// console.log('사용자 정보 : %s', showMember());

//멤버3
// var member3 = require('./member3');
// function showMember(){
//     return member3.getMember().userName +', ' + member3.group.userName;
// }
// console.log('사용자 정보 : %s', showMember());

//멤버4
// var member4 = require('./member4');
// function showMember(){
//     return member4().userName +', ' + 'no group';
// }
// console.log('사용자 정보 : %s', showMember());

//멤버5
// var printMember = require('./member5').printMember;
// printMember();

//멤버6
// var member6 = require('./member6');
// member6.printMember();

//멤버7
var Member7 = require('./member7');
var Member7 = new Member7('conan', '코난');
Member7.printMember();