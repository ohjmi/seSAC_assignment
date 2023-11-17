const express = require('express');

const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;


const SUCCESS = 200;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;

app.use(express.static('public'));

app.get('/:filename', (req, res) => {
    const {filename} = req.params
    const htmlFilePath = path.join(__dirname, 'public', filename);
    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error('파일 전송 오류', err);
            res.status(500).send('서버 오류');
        }
    });
});




app.listen(port, () => {
    console.log(`${port}가 열렸습니다.`);
});

