const fs = require('fs');


function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }



const firstname = ['오', '김', '이', '박', '최', '정', '강', '조', '윤', '장'];
const lastname = ['정미', '윤경', '재은', '선진', '성진', '철수', '영희', '미애', '영웅', '형섭', '수현', '석구'];



function generateName() {
    const first = firstname[Math.floor(Math.random() * firstname.length)];
    const last = lastname[Math.floor(Math.random() * lastname.length)];
    return `${first}${last}`;
};
const fullName = generateName();



function generateAge(year) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    return age;
}



function generateBirthdate() {
    const min = 1940;
    const max = 2010;
    const year = Math.floor(Math.random() * (max - min)) + min;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    
    return `${year}-${month}-${day}`;
};


function generateGender() {
    return Math.random() < 0.5 ? '여자':'남자';
}


const cities = ['서울시', '부산시', '대구시', '인천시', '대전시', '광주시', '울산시', '강원도', '경기도', '경상도'];
const towns = ['성북구', '강북구', '성동구', '강남구', '동구', '서구', '북구', '부평구', '계양구', '연수구', '장안구', '분당구'];


function generateAddress () {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const town = towns [Math.floor(Math.random() * towns.length)];
    const street = Math.floor(Math.random() * 100) + 1;
    const street2 = Math.floor(Math.random() * 100) + 1;
    const streetTotal = Math.random() < 0.5 ? `${street}로` : `${street}길`; 
    return `${city} ${town} ${streetTotal}${street2}`;

};



    function generateUser() {
    const birthdate = generateBirthdate(); 
    const year = parseInt(birthdate.split(' ')[0]); 
    const age = generateAge(year); 
    const user =
    {   
        Id: generateID(),
        Name: generateName(),
        Gender: generateGender(),
        Age: age,
        Birthdate: birthdate,
        Address: generateAddress()
    };
    return user;
}


  const userArray = [];
  for (let i = 0; i < 1000; i++) {
    userArray.push(generateUser());
  }

function stringToCSV(array) {
    const header = Object.keys(array[0]).join(',') + '\n';
    const csv = array.map(obj => Object.values(obj).join(',')).join('\n');
    return header + csv;
}

function createCSVFile(data, userData) {
    const csvData = stringToCSV(data);

    fs.writeFile(userData, csvData, {encoding:'utf-8'}, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(`CSV파일 ${userData}이 생성되었습니다.`);
    });
}
createCSVFile(userArray, 'userData2.csv');

module.exports =  { generateUser };