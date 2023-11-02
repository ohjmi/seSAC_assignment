const fs = require('fs');
const testFolder = '../seSAC_homework'

fs.readdir(testFolder, (err, fileList) => {
    if(err) {
        console.error("파일 목록을 출력하지 못했습니다.", err);
        return;
    }
    console.log("파일 목록:",fileList);
});