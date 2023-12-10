let currentPage = 1;
let totalPage = 1; // 초기값 설정

document.addEventListener('DOMContentLoaded', () => {
  fetchUserData();
  });
  
  function fetchUserData() {
    const idSearch = window.location.search;
    const idValue = idSearch.split('=');
    console.log(idValue[1]);
    fetch(`/api/user/${idValue[1]}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayUser(data.user);
      displayOrder(data.order);
      displayTopStore(data.topStore);

    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }
  
function pagination(currentPage, totalPage) {
  const pageNumbersContainer = document.getElementById('pageNumbersContainer');
  pageNumbersContainer.innerHTML = '';

  for (let i = 1; i <= totalPage; i++) {
    const pageNumberElement = document.createElement('a');
    pageNumberElement.textContent = i;
    pageNumberElement.className = 'page_number';

    // 현재 페이지일 때 클래스 추가
    if (i === currentPage) {
      console.log(currentPage)
      pageNumberElement.style.backgroundColor = 'palevioletred';
      pageNumberElement.style.border = '1px solid palevioletred';
      pageNumberElement.style.color = 'white';

    }

    pageNumberElement.addEventListener('click', () => goToPage(i));
    pageNumbersContainer.appendChild(pageNumberElement);
    
  }

  const prevButtonElement = document.getElementById('prevButton');
  prevButtonElement.style.display = currentPage === 1 || '' ? 'none' : 'block';

  const nextButtonElement = document.getElementById('nextButton');
  if (currentPage === totalPage || totalPage === 0 ) {
    nextButtonElement.style.display = 'none';
  } else {
    nextButtonElement.style.display = 'block';
  }

}

function prevButton() {
  if (currentPage > 1) {
    currentPage--;
    fetchUserData();
  }
}

function nextButton() {
  if (currentPage < totalPage) {
    currentPage++;
    fetchUserData();
  }
}

function goToPage(page) {
  currentPage = page;
  fetchUserData();
}


function displayUser(users) {
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = '';
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.Name}</td>
      <td>${user.Gender}</td>
      <td>${user.Age}</td>
      <td>${user.Birthdate}</td>
      <td>${user.Address}</td>
    `;
    userTableBody.appendChild(row);
  });
}

function displayOrder(orders) {
  const orderTableBody = document.getElementById('orderTableBody');
  orderTableBody.innerHTML = '';
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href='#'>${order.orderid}</a></td>
      <td>${order.purchaseddate}</td>
      <td><a href='#'>${order.purchasedlocation}</a></td>
    `;
    orderTableBody.appendChild(row);
  });
}

function displayTopStore(topStores) {
  const topStoreList = document.getElementById('topstore_wrap');
  topStoreList.innerHTML = '';
  topStores.forEach(topStore => {
    const row = document.createElement('ul');
    row.innerHTML = `
      <li>${topStore.storeName}(${topStore.orderCount}번 방문)</li>
    `;
    topStoreList.appendChild(row);
  });
}

