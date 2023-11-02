const numbers = [50, 45, 30, 5, 3, 1];

let max = numbers[0];
function max_numbers(nums) {
    for(let i = 0; i < nums.length; i++) {
        // console.log(nums[i]);
        if(nums[i] > max) {
            max = nums[i];
            // console.log(max);
        }
    }
    return max;
}
max_num = max_numbers(numbers);
console.log(max_num);




let min = numbers[0]
function min_number(nums) {
    for(let i = 0; i < nums.length; i++) {
            if(nums[i] < min) {
                min = nums[i];
            }
        }
        return min;
    }
min_num = min_number(numbers);
console.log(min_num);




let evg = 0;
let sum = 0;
function evg_number(nums) {
    for(let i = 0; i < nums.length; i++) {
        sum+= nums[i];
    }
    evg = sum / nums.length;
    console.log(evg);

}
evg_number(numbers);