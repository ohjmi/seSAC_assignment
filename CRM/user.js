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
app.get('/userdetail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user_detail.html'));
});
app.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'store.html'));
});
app.get('/storedetail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'store_detail.html'));
});
app.get('/storeday', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'store_day.html'));
});
app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});
app.get('/item', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'item.html'));
});
app.get('/itemdetail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'item_detail.html'));
});
app.get('/orderitem', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'orderitem.html'));
});




app.get('/api/user', (req, res) => {
  const itemsPerPage = 50;
  let startIndex;
  let endIndex;

  // 검색어 및 성별 받아오기
  const searchName = req.query.search || '';
  const gender = req.query.gender || '';
  
  // 페이지 처리
  page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;

  // 기본 쿼리
  let query = 'SELECT * FROM users';

  // 성별이 선택된 경우에 WHERE 절에 추가
  if (gender !== '') {
    query += ` WHERE Gender = '${gender}'`;
  }

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 검색어와 성별을 포함하는 사용자만 필터링
      const filterData = rows.filter(user => 
        user.Name.toLowerCase().includes(searchName.toLowerCase()) && (gender === '' || user.Gender === gender)
      );

      // 전체 페이지 수 계산
      const totalPage = Math.ceil(filterData.length / itemsPerPage);

      // 읽은 데이터에서 무조건, 앞에 50개만 준다.
      const dataList = filterData.slice(startIndex, endIndex);

      res.json({
        users: dataList,
        totalPage: totalPage,
        currentPage: parseInt(page),
        searchName: searchName,
        gender: gender,
      });
    }
  });
});




app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // 첫 번째 쿼리를 Promise로 처리
    const getUser = () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.all(query, [userId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    // 두 번째 쿼리를 Promise로 처리
    const getOrder = () => {
      return new Promise((resolve, reject) => {
        const orderQuery = `
        SELECT o.Id AS orderid, o.OrderAt AS purchaseddate, s.Id AS purchasedlocation
        FROM users u JOIN stores s JOIN orders o
        ON o.UserId = u.Id AND o.StoreId = s.Id
        WHERE u.Id = ? GROUP BY strftime ('%Y-%m', o.OrderAt), u.Id
        `;
        db.all(orderQuery, [userId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    const bestStore = () => {
      return new Promise((resolve, reject) => {
        const bestStoreQuery = `
        SELECT s.Name AS storeName, COUNT(*) AS orderCount
        FROM users u JOIN stores s JOIN orders o 
        ON o.UserId = u.Id AND o.StoreId = s.Id
        WHERE u.Id = ? GROUP BY s.Id, s.Name
        ORDER BY orderCount DESC
        LIMIT 5;
        `;
        db.all(bestStoreQuery, [userId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    const bestItem = () => {
      return new Promise((resolve, reject) => {
        const bestItemQuery = `
        SELECT i.Name || ' ' || i.Type AS itemName, COUNT(*) AS orderCount
        FROM users u JOIN stores s JOIN orders o JOIN orderitems oi JOIN items i 
        ON o.StoreId = s.Id AND u.Id = o.UserId AND o.Id = oi.OrderId AND oi.ItemId = i.Id
        WHERE u.Id = ?
        GROUP BY i.Name, i.Type
        ORDER BY orderCount DESC
        LIMIT 5;
        `;
        db.all(bestItemQuery, [userId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    // 각각의 비동기 작업을 순차적으로 실행
    const user = await getUser();
    const order = await getOrder();
    const topStore = await bestStore();
    const topItem = await bestItem();
    console.log(topItem)

    res.json({
      user: user,
      order: order,
      topStore: topStore,
      topItem: topItem
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
