function button(num) {
   document.getElementById('show').value += num;
   console.log(num);
}
function calc() {
   let show = document.getElementById('show').value;
   let result = eval(show); 
   document.getElementById('show').value = result;
}

function reset() {
   document.getElementById('show').value = "";
}

