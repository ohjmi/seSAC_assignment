let currentPage = 1;
let totalPage = 1; // 초기값 설정

document.addEventListener('DOMContentLoaded', () => {
  fetchUserData();
  });
  
  function fetchUserData() {
    const idSearch = window.location.search;
    const idValue = idSearch.split('=');
    console.log(idValue[1]);
    fetch(`/api/store/${idValue[1]}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      displayStore(data.stores);
      displayMonth(data.month);
      displayBest(data.best);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }
  

function displayStore(stores) {
  const storeTableBody = document.getElementById('storeTable');
  storeTableBody.innerHTML = '';

  stores.forEach(store => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${store.Name}</td>
      <td>${store.Type}</td>
      <td>${store.Address}</td>
    `;
    storeTableBody.appendChild(row);
  });
}


function displayMonth(getMonth) {
  const monthTableBody = document.getElementById('monthTable');
  monthTableBody.innerHTML = '';

  getMonth.forEach(month => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href=#>${month.month}</a></td>
      <td>${month.revenue}</td>
      <td>${month.count}</td>
    `;
    monthTableBody.appendChild(row);
  });
}


function displayBest(bestUsers) {
  const bestTableBody = document.getElementById('bestTable');
  bestTableBody.innerHTML = '';

  bestUsers.forEach(bestUser => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href=#>${bestUser.user_id}</a></td>
      <td>${bestUser.name}</td>
      <td>${bestUser.frequency}</td>
    `;
    bestTableBody.appendChild(row);
  });
}

function displayDay(getDay) {
  const dayTableBody = document.getElementById('dayTable');
  monthTableBody.innerHTML = '';

  getday.forEach(day => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${day.month}</td>
      <td>${day.revenue}</td>
      <td>${day.count}</td>
    `;
    dayTableBody.appendChild(row);
  });
}