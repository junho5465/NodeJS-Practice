// 네이버 검색 API예제는 블로그를 비롯 전문자료까지 호출방법이 동일하므로 blog검색만 대표로 예제를 올렸습니다.
// 네이버 검색 Open API 예제 - 블로그 검색
var express = require('express');
var app = express();
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');

//익스프레스에서 뷰 엔진을 ejs로 설정
app.set('/views', __dirname + '/views');
app.set('view engine', 'ejs');
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/semantic', static(path.join(__dirname, 'semantic')));

//라우팅 설정
app.get('/naver/news', (req, res) => {
  const client_id = 'WQogqDsqqG0JHYZfh5uj';
  const client_secret = 'Of1ZoonZIV';
  const api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(req.query.query);
  const option = {};
  var request = require('request');
  const options = {
    url: api_url, qs: option,
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
  };
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let newsItems = JSON.parse(body).items; //items-title, link, description, pubDate
      const result = [];
      for (let i = 0; i < newsItems.length; i++) {
        let newsItem = {};
        newsItem.title = newsItems[i].title.replace(/(<([^>]+)>)|&quot;/ig, ""); //나머지 아이템들 생략
        newsItem.link = newsItems[i].link.replace(/(<([^>]+)>)|&quot;/ig, "");
        newsItem.description = newsItems[i].description.replace(/(<([^>]+)>)|&quot;/ig, "");
        newsItem.pubDate = newsItems[i].pubDate.replace(/(<([^>]+)>)|&quot;/ig, "");
        result.push(newsItem);
      }
      var context = { result:result };
      
      res.app.render('newsList', context, function (err, html) {
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
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});
app.listen(3000, function () {
  console.log('http://127.0.0.1:3000/search/news?query=검색어 app listening on port 3000!');
});