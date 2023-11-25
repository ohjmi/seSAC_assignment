const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// 세션 미들웨어 설정
app.use(session({
    secret: 'my-important-secret-key', // 세션 데이터를 암호화 하기 위한 키
    resave: false, // 세션 데이터가 변경되지 않아도 다시 저장할지 여부
    saveUninitialized: true, // 초기화 되지 않은 세션을 저장소에 저장할지 여부
    cookie: {
        maxAge: 60000, // 1분
    }
}));

// 퍼블릭 폴더를 정적 파일 폴더로 설정
app.use('/static', express.static('public'));


// 배열(1차원 배열 1 = D-Array), 두개의 객체(object)를 담고 있음
const users = [
    {id: 1, username: 'user1', password: 'password1'},
    {id: 2, username: 'user2', password: 'password2'},
    {id: 3, username: 'user3', password: 'password3'},
    {id: 4, username: 'user4', password: 'password4'},
];


app.post('/login', (req, res) => {
    // const {id , pw} = req.body;
    const {username, password} = req.body;
    
    console.log(username, password);

    // 검색 기능
    const user = users.find((u) => u.username == username && 
    u.password === password);
    if (user) {
        console.log('로그인 성공');
        // 세션에 사용자 정보 저장
        req.session.user = user;
        res.json({message: '로그인 성공!'});
    } else {
        console.log('로그인 실패');
        res.status(401).json({message: '로그인 실패'});
    }
});

app.get('/profile', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({username: user.username, message: '프로필 정보'});
    } else {
        res.status(401).json({message: '로그인이 필요합니다.'});
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('세션 삭제 오류', err);
            res.status(500).json({message: '로그아웃 실패'});
        } else {
            res.json({message: '로그아웃 성공!'});
        }
    })
})

app.get('/check-login', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({ username: user.username});
    } else {
        res.status(401).json({ message: '인증되지 않은 사용자'});
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index3.html'));
});


app.listen(port, () => {
    console.log(`서버가 ${port}에서 대기중`);
});