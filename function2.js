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


// 선생님이 알려주신 방법
const array = Array.from({length:10}, () => Math.floor(Math.random() * 1000));

// 이 함수는 배열을 받아서, 찾고자 하는 인덱스가 몇 번째 있는지를 반환합니다.
// 인덱스와 출발은 1부터 출발합니다. 
function linearSearch(arr, target) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i+1; // 찾는 요소의 인덱스 반환
        }
    }
    return -1; // 요소를 찾지 못한 경우 -1을 반환
}

console.log(array);
console.log('linearSearch');
console.log(linearSearch(array,5));
console.timeEnd('linearSearch');



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

