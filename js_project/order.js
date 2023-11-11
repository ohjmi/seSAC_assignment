const fs = require('fs');

const userPath = './userData.csv';
const storePath = './storeData.csv';

fs.readFile(userPath, 'utf8', (err, userData) => {
    if (err) {
        console.error('파일 읽기 오류', err);
        return; 
    }

    const userLines = userData.split('\n');
    const userRecords = userLines.map(userLine => userLine.split(','));
    const userColumns = userRecords[0];
    const userIndex = userColumns.indexOf('Id');
    const userIdData = userRecords.slice(1).map(userRecord => userRecord[userIndex]);

    // console.log('id 추출 결과:', userIdData);
    // 다른 함수나 객체에 storeIdData 값을 전달 또는 사용하는 예시
    const userExport = (ids) => {
        // ids를 활용한 로직
        console.log('다른 함수에서 사용하는 예시:', ids);
    };

    // 함수 호출
    otherFunction(storeIdData);
});


fs.readFile(storePath, 'utf8', (err, storeData) => {
    if (err) {
        console.error('파일 읽기 오류', err);
        return; 
    }

    // CSV 파일을 줄 단위로 나누기
    const storeLines = storeData.split('\n');
    const storeRecords = storeLines.map(storeLine => storeLine.split(','));
    const storeColumns = storeRecords[0];
    const storeIndex = storeColumns.indexOf('Id');
    const storeIdData = storeRecords.slice(1).map(storeRecord => storeRecord[storeIndex]);

    // console.log('id 추출 결과:', storeIdData);
});

function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


function generateTime() {
    const startTime = new Date(2023, 1, 1).getTime();
    const endTime = new Date(2023, 12, 31).getTime();
    const time = new Date(startTime + Math.random() * (endTime - startTime));
    return time;
}


function generateOrder() {
    const order =
    {
        Id: generateID(),
        OrderAt: generateTime(),
        StoreId: storeIdData,
        UserId: userIdData

    };
    return order;
}
console.log(generateOrder());

// const orderArray = [];
// for (let i = 0; i < 10000; i++) {
//     orderArray.push(orderFunc());
// }


// function stringToCSV(array) {
//     const header = Object.keys(array[0]).join(',') + '\n';
//     const csv = array.map(obj => Object.values(obj).join(',')).join('\n');
//     return header + csv;
// }

// function createCSVFile(data, orderData) {
//     const csvData = stringToCSV(data);

//     fs.writeFile(orderData, csvData, {encoding:'utf-8'}, (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(`CSV파일 ${orderData}이 생성되었습니다.`);
//     });
// }
// createCSVFile(orderArray, 'orderData.csv');