const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dbFile = 'crm.db';

// SQLite 데이터베이스 연결
const db = new sqlite3.Database(dbFile);
// Body 안에 있는 json 형식을 찾아 파싱해 req.body에 넣어줌
app.use(express.json())
// -D로 오는 키 밸류에 대해 req.body에 넣어줌
app.use(express.urlencoded({ extended: true }));


// 라우터 추가
app.use(express.static(path.join(__dirname, 'public')));



app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});



app.get('/api/user', (req, res) => {
  const query = 'SELECT * FROM users'; 

  // 모든 행에 대한 데이터를 한 번에 응답으로 보냄
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 검색어
      const searchName = req.query.search || '';
      
      // 페이징 처리
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 50;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // 검색된 데이터를 페이징에 맞게 자르기
      const filterData = rows.filter(user => user.Name.toLowerCase().includes(searchName.toLowerCase()));
      const dataList = filterData.slice(startIndex, endIndex);

      // 전체 페이지 수 계산
      const totalPage = Math.ceil(filterData.length / itemsPerPage);

      console.log(`전체 데이터 개수는 ${rows.length}이며,`,
                  `검색된 데이터 개수는 ${filterData.length}이며,`,
                  `페이지당 개수는 ${itemsPerPage}이고`,
                  `현재 페이지는 ${page}이며,`,
                  `전체 페이지 수는 ${totalPage}입니다.`);

      res.json({
        users: dataList,
        totalPage: totalPage,
        currentPage: page,
        index_id: 'Id',
        searchName: searchName,
      });
    }
  });
});



app.listen(port, () => {
  console.log(`서버 ${port} is ready.`)
})












// function readDataFromTable(tableName) {
//   const query = `SELECT * FROM ${tableName}`;

//   db.each(query, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       // 읽어온 각 행 데이터 활용
//       console.log(row);
//       return row;
//     }
//   });
// }

// 예시로 'user' 테이블을 읽어오는 경우


// // 예시로 'item' 테이블을 읽어오는 경우
// readDataFromTable('item');

// // 예시로 'order' 테이블을 읽어오는 경우
// readDataFromTable('order');
