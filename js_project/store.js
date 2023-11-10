const fs = require('fs');


function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  console.log(generateID());


  const names = ['스타벅스', '이디야', '커피빈', '투썸플레이스', '파스쿠찌', '할리스', '폴바셋', '엔젤리너스', '탐앤탐스', '까페베네'];
  const branches = ['성북', '용산', '중랑', '노원', '광진', '강남', '은평', '종로', '동작', '서초'];

  function generateName() {
    const name = names[Math.floor(Math.random() * names.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const branchNum = Math.floor(Math.random() * 30) + 1;
    
    return `${name} ${branch}${branchNum}호점`;
  }
  console.log(generateName());



const cities = ['서울시', '부산시', '대구시', '인천시', '대전시', '광주시', '울산시', '강원도', '경기도', '경상도'];
const towns = ['성북구', '강북구', '성동구', '강남구', '동구', '서구', '북구', '부평구', '계양구', '연수구', '장안구', '분당구'];


function generateAddress() {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const town = towns[Math.floor(Math.random() * towns.length)];
  const street = Math.floor(Math.random() * 100) + 1;
  const street2 = Math.floor(Math.random() * 100) + 1;
  const streetTotal = Math.random() < 0.5 ? `${street}로` : `${street}길`;
  return `${city} ${town} ${streetTotal}${street2}`;

};
console.log(generateAddress());


storeArray = [];
for (let i = 0; i < 100; i++) {
  const type = generateName().split(' ')[0];
  const store = 
  
  {
    Id: generateID(),
    Name: generateName(),
    Type: type,
    Address: generateAddress()
    
  };
  storeArray.push(store);

}

console.log('--------------------------------');
console.log(storeArray);

function stringToCSV(array) {
  const header = Object.keys(array[0]).join(',') + '\n';
  const csv = array.map(obj => Object.values(obj).join(',')).join('\n');
  return header + csv;
}

function createCSVFile(data, storeData) {
  const csvData = stringToCSV(data);

  fs.writeFile(storeData, csvData, {encoding:'utf-8'}, (err)=> {
    if (err) {
      console.error(err);
      return;

    }
    console.log(`CSV파일 ${storeData}이 생성되었습니다.`);

  });

}
createCSVFile(storeArray, 'storeData.csv');

module.exports = storeArray;