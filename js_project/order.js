const fs = require('fs');
const userId = require('./user');
// const storeArray = require('./store');


// const userId = userArray.map(user => user.Id);
// console.log('-----------------------------------------------');

console.log(userId);

// const storeId = storeArray.map(store => store.Id);
// console.log('-----------------------------------------------');
// console.log(storeId);


// function generateID() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//       return v.toString(16);
//     });
//   }
// console.log(generateID());

// function generateOrder() {
//     const startTime = new Date(2023, 1, 1).getTime();
//     const endTime = new Date(2023, 12, 31).getTime();
//     const time = new Date(startTime + Math.random() * (endTime - startTime));
//     return time;
// }
// console.log(generateOrder());


// const orderArray = [];
// for (let i = 0; i < 10000; i++) {
    // const order = 
    // {
    //     Id: generateID(),
    //     OrderAt: generateOrder(),
    //     StoreId: storeId,
    //     UserId: userId

    // };
    // console.log(order);
// }