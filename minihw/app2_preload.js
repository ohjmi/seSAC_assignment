const express = require('express');
const nunjucks = require('nunjucks');
const fs = require('fs');
// const csv = require('csv-parser'); //선택사항
const csv = require('fast-csv'); // 선택사항



const app = express();
const port = 3000;

// 눈적스 초기화
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

// 성능 측정 미들웨어
app.use((req, res, next) => {
    const start = Date.now();

    // 나중에 동작할 리스너(listener)를 등록
    res.on('finish', () => {
        const end = Date.now();
        const duration = end - start;

        console.log(`요청 ${req.path}에서 응답까지는 ${duration}ms 소요됩니다.`);
    });
    next();
});

// 데이터를 담을 배열
const data = [];
const fieldnames = [];

// 데이터 로딩

function loadDataIntoMemory() {
    
    return new Promise((resolve, reject) => {
        // 파일 읽기 코드

            fs.createReadStream('./userData.csv', { encoding: 'utf8' })
            .pipe(csv.parse({ headers: true, trim: true })) // 미션2. csv-parser들에 이런 기능은 없나?
            .on('headers', (headers) => {
                fieldnames.push(...headers);
            })
            .on('data', (row) => {
                // 미션3. 공백이 들어간 것을 삭제하는 코드를 여기서 구현한다.
                data.push(row);
            })
            .on('end', () => {
                console.log('파일 다 읽었음');
                resolve();
            })
            .on('error', (error) => {
                console.log('파일 읽기 오류', error);
            });
        });
    }
    
// 우리 서버의 시작
async function startServer() {
    await loadDataIntoMemory();
    app.get('/', (req, res) => {
        const itemsPerPage = 50;
        let startIndex;
        let endIndex;

        console.log(`요청 GET 파라미터: ${req.query.page}`);

        // 검색어 받아오기
        const searchName = req.query.search || '';

        // 미션3. 이제 a태그의 하이퍼링크를 톨해서 원하는 페이지로 이동한다.
        page = req.query.page || 1;
        startIndex = (page - 1) * itemsPerPage;
        endIndex = startIndex + itemsPerPage;

        // 검색어를 포함하는 사용자만 필터링
        const filterData = data.filter(user => user.Name.toLowerCase().includes(searchName.toLowerCase()));

        // 미션2. 전체 페이지 수를 계산한다.
        // 그 페이지 숫자를 html로 전달해서 화면 아래에 추가한다.
        const totalPage = Math.ceil(filterData.length / itemsPerPage);
        console.log(`전체 데이터 개수는 ${data.length}이며,`,
                    `페이지당 개수는 ${itemsPerPage}이고`,
                    `전체 페이지 수는 ${totalPage}입니다.`);
        // console.log(data);

        // 미션1. 읽은 데이터에서 무조건, 앞에 10개만 준다.
        // const dataList = data.slice(startIndex, endIndex);
        const dataList = filterData.slice(startIndex, endIndex);

        res.render('index2', { 
            headers: fieldnames, 
            data: dataList,
            totalPage: totalPage, 
            page: parseInt(page),
            index_id: 'Id',
            searchName: searchName,
        });
    });

    app.get('/user/:id', (req, res) => {
        const userId = req.params.id;
        const user = data.find(item => item.Id === userId);;

        if (!user) {
            // 사용자를 찾지 못한 경우 처리
            res.status(404).send('사용자를 찾을 수 없습니다.');
            return;
        }
    
        // 사용자 데이터로 사용자 상세 페이지 렌더링
        res.render('userdetail', { 
            user : user,
            headers: fieldnames,
        });
    });



    app.listen(port, () => {
        console.log(`서버에 ${port} 가 열려있습니다.`);
    });
}

startServer();