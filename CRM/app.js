const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const app = express();
const port = 3000;
const dbFile = 'crm.db';

// SQLite 데이터베이스 연결
const db = new sqlite3.Database(dbFile);
// Body 안에 있는 json 형식을 찾아 파싱해 req.body에 넣어줌
app.use(express.json())
// -D로 오는 키 밸류에 대해 req.body에 넣어줌
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));












app.get('/api/user', (req, res) => {

});

app.get('/api/store', (req, res) => {

});

app.get('/api/order', (req, res) => {

});

app.get('/api/item', (req, res) => {

});

app.get('/api/orderitem', (req, res) => {

});



function readDataFromDatabase() {
    const query = 'SELECT * FROM your_table'; // 적절한 테이블 이름을 사용하세요
  
    db.each(query,(err, row) => {
      if (err) {
        console.error(err.message);
      } else {
        // 읽어온 각 행 데이터 활용
        console.log(row);
      }
    });
  }
  