let express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), static = require('serve-static');
let app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var multer = require('multer');
var fs = require('fs');
var cors = require('cors');

app.use('/public', static(path.join(__dirname, '/public')));
app.use('uploads', static(path.join(__dirname, 'uploads')));
app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, callback) { callback(null, 'uploads') },
    filename: function (req, file, callback) { callback(null, file.originalname + Date.now()) }
});
var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

var router = express.Router();

router.route('/process/upload').post(upload.array('uploadedFile', 1), function (req, res) {
    console.log('/process/upload호출');
    try {
        var files = req.files;
        console.dir('#===업로드된 첫번째 파일 정보===#');
        console.dir(req.files[0]);
        console.dir('#=====#');

        var originalname = '', filename = '', mimetype = '', size = 0;
        if (Array.isArray(files)) {
            console.log("배열에 들어있는 파일 개수 : %d", files.length);
            for (var index = 0; index < files.length; index++) {
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        } else {
            console.log("파일 개수 : 1");
            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write("<h1>파일업로드 성공</h1>");
        res.write('<hr/>');
        res.write("<p>원본 파일명 : " + originalname + "->저장파일명 : " + filename + "</p>");
        res.write("<p>MIME TYPE : " + mimetype + "</p>");
        res.write("<p>파일 크기 : " + size + "</p>");
        res.end();
    } catch (err) { console.dir(err.stack); }
});

app.use('/', router);

var expressErrorHandler = require('express-error-handler');

var errorHandler = expressErrorHandler({
    static: { '404': './public/404.html' }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 start');
});