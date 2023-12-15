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


app.get('/api/store', (req, res) => {

  // console.log(req)
  const itemsPerPage = 50;
  let startIndex;
  let endIndex;

  console.log(`요청 GET 파라미터: ${req.query.page}`);

  // 검색어 받아오기
  const searchName = req.query.search || '';
  console.log('검색어:', searchName)

  // a태그의 하이퍼링크를 통해서 원하는 페이지로 이동한다.
  page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;

  const query = 'SELECT * FROM stores';
  console.log(query)
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 검색어를 포함하는 사용자만 필터링
      const filterData = rows.filter(user => user.Name.toLowerCase().includes(searchName.toLowerCase()));

      // 전체 페이지 수를 계산한다.
      const totalPage = Math.ceil(filterData.length / itemsPerPage);
      console.log(`전체 데이터 개수는 ${rows.length}이며,`,
                  `페이지당 개수는 ${itemsPerPage}이고`,
                  `전체 페이지 수는 ${totalPage}입니다.`);

      // 미션1. 읽은 데이터에서 무조건, 앞에 50개만 준다.
      const dataList = filterData.slice(startIndex, endIndex);

      res.json({
        stores: dataList,
        totalPage: totalPage,
        currentPage: parseInt(page),
        searchName: searchName,
      });
    }
  });
});


app.get('/api/store/:id', async (req, res) => {
  try {
    const storeId = req.params.id;
    // 첫 번째 쿼리를 Promise로 처리
    const getStore = () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM stores WHERE id = ?';
        db.all(query, [storeId], (err, rows) => {
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
    const getMonth = () => {
      return new Promise((resolve, reject) => {
        const monthQuery = `
          SELECT strftime ('%Y-%m', OrderAt) AS month,
          sum(UnitPrice) AS revenue,
          count(*) AS count
          FROM stores s
          JOIN items i JOIN orders o JOIN orderitems oi
          ON s.Id = o.StoreId AND i.Id = oi.itemId AND oi.OrderId = o.Id
          WHERE s.id = ?
          GROUP BY month;
        `;
        db.all(monthQuery, [storeId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };

    const bestUser = () => {
      return new Promise((resolve, reject) => {
        const bestQuery = `
        SELECT u.Id AS user_id, u.Name AS name, count(*) AS frequency
        FROM users u JOIN stores s JOIN orders o  
        ON  o.UserId = u.Id AND o.StoreId = s.Id
        WHERE s.Id = ? GROUP BY u.Id
        HAVING frequency >= 2
        `;
        db.all(bestQuery, [storeId], (err, rows) => {
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
    const store = await getStore();
    const month = await getMonth();
    const best = await bestUser();


    res.json({
      stores: store,
      month: month,
      best: best
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/store/:id/:month', async (req, res) => {
  console.log(req)
  try {
    const storeId = req.params.id;
    const monthId = `${req.params.month}%`;

    const getStore = () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM stores WHERE id = ?';
        db.all(query, [storeId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    const getDay = () => {
      return new Promise((resolve, reject) => {
        const dayQuery = `
        SELECT strftime ('%Y-%m-%d', OrderAt) AS month,
        sum(UnitPrice) AS revenue,
        count(*) AS count
        FROM stores s
        JOIN items i JOIN orders o JOIN orderitems oi
        ON s.Id = o.StoreId AND i.Id = oi.itemId AND oi.OrderId = o.Id
        WHERE s.id = ?  AND month LIke ?
        GROUP BY month
        `;
        db.all(dayQuery, [storeId, monthId], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };
    const getDayUser = () => {
      return new Promise((resolve, reject) => {
        const bestDayQuery = `
        SELECT u.Id AS user_id, u.Name AS name, count(*) AS frequency
        FROM users u JOIN stores s JOIN orders o  
        ON  o.UserId = u.Id AND o.StoreId = s.Id
        WHERE s.Id = ? AND strftime ('%Y-%m-%d', OrderAt) LIKE ? 
        GROUP BY u.Id
        `;
        db.all(bestDayQuery, [storeId, monthId], (err, rows) => {
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
    const store = await getStore();
    const day = await getDay();
    const dayUser = await getDayUser();

    console.log(day);
    console.log(dayUser);

    res.json({
      store: store,
      day: day,
      dayUser: dayUser
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/order', (req, res) => {

  const itemsPerPage = 500;
  let startIndex;
  let endIndex;


  // a태그의 하이퍼링크를 통해서 원하는 페이지로 이동한다.
  page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;

  const query = 'SELECT * FROM orders';
  console.log(query)
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 검색어를 포함하는 사용자만 필터링
      
      // 전체 페이지 수를 계산한다.
      const totalPage = Math.ceil(rows.length / itemsPerPage);
      console.log(`전체 데이터 개수는 ${rows.length}이며,`,
                  `페이지당 개수는 ${itemsPerPage}이고`,
                  `전체 페이지 수는 ${totalPage}입니다.`);

      // 미션1. 읽은 데이터에서 무조건, 앞에 50개만 준다.
      const dataList = rows.slice(startIndex, endIndex);

      res.json({
        users: dataList,
        totalPage: totalPage,
        currentPage: parseInt(page),
      });
    }
  });
});


app.get('/api/item', (req, res) => {

  // console.log(req)
  const itemsPerPage = 500;
  let startIndex;
  let endIndex;

  console.log(`요청 GET 파라미터: ${req.query.page}`);


  // a태그의 하이퍼링크를 통해서 원하는 페이지로 이동한다.
  page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;

  const query = 'SELECT * FROM items';
  console.log(query)
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {

      // 전체 페이지 수를 계산한다.
      const totalPage = Math.ceil(rows.length / itemsPerPage);
      console.log(`전체 데이터 개수는 ${rows.length}이며,`,
                  `페이지당 개수는 ${itemsPerPage}이고`,
                  `전체 페이지 수는 ${totalPage}입니다.`);

      // 미션1. 읽은 데이터에서 무조건, 앞에 50개만 준다.
      const dataList = rows.slice(startIndex, endIndex);

      res.json({
        items: dataList,
        totalPage: totalPage,
        currentPage: parseInt(page),
      });
    }
  });
});

app.get('/api/item/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    console.log(itemId)
    // 첫 번째 쿼리를 Promise로 처리
    const getItem = () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM items WHERE id = ?';
        db.all(query, [itemId], (err, rows) => {
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
    const getMonthItem = () => {
      return new Promise((resolve, reject) => {
        const monthItemQuery = `
        SELECT strftime('%Y-%m', o.OrderAt) AS month, 
        SUM(i.UnitPrice) AS totalRevenue,
        COUNT(*) AS count
        FROM users u JOIN orders o JOIN items i JOIN orderitems oi
        ON u.Id = o.UserId AND o.Id = oi.OrderId AND oi.ItemId = i.Id
        WHERE i.Id = ?
        GROUP BY strftime('%Y-%m', o.OrderAt), i.Name, i.Type
        ORDER BY month ASC
        `;
        db.all(monthItemQuery, [itemId], (err, rows) => {
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
    const item = await getItem();
    const monthItem = await getMonthItem();

    res.json({
      item: item,
      monthItem: monthItem,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/orderitem', (req, res) => {

  // console.log(req)
  const itemsPerPage = 2500;
  let startIndex;
  let endIndex;

  console.log(`요청 GET 파라미터: ${req.query.page}`);


  // a태그의 하이퍼링크를 통해서 원하는 페이지로 이동한다.
  page = req.query.page || 1;
  startIndex = (page - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;

  const query = 'SELECT * FROM orderitems';
  console.log(query)
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {

      // 전체 페이지 수를 계산한다.
      const totalPage = Math.ceil(rows.length / itemsPerPage);
      console.log(`전체 데이터 개수는 ${rows.length}이며,`,
                  `페이지당 개수는 ${itemsPerPage}이고`,
                  `전체 페이지 수는 ${totalPage}입니다.`);

      // 미션1. 읽은 데이터에서 무조건, 앞에 50개만 준다.
      const dataList = rows.slice(startIndex, endIndex);

      res.json({
        users: dataList,
        totalPage: totalPage,
        currentPage: parseInt(page),
      });
    }
  });
});


app.listen(port, () => {
  console.log(`서버 ${port} is ready.`)
})












