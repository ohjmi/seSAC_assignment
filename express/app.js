const express = require('express');

const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

app.use(express.json());


app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // 204 No Content를 반환하여 응답을 종료
});

const users = {};



// Read (GET): 사용자 목록 조회
app.get('/user', (req, res) => {
    res.json(users);
});

// Create (POST): 새로운 사용자 등록
app.post('/user', (req, res) => {
    console.log('요청 온 내용은??', req.body);
    const formData = req.body;
    console.log('파싱한 후??', formData);
    const username = formData.name;
    console.log('사용자 이름은??', username);
    const id = Date.now();
    users[id] = username;
    console.log('최종 객체:', users)

    res.status(201).send('등록 성공');
});

// Update (PUT): 사용자 정보 수정
app.put('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const newName = req.body.name;
    if (users.hasOwnProperty(userId)) {
        users[userId] = newName;
        res.send('수정 성공');
    } else {
        res.status(404).send('사용자가 존재하지 않습니다.');
    }
});


// Delete (DELETE): 사용자 삭제
app.delete('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    if (users.hasOwnProperty(userId)) {
        delete users[userId];
        res.send('삭제 성공');
    } else {
        res.status(404).send('사용자가 존재하지 않습니다.');
    }
});

app.get('/:filename', (req, res) => {
    const { filename } = req.params
    const htmlFilePath = path.join(__dirname, 'public', `${filename}.html`);
    console.log(htmlFilePath);
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

