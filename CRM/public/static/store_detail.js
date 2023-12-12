document.addEventListener('DOMContentLoaded', () => {
  fetchStoreData();
});

function fetchStoreData() {
  const idSearch = window.location.search;
  const idValue = idSearch.split('=');
  // console.log(idValue);

  fetch(`/api/store/${idValue[1]}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
        // store에 대한 데이터 처리
        displayStore(data.stores);
        displayMonth(data.month,idValue[1]);
        displayBest(data.best);
        // month에 대한 데이터 처리
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}

function displayStore(stores) {
  const storeTableBody = document.getElementById('storeTableBody');
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

function displayMonth(getMonth, id) {
  const monthTableBody = document.getElementById('monthTableBody');
  monthTableBody.innerHTML = '';

  getMonth.forEach(month => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href='/storeday?id=${id}&month=${month.month}'>${month.month}</a></td>
      <td>${month.revenue}</td>
      <td>${month.count}</td>
    `;
    monthTableBody.appendChild(row);
  });
}

function displayBest(bestUsers) {
  const bestTableBody = document.getElementById('bestTableBody');
  bestTableBody.innerHTML = '';

  bestUsers.forEach(bestUser => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href='#'>${bestUser.user_id}</a></td>
      <td>${bestUser.name}</td>
      <td>${bestUser.frequency}</td>
    `;
    bestTableBody.appendChild(row);
  });
}
