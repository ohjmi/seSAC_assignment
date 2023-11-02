// 검색한 번호 인덱스 값 출력
const numbers = [50, 67, 20, 30, 15];

function search(num) {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === num) {
            console.log("검색 숫자:"+num,"index:"+i);
            return;
        }
    }
    console.log("검색한 숫자를 찾지 못했습니다.");
}
console.log(search(15));


// 선언한 배열 내림차순 정렬
const max = numbers[0];
let temp = 0;
function sort(num) {
    for (let i = 0; i < num.length; i++) {
        for (let j = i; j < num.length; j++) {
            if(num[i] < num[j]) {
                temp = num[j]
            }
        }
    }

}

