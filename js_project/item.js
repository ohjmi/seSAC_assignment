const fs = require('fs');


function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const itemObj = {
    '에스프레소 커피': ['커피', 3000],
    '아메리카노 커피': ['커피', 4000],
    '레몬에이드': ['에이드', 4500],
    '토마토 주스': ['주스', 5000],
    '뉴욕치즈 케이크': ['케이크', 5500],
    '요거생크림 케이크': ['케이크', 5500],
    '티라미수 케이크': ['케이크', 6000]
  };


function generateItem() {

  const itemNames = Object.keys(itemObj);
  const randomIndex = Math.floor(Math.random() * itemNames.length);
  const randomItemName = itemNames[randomIndex];
  const randomItemInfo = itemObj[randomItemName];

  const item =

  {
    Id: generateID(),
    Name: randomItemName,
    Type: randomItemInfo[0],
    UnitPrice: randomItemInfo[1]

  };
  return item;

}

const itemArray = [];
for (let i = 0; i < 20; i++) {
  itemArray.push(generateItem());
}
console.log(itemArray);

function stringToCSV(array) {
  const header = Object.keys(array[0]).join(',') + '\n';
  const csv = array.map(obj => Object.values(obj).join(',')).join('\n');
  return header + csv;
}

function createCSVFile(data, itemData) {
  const csvData = stringToCSV(data);

  fs.writeFile(itemData, csvData, {encoding:'utf-8'}, (err)=> {
    if (err) {
      console.error(err);
      return;

    }
    console.log(`CSV파일 ${itemData}이 생성되었습니다.`);

  });

}
createCSVFile(itemArray, 'itemData.csv');

