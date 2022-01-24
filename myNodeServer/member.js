var listMember = function (database, callback) {
    console.log('listMember 호출됨');
    database.MemberModel.findAll(function (err, results) {
        console.log('findall 호출됨');
        if (err) {
            callback(err, null); return;
        }
        if (results.length > 0) {
            console.log('등록된 회원 목록 결과.' + results); callback(null, results);
        } else {
            console.log('등록된 회원 없음.'); callback(null, null);
        }
    })
}

// 데이터베이스 모델 객체를 위한 변수 선언
var addMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('addMember 호출됨 : ' + userId + ', ' + userPwd + ', ' + userName + ',' + age);
    //Member Model 인스턴스 생성
    var user = new database.MemberModel({ "userId": userId, "userPwd": userPwd, "userName": userName, "age": age });
    // save()로 저장 : 저장 성공시 addedUser 객체가 파라미터로 전달됨
    user.save(function (err, addedUser) {
        console.log("addedUser%j", addedUser);
        if (err) {
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null, addedUser);
    });
}
// 사용자를 인증하는 함수
var authMember = function (database, userId, userPwd, callback) {
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd);
    // 아이디와 비밀번호를 사용해 검색
    database.MemberModel.findById(userId, function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과', userId, userPwd);
        console.dir(results);
        if (results.length > 0) {
            console.log('일치하는 사용자 찾음.', userId, userPwd)
            //2. 비밀번호 확인
            if (results[0]._doc.userPwd === userPwd) {
                console.log('비밀번호 일치함'); callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음.'); callback(null, null);
            }
        } else {
            console.log('일치하는 사용자 찾지 못함.');
            callback(null, null);
        }
    })
}

var updateMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('updateMember 호출됨 : ' + userId + ',' + userPwd);
    var members = database.collection('members2');
    members.updateMany({ "userId": userId }, { $set: { "userPwd": userPwd, "userName": userName, "age": age } }, function (err, result) {
        console.log("result :updateCount " + result.matchedCount);
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
//=========================== 회원리스트 불러오기 기능 추가 ==============================================
var procListMember = function (req, res) {
    console.log('모듈 내에 있는 procListMember');
    var database = req.app.get('database');
    if (database.db) {
        listMember(database, function (err, results) {
            console.log("aaaaa " + results);
            if (err) { throw err; }
            if (results) {
                var context = { results: results };
                res.app.render('listMember', context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    res.end(html);
                })
            } else {
                //결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원조회 실패</h1>');
                res.end();
            }
        });
    } else {
        console.log('db 연결 오류 ');
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h1> DB 연결 실패</h1>');
        res.end();
    };
};
//=========================== 회원가입 기능 추가 ==============================================
var procAddMember = function (req, res) {
    console.log('/process/addMember 호출됨');
    var database = req.app.get('database');
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var userName = req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd + ', ' + userName + ',' + age);
    // 데이터베이스 객체가 초기화된 경우, addMember 함수 호출하여 사용자 추가
    if (database.db) {
        var user = new database.MemberModel({ "userId": userId, "userPwd": userPwd, "userName": userName, "age": age });
        addMember(database, userId, userPwd, userName, age, function (err, addedUser) {
            if (err) { throw err; }
            //결과 객체 확인하여 추가된 데이터 있으면 성공 응답 전송
            if (addedUser) {
                var context = { addedUser: addedUser };
                res.app.render('signup', context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    res.end(html);
                })
            } else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else {
        // 데이터베이스 객체가 초기화되지 않는 경우 실패응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
};
//=========================== 로그인 기능 추가 ==============================================
var procLogin = function (req, res) {
    console.log('procLogin 호출됨');
    var database = req.app.get('database');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd);
    //데이터베이스 객체가 초기화된 경우, authMember함수 호출하여 사용자 인증
    if (database.db) {
        authMember(database, userId, userPwd,
            function (err, docs) {
                if (err) { throw err; }
                //조회된 레코드가 있으면 성공 응답 전송   
                if (docs) {
                    var context = { userId: userId, userPwd: userPwd };
                    req.app.render('loginSuccess', context, function (err, html) {
                        res.writeHead(200, {
                            "Content-Type": "text/html;charset=utf8"
                        });
                        console.log('rendered : ' + html);
                        res.end(html);
                    })
                } else {//조회된 레코드가 없는 경우 실패 응답 전송
                    res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf8"
                    });
                    res.write('<h1>로그인 실패</h1>');
                    res.write('<p>사용자 아이디 : ' + userId + '</p>');
                    res.write('<p>사용자 비밀번호 : ' + userPwd + '</p>');
                    res.end();
                }
            });
    } else {
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf8"
        });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
}
//=========================== 회원 수정 추가 ==============================================
var procUpdateMember = function (req, res) {
    console.log('/process/updateMember 호출됨.');
    var database = req.app.get('database');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var userName = req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;
    console.log('요청 파라미터 : ' + userId + ',' + userPwd + ',' + userName + ',' + age);
    //데이터베이스 객체가 초기화 된 경우, authMember 함수 호출하여 사용자 인증
    if (database.db) {
        updateMember(database, userId, userPwd, userName, age, function (err, docs) {
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
}
//=====================================================================================================
module.exports.procLogin = procLogin;
module.exports.procAddMember = procAddMember;
module.exports.procListMember = procListMember;
module.exports.procUpdateMember = procUpdateMember;