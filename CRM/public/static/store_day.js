document.addEventListener('DOMContentLoaded', () => {
  fetchStoreMonthData();
});

function fetchStoreMonthData() {
  const idSearch = window.location.search;

  const monthValue = idSearch.split('&month=')
  console.log(monthValue[1])
  const idValue = monthValue[0].split('=');
  console.log(idValue[1])

  fetch(`/api/store/${idValue[1]}/${monthValue[1]}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
        // store에 대한 데이터 처리
        displayStore(data.store);
        displayDay(data.day);
        displayDayUser(data.dayUser);
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


function displayDay(getDay) {
  const dayTableBody = document.getElementById('dayTableBody');
  dayTableBody.innerHTML = '';

  getDay.forEach(day => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${day.month}</td>
      <td>${day.revenue}</td>
      <td>${day.count}</td>
    `;
    dayTableBody.appendChild(row);
  });
}


function displayDayUser(getDayUser) {
  const dayBestTableBody = document.getElementById('dayBestTableBody');
  dayBestTableBody.innerHTML = '';

  getDayUser.forEach(dayUser => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href='#'>${dayUser.user_id}</a></td>
      <td>${dayUser.name}</td>
      <td>${dayUser.frequency}</td>
    `;
    dayBestTableBody.appendChild(row);
  });
}
