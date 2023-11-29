document.addEventListener('DOMContentLoaded', () => {
    fetch('/check-login')   // 백엔드 구현: 사용자 세션 있으면 username 반납
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                console.log('사용자 이름:', data.username);
                document.getElementById('usernameSpan').innerText = data.username;
            } else {
                console.log('로그인된 사용자 없음');
                showLoginForm();
            }
        })
        .catch(error => {
            console.error('로그인 상태 확인 오류:', error);
            showLoginForm();
        })
    fetch('/cart')
        .then((response) => response.json())
        .then((cartData) => displayCart(cartData))

});

function displayCart(cartData) {
    const cartTableBody = document.querySelector('#cartTable tbody');
    const totalAmountElement = document.querySelector('#totalAmount');
    const emptyCartMessage = document.querySelector('#emptyCartMessage');

    cartTableBody.innerHTML = '';
    emptyCartMessage.style.display = 'none';

    if (cartData.length === 0) {
        emptyCartMessage.style.display = 'table-row'; // 테이블 행 표시
    }
    

    let totalAmount = 0;
    

    cartData.forEach((item) => {

        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}
            <button onclick='increaseQuantity(${item.id})'>+</button>
            <button onclick='decreaseQuantity(${item.id})'>-</button>
            </td>
            <td><button onclick='removeItem(${item.id})'>Remove</button></td>
        `;
        cartTableBody.appendChild(row);
        totalAmount += item.price * item.quantity;
    })
    totalAmountElement.textContent = `${totalAmount}`;
};

function increaseQuantity(productId) {
    fetch(`/update-quantity/${productId}/1`, { method: 'PUT' })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            fetch('/cart')
                .then((response) => response.json())
                .then((cart) => {
                    displayCart(cart);
                })
        })
}

function decreaseQuantity(productId) {
    fetch(`/update-quantity/${productId}/-1`, { method: 'PUT' })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            fetch('/cart')
                .then((response) => response.json())
                .then((cart) => {
                    displayCart(cart);
                })
        })
}
function removeItem(productId) {
    fetch(`/remove-from-cart/${productId}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then((cartData) => {
            console.log(cartData);
            fetch('/cart')
                .then((response) => response.json())
                .then((cartData) => {
                    displayCart(cartData);
                })
        })
}

