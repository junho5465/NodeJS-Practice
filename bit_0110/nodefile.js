//비동기식으로 파일 읽기
// var fs = require('fs');
// fs.readFile('../package.json', 'utf8', function(err, data){
//     console.log(data);
// })
// console.log('프로젝트 폴더 안의 package.json 파일 읽기');

const { fstat } = require("fs");
const { Server } = require("http");

// var data = fs.readFileSync('../package.json', 'utf8');
// console.log(data);

//비동기식으로 파일 쓰기
// var fs = require('fs');
// fs.writeFile('./output.txt', 'Hello World!', function(err){
//     if(err){
//         console.log('Error : ' + err);
//     }
//     console.log('output.txt 파일에 데이터 쓰기 완료.');
// })

//파일 열기, 닫기, 읽기 & 쓰기
// const fs = require('fs');
// fs.open('./output.txt', 'w', function (err, fd) {
//     if (err) throw err;
//     const buf = Buffer.from('안녕!\n', 'utf-8');
//     fs.write(fd, buf, 0, buf.length, null, function (err, written, buffer) {
//         if (err) throw err;
//         console.log(err, written, buffer);
//         fs.close(fd, function () {
//             console.log('파일 열고 데이터 쓰고 파일 닫기 완료');
//         })
//     })
// })

//파일 직접 열고 읽기 a+ =append
// var fs = require('fs');
// fs.open('./output.txt', 'r', function (err, fd) {
//     if (err) throw err;
//     var buf = Buffer.alloc(20);
//     console.log('버퍼 타입 : %s', Buffer.isBuffer(buf));
//     fs.read(fd, buf, 0, buf.length, null, function (err, bytesRead, buffer) {
//         if (err) throw err;
//         var inStr = buffer.toString('utf8', 0, bytesRead);
//         console.log('파일에서 읽은 데이터 : %s', inStr);
//         console.log(err, bytesRead, buffer);
//         fs.close(fd, function () {
//             console.log('output.txt 파일을 열고 읽기 완료');
//         })
//     })
// })

//스트림 단위로 파일 읽고 쓰기
// var fs = require('fs');
// var infile = fs.createReadStream('./output.txt', { flags: 'r' });
// var outfile = fs.createWriteStream('./output2.txt', { flags: 'w' });
// infile.on('data', function (data) {
//     console.log('읽어 들인 데이터', data);
//     outfile.write(data);
// })
// infile.on('end', function () {
//     console.log('파일 읽기 종료');
//     outfile.end(function () {
//         console.log('파일 쓰기 종료');
//     })
// })

//새 디렉터리 만들고 삭제하기
// var fs = require('fs');
// fs.mkdir('./docs', 0666, function(err){
//     if(err)throw err;
//     console.log('새로운 docs 폴더를 생성');
// })
// fs.rmdir('./docs', function(err){
//     if(err) throw err;
//     console.log('docs 폴더를 삭제');
// })

//http 모듈로 웹 서버 시작
// var http = require('http');
// var server = http.createServer();
// var port = 3000;
// server.listen(port, function(){
//     console.log('웹 서버 시작.. : %d', port);
// })

//웹 서버 실행 시 호스트와 포트 지정하는 경우
// var http = require('http');
// var server = http.createServer();
// var host = '192.168.0.7';
// var port = 3000;
// server.listen(port, host, '50000', function(){
//     console.log('웹 서버 시작 : %s, %d', host, port);
// })

//ex) connection 이벤트와 request 이벤트 처리
var fs = require('fs');
var http = require('http');
var server = http.createServer();
var port = 3000;
server.listen(port, function () {
    console.log('웹 서버 시작.. : %d', port);
})
server.on('connection', function (socket) {
    var addr = socket.address();
    console.log('클라이언트가 접속.. : %s, %d', addr.address, addr.port);
})
server.on('request', function (req, res) {
    console.log('클라이언트가 요청함.');
    // console.dir(req);
    // res.writeHead(200, {"Content-Type" : "text/html;charset=utf-8"});
    // res.write("<!DOCTYPE html>");
    // res.write("<html>");
    // res.write("<head>");
    // res.write("<title>응답 페이지</title>");
    // res.write("</head>");
    // res.write("<body>");
    // res.write("<h1>노드제이에스로부터의 응답 페이지</h1>");
    // res.write("</body>");
    // res.write("</html>");
    // res.end();
    var filename = '../project_bg.jpg';
    fs.readFile(filename, function(err,data){
        res.writeHead(200, {"Content-Type" : "image/jpg"});
        res.write(data);
        res.end();
    })
})