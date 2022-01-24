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
//데이터베이스에 연결
function connectDB() {
    //데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/bitDB';
    //데이터베이스에 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;  //mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        //스키마 정의
        //스키마 수정
        MemberSchema = mongoose.Schema({
            userId: { type: String, required: true, unique: true },
            userPwd: { type: String, required: true },
            userName: { type: String, index: 'hashed' },
            age: { type: Number, 'default': -1 },
            regDate: { type: Date, index: { unique: false }, 'default': Date.now },
            updateDate: { type: Date, index: { unique: false }, 'default': Date.now },
        })
        //스키마에 static 메소드 추가
        MemberSchema.static('findById', function (userId, callback) {
            return this.find({ userId: userId }, callback);
        });
        MemberSchema.static('findAll', function (callback) {
            return this.find({}, callback);
        });
        console.log('MemberSchema 정의함.');
        //MmeberModel 모델 정의
        MemberModel = mongoose.model("members2", MemberSchema);
        console.log('MemberModel 정의함.');
    });
    //연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function () {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    })
}

app.listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    //데이터베이스 연결을 위한 함수 호출
    connectDB();
});
//=========================================================================================

//=========================== 함수들 ==============================================
//사용자를 인증하는 함수
var authMember = function (database, userId, userPwd, callback) {
    console.log('authMember 호출됨 : ' + userId + userPwd);
    //1. 아이디를 사용해 검색
    MemberModel.findById(userId, function (err, results) {
        if (err) {
            callback(err, null); return;
        }
        console.log('아이디 [%s]로 사용자 검색 결과', userId);
        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');
            //2. 비밀번호 확인
            if (results[0]._doc.userPwd === userPwd) {
                console.log('비밀번호 일치함'); callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음'); callback(null, null);
            }
        } else {
            console.log("아이디와 일치하는 사용자를 찾지 못함."); callback(null, null);
        }
    })
}   //authMember ends.

//회원 가입을 위한 함수
var addMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('addMember 호출 : ' + userId + ', ' + userPwd + ', ' + userName + ',' + age);
    //MemberModel 인스턴스 생성
    var user = new MemberModel({ "userId": userId, "userPwd": userPwd, "userName": userName, "age": age });
    //save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
    user.save(function (err, addedUser) {
        console.log("addedUser%j", addedUser);
        if (err) {
            callback(err, null);
            return;
        }
        console.log("사용자데이터 추가함");
        callback(null, addedUser);
    });
};

//회원 수정을 위한 함수
var updateMember = function (database, userId, userPwd, callback) {
    console.log('updateMember 호출됨 : ' + userId + ',' + userPwd);
    var members = database.collection('Members2');
    members.updateMany({ "userId": userId }, { $set: { "userPwd": userPwd } }, function (err, result) {
        console.log("result :updateCout" + result.matchedCount);
        if (err) {
            //오류 발생 시 콜백 함수가 호출되어 오류 객체 전달
            callback(err, null);
            return;
        }
        if (result.matchedCount > 0) {
            console.log("사용자 레코드 수정됨 : " + result.matchedCount);
        } else {
            console.log("수정되지 않았음.");
        }
        callback(null, result);
    })
}
//===========================================================================================

//======== 라우팅 함수 등록 ===========//
var router = express.Router();
//=========================== 로그인 기능 추가 ==============================================
// 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post(function (req, res) {
    console.log('/process/login 호출됨.');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터 : ' + userId + ',' + userPwd);
    //데이터베이스 객체가 초기화 된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        authMember(database, userId, userPwd, function (err, docs) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (docs) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공</h1>');
            } else {
                //조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 실패</h1>');
                res.end();
            }
        })
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
})
//=========================== 회원가입 기능 추가 ==============================================
router.route('/process/addMember').post(function (req, res) {
    console.log('/process/addMember 호출됨.');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var userName = req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;
    console.log('요청 파라미터 : ' + userId + ',' + userPwd + ',' + userName, +',' + age);
    //데이터베이스 객체가 초기화 된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        addMember(database, userId, userPwd, userName, age, function (err, docs) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (docs) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원가입 성공</h1>');
            } else {
                //조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원가입 실패</h1>');
                res.end();
            }
        })
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
})
//=========================== 회원수정 기능 추가 ==============================================
router.route('/process/updateMember').post(function (req, res) {
    console.log('/process/updateMember 호출됨.');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터 : ' + userId + ',' + userPwd);
    //데이터베이스 객체가 초기화 된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        updateMember(database, userId, userPwd, function (err, docs) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (docs.matchedCount > 0) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원수정 성공</h1>');
            } else {
                //조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원수정 실패</h1>');
                res.end();
            }
        })
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
})
//=========================== 회원리스트 불러오기 기능 추가 ==============================================
router.route('/process/listMember').post(function (req, res) {
    console.log('/process/listMember 호출됨.');
    if (database) {
        //1.모든 사용자 검색
        MemberModel.findAll(function (err, results) {
            if (err) {
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            if (results) {
                //결과 객체 있으면 리스트 전송
                console.dir(results);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');
                for (var i = 0; i < results.length; i++) {
                    var curUserId = results[i]._doc.userId;
                    var curUserPwd = results[i]._doc.userPwd;
                    var curUserName = results[i]._doc.userName;
                    var curUserAge = results[i]._doc.age;
                    var curRegDate = results[i]._doc.regDate;
                    var curUpdateDate = results[i]._doc.updateDate;
                    res.write(' <li>#' + i + ' : ' + curUserId + ', ' + curUserPwd + ', ' + curUserName + ', ' + curUserAge + ', ' + curRegDate + ', ' + curUpdateDate + ' </li>');
                }
                res.write('</ul></div>');
                res.end();
            } else {
                //결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원조회 실패</h1>');
                res.end();
            }
        })  //findAll
    }
})
//=====================================================================================================
//===========================================================================================
app.use('/', router);
//================================================================================================================================