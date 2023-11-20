const express = require('express');

const app = express();
// const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

// app.use(express.json());

// 정적 파일 요청 시 제공할 폴더 설정
// 앞: URL, 뒤: 로컬 폴더명
app.use(express.static('public'));
app.use('/images', express.static('public/images')); // 미들웨어를 통해 여러 이미지를 가져올 수 있음 굳이 파일경로 해주지 않아도됨
app.use(bodyParser.json());

const users = {};

// 각종 라우트 셋업
// -- GET --
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'about.html'));
});
app.get('/user', (req, res) => {
    // res.type('text/plain');
    res.json(users);
});

// -- POST --
app.post('/user', (req, res) => {
    console.log(req.body);
    const id = Date.now();
    const {name} = req.body;
    // const name = req.body.name;
    users[id] = name;
    res.status(201).send('등록 성공');
});

// -- PUT --
app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    users[id] = req.body.name;
    res.status(200).send('수정 성공');
})

// -- DELETE --
app.delete('/user/:id', (req, res) => {
    try {
        // id는 어떻게 접근하는가?
        const id = req.params.id;
        // 로직 처리 (사용자 삭제)
        delete users[id];
        // 응답 보내기
        res.status(204).send();
        // res.status(200).send('삭제 완료');
    } catch (error) {
        console.log('삭제 중 오류 발생....', error);
        res.status(500).send('서버 내부 오류');
    }
});

app.listen(PORT, () => {
    console.log(`${PORT}가 열렸습니다.`);
});

