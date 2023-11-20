const express = require('express');
const nunjucks = require('nunjucks');
const fs = require('fs');
// const csv = require('csv-parser'); //선택사항

const app = express();
const port = 3000;

// 눈적스 초기화
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.get('/', (req, res) => {
    // 데이터를 담을 배열
    const data = [];

    // 파일 읽기 코드
    fs.readFile('./userData.csv', { encoding: 'utf8' }, (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('파일을 읽는 도중 오류가 발생했습니다');
        }

        const lines = fileData.split('\n');
        lines.forEach((line) => {
            const columns = line.split(',');
            data.push(columns);
        });

        // console.log(data);
        res.render('index', { data });
    });
});


app.listen(port, () => {
    console.log(`서버${port} 레디`);
});