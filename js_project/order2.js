const fs = require('fs');
const { generateUser } = require('./user');
const { generateStore } = require('./store');


const userId = generateUser().Id;
const storeId = generateStore().Id;




function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


function generateOrder() {
    const startTime = new Date(2023, 1, 1).getTime();
    const endTime = new Date(2023, 12, 31).getTime();
    const time = new Date(startTime + Math.random() * (endTime - startTime));
    return time;
}


function orderFunc() {
    const order =
    {
        Id: generateID(),
        OrderAt: generateOrder(),
        StoreId: storeId,
        UserId: userId

    };
    return order;
}


const orderArray = [];
for (let i = 0; i < 10000; i++) {
    orderArray.push(orderFunc());
}


function stringToCSV(array) {
    const header = Object.keys(array[0]).join(',') + '\n';
    const csv = array.map(obj => Object.values(obj).join(',')).join('\n');
    return header + csv;
}

function createCSVFile(data, orderData) {
    const csvData = stringToCSV(data);

    fs.writeFile(orderData, csvData, {encoding:'utf-8'}, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`CSV파일 ${orderData}이 생성되었습니다.`);
    });
}
createCSVFile(orderArray, 'orderData.csv');