//=========================== 모듈 =================================================
//Express 기본 모듈 불러오기
let express = require('express'), http = require('http'), path = require('path');
//Express의 미들웨어 불러오기
let bodyParser = require('body-parser'), cookieParser = require('cookie-parser'), static = require('serve-static'), errorHandler = require('errorhandler');
//오류 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');
//Session 미들웨어 불러오기
let expressSession = require('express-session');
//익스프레스 객체 생성
let app = express();
let mongoose = require('mongoose');
//==================================================================================
//기본 속성 설정
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
//public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

//=========================== DB 관련 설정 =================================================
let database; let MemberSchema; let MemberModel;
function createMemberSchema(database) {
    console.log('createMemberSchema() 호출됨');
    database.MemberSchema = require('./database/memberSchema').createSchema(mongoose);
    database.MemberModel = mongoose.model("members2", database.MemberSchema);
    console.log('Schema 생성 되었음.');
    console.log('Model 생성 되었음.');
}
// 데이터베이스에 연결
function connectDB() {
    //데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/bitDB';
    //데이터베이스에 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;//Promise를 전역변수를 사용하기 위해 global 사용  //mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        //스키마 정의
        createMemberSchema(database);
    });
    //연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function () {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    })
    app.set('database', database); //다른모듈에서도 사용할 수 있게 set을 사용함, 다른데에서는 get 사용하면됨
}
//======== 라우팅 함수 등록 ===========//
//라우팅 함수 등록
var router = express.Router();
var member = require('./member');
router.route('/process/login').post(member.procLogin);
router.route('/process/addMember').post(member.procAddMember);
router.route('/process/listMember').post(member.procListMember);
router.route('/process/updateMember').post(member.procUpdateMember);

app.use('/', router);

//404 Error Handling
errorHandler = expressErrorHandler({
    static: { '404': './public/404.html' }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//서버 시작
app.listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트' + app.get('port'));
    connectDB(); //데이터베이스 연결
});