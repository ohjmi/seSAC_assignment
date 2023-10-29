// function button(i) {
//    document.getElementById('show').value += i;
//    console.log(i);
// }

function button(num) {
   document.getElementById('show').value += num;
   console.log(num);
}
function calc() {
   let show = document.getElementById('show').value;
   let result = eval(show.value); 
   document.getElementById('result').value = result;
}
function clear() {
   document.getElementById('show').value = "";
   document.getElementById('result').value = "";
}