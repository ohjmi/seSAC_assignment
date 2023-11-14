const http = require('http');
const fs = require('fs').promises;

const SUCCESS = 200;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;
// 서버의 개체 생성



const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);

    const urlParts = req.url.split('/');
    const secondParts = urlParts[2];
    const thirdParts = urlParts.slice(3);
    const filePath = `./static/${secondParts}/${thirdParts.join('/')}`;
    console.log('파일 경로:', filePath);

    try {
        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile('./index.html');
                res.writeHead(SUCCESS, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            } else if (req.url == '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(SUCCESS, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            } else if (req.url.startsWith('/images/')) {
                // console.log(`.${req.url}`);
                const data = await fs.readFile(`.${req.url}`);
                res.writeHead(SUCCESS, { 'Content-Type': 'image/jpg' });
                res.end(data);

            } else if (req.url === '/images/dog1.jpg') {
                const data = await fs.readFile('./images/dog1.jpg');
                res.writeHead(SUCCESS, { 'Content-Type': 'image/jpg' });
                res.end(data);
            } else if (req.url.startsWith('/static/')) {
                const extname = filePath.match(/\.([^.]+)$/)[1];
                const contentType = getContentType(extname);
                const data = await fs.readFile(filePath);
                res.writeHead(SUCCESS, {'Content-Type': contentType});
                res.end(data);
            } else {
                res.writeHead(NOT_FOUND, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('Not Found. 없어~~~~~');
            }
        } else if (req.method === 'POST') {
            // 요청을 생성할 때
            res.writeHead(201);
            res.end('등록 성공');
            // 요청을 수정할 때
        } else if (req.method === 'PUT') {
            res.end('수정 성공');
            // 요청을 삭제햘 때
        } else if (req.method === 'DELETE') {
            res.end('삭제 성공');
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

function getContentType(extname) {
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