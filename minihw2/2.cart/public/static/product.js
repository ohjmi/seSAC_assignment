document.addEventListener('DOMContentLoaded', () => {
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
                    window.location.href = '/login.html'
                    // window.location.href = '/cart.html'
                })
        })
}
