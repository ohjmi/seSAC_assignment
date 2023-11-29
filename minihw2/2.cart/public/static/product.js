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
    fetch('/products')
        .then((response) => response.json())
        .then((products) => displayProduct(products))
});

function displayProduct(products) {
    // console.log(products);
    const productTableBody = document.querySelector('#productTable tbody');
    console.log(productTableBody);

    products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
            <button onclick="addToCart(${product.id})">담기</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// 버튼을 클릭하면 원하는 URI가 호출된다.
function addToCart(productId) {
    // console.log('addToCart', productId)
    fetch(`/add-to-cart/${productId}`, { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
            // alert(JSON.stringify(data.message))
            alert(data.message)
            fetch('/cart')
                .then((response) => response.json())
                .then((cart) => {
                    window.location.href = '/cart.html'
                })
        })
}
