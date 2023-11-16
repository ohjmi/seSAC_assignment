const http = require('http');
const fs = require('fs').promises;
const path = require('path');
// const querystring = require('querystring');
// const parse = querystring.parse;
// const parse = require('querystring').parse;

// 객체 디스트럭처링
// const { parse } = require('querystring');

const SUCCESS = 200;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;

const users = {};

// 서버의 개체 생성
const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);

    try {
        if (req.method === 'GET' && req.url.startsWith('/static/')) {
            const filePath = '.' + req.url;
            const data = await fs.readFile(filePath);
            const contentType = getContentType(filePath);
            res.writeHead(200, {'Content-Type': contentType});
            return res.end(data);
        }

        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile('./index.html');
                res.writeHead(SUCCESS, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            } else if (req.url == '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(SUCCESS, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            } else if (req.url === '/user') {
                res.writeHead(SUCCESS, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(JSON.stringify(users));
            } else {
                const imageMatch = req.url.match(/^\/images\/(.+)$/);
                if (imageMatch) {
                    const imageName = imageMatch[1];
                    const imagePath = './static/' + imageName;
                    try {
                        const contentType = getContentType(imagePath);
                        const data = await fs.readFile(imagePath);
                        res.writeHead(SUCCESS, { 'Content-Type': contentType });
                        res.end(data);
                    } catch (error) {
                        res.writeHead(NOT_FOUND, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end('Not Found. 없어~~~~~');
                    }
                }
            }
        } else if (req.method === 'POST') {
            if (req.url === '/user') {

                // 요청을 생성할 때
                // 요청 request를 파싱해서 처리
                let body = '';

                req.on('data', (data) => {
                    body += data;
                });
                req.on('end', () => {
                    console.log('요청 온 내용은??', body);
                    const formData = JSON.parse(body);
                    console.log('파싱한 후??', formData);

                    const username = formData.name;
                    console.log('사용자 이름은??', username);

                    const id = Date.now();
                    users[id] = username;
                    console.log('최종 객체:', users);
                });
                // 결과 response 주는 코드
                res.writeHead(201, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('등록 성공');
            }
            // 요청을 수정할 때
        } else if (req.method === 'PUT') {
            // 수정 명령어
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                req.on('end', () => {
                    // 다 온 데이터를 기반으로 프로세싱
                    console.log('PUT Body', body);
                    // 수정 코드를 작성하시오
                    const formData = JSON.parse(body);
                    users[key] = formData.name;
                })
            }
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('수정 성공');


        } else if (req.method === 'DELETE') {
            // 요청을 삭제할 때
            // 요청에 대한 파싱
            // 1. url에 /users/ 시작하는걸 찾아서
            // 2. 그 뒤에 있는 글자를 읽어서 key로 처리하는 것
            // 3. 그 키를 users라는 객체안에서 삭제
            
            if (req.url.startsWith('/user/')) {
                try {
                    const key = req.url.split('/')[2];
                    delete users[key];

                    // 요청에 대한 응답 결과를 준다.
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    // res.end(JSON.stringify(users)); // 삭제하고 난 후의 목록을 보여준다.
                    res.end('삭제 성공');
                } catch (error) {
                    console, error('삭제 중 오류 발생:', error);
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('서버에서 알 수 없는 오류가 발생하여 삭제에 실패하였습니다. 관리자에게 문의하세요.');
                }
            } else {
                res.writeHead(NOT_FOUND, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('Not Found');
            }

        }
    } catch (err) {
        console.error('오류발생', err.message);
        res.writeHead(SERVER_ERROR, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('서버 오류...');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`${port}번 포트 열려있음`);
});

// filePath(URL 경로)를 기반으로,
// 요청한 내용이 무엇인지 판단해서, 그 content-Type을 반환핱다.
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
          return 'text/html; charset=utf-8';
        case '.css':
          return 'text/css; charset=utf-8';
        case '.js':
          return 'text/javascript; charset=utf-8';
        case '.jpg':
          return 'image/jpg';
        default:
          return 'application/octet-stream';
      }
}