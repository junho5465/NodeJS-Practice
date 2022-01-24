// var fs = require('fs');
// var http = require('http');
// var server = http.createServer();
// var port = 3000;
// server.listen(port, function () {
//     console.log('웹 서버 시작.. : %d', port);
// })
// server.on('connection', function (socket) {
//     var addr = socket.address();
//     console.log('클라이언트가 접속.. : %s, %d', addr.address, addr.port);
// })

// server.on('request', function(req, res){
//     console.log('클라이언트 요청.');
//     var filename = 'bg11.jpg';
//     var infile = fs.createReadStream(filename, {flags:'r'});
//     infile.pipe(res);
// })

//다른 웹 사이트의 데이터 가져오기1
// const { resolveSoa } = require('dns');
// const http=require('http');
// const options={
//     host:'www.google.com',
//     port:80,
//     path:'/'
// };
// const req = http.get(options, function(res){
//     let resData = '';
//     res.on('data', function(chunk){
//         resData+=chunk;
//     })
//     res.on('end', function(){
//         console.log(resData);
//     })
// })
// req.on('error', function(err){
//     console.log("오류 발생"+err.message);
// })

//다른 웹사이트의 데이터 가져오기2
// let http = require('http');

// let opts = {
//     host: 'www.google.com',
//     port: 80,
//     method: 'POST',
//     path: '/',
//     headers: {}
// };
// let resData = '';
// let req = http.request(opts, function (res) {
//     //응답 처리
//     res.on('data', function (chunk) {
//         resData += chunk;
//     })
//     res.on('end', function () {
//         console.log(resData);
//     })
// })
// //post 방식으로 요청시에는 헤더 작성 필요
// opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// req.data = "q=actor";
// opts.headers['Content-Length'] = req.data.length;
// req.on('error', function (err) {
//     console.log("에러 발생 : " + err.message);
// })
// //요청 전송
// req.write(req.data);
// req.end();
