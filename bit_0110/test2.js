// const calc = require('./calc.js');
// console.log('모듈로 분리한 후 - calc.add 함수 호출 결과 : %d', calc.add(20, 20));

// var calc2 = require('./calc2.js');
// console.log('모듈로 분리한 후 - calc2.add 함수 호출 결과 : %d', calc2.add(10,20));

// const nconf = require('nconf');
// nconf.env();
// console.log('OS 환경변수의 값 : %s',nconf.get('OS'));

//require 함수를 이용해 모듈을 불러온 후 사용
// const os = require('os');
// console.log('시스템의 hostname : %s', os.hostname());
// console.log('시스템의 메모리 : %d / %d', os.freemem(), os.totalmem());
// console.log('시스템의 CPU 정보\n');
// console.dir(os.cpus());
// console.log('시스템의 네트워크 인터페이스 정보\n');
// console.dir(os.networkInterfaces());


//----------------Path 모듈 ---------------------------
// var path = require('path');
// //디렉터리 이름 합치기
// var directories = ["users", "mike", "docs"];
// var docsDirectory = directories.join(path.sep);
// console.log('문서 디렉토리 :  %s', docsDirectory);
// //디렉터리 이름과 파일 이름 합치기
// var curPath = path.join('/Users/mike', 'notepad.exe');
// console.log('파일 패스 : %s', curPath);

// var path = require('path');
// //패스에서 디렉터리, 파일 이름, 확장자 구별하기
// var filename = "C:\\Users\\mike\\notepade.exe";
// var dirname = path.dirname(filename);
// var basename = path.basename(filename);
// var extname = path.extname(filename);
// console.log('디렉터리 : %s, 파일 이름 : %s, 확장자 : %s', dirname, basename, extname);
//--------------------------------------------------


//-----------------------url 모듈 ----------------------
// var url = require('url');
// var curURL = url.parse('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8');
// var curStr = url.format(curURL);
// console.log('주소 문자열 : %s', curStr);
// console.dir(curURL);
//-----------------------------------------------------

//-----------------------querystring 모듈 ----------------------
// var url = require('url');
// var curURL = url.parse('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8');
// var querystring = require('querystring');
// var param = querystring.parse(curURL.query);
// console.log('요청 query 중 파라미터의 값 : %s', param.query);
// console.log('원본 요청 파라미터 : %s', querystring.stringify(param));
//-----------------------------------------------------

//-----------------------이벤트 모듈 (on('tick'))----------------------
process.on("tick", function(count){
    console.log("tick 이벤트 발생함 : %s", count);
})
setTimeout(function(){
    console.log('2초 후에 tick 이벤트 전달 시도함');
    process.emit('tick', '2');
}, 2000);