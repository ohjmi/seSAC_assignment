document.addEventListener('DOMContentLoaded', () => {
  fetchStoreData();
  });
  
  function fetchStoreData() {
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
      displayDay(data.day);
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
    <td><a href='#' onclick='showDayTable("${month.month}");'>${month.month}</a></td>
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

function showDayTable(selectedMonth) {
  // displayMonth 테이블을 숨깁니다.
  console.log(selectedMonth);
  document.getElementById('monthTable').style.display = 'none';

  // dayTable을 보이게 합니다.
  document.getElementById('dayTable').style.display = 'block';

  // 선택된 월 데이터로 displayDay 함수를 호출합니다.
  fetch(`/api/store/${selectedMonth}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // displayDay 함수 호출로 dayTable을 채웁니다.
      displayDay(data.day);
    })
    .catch(error => {
      console.error('Error fetching day data:', error);
    });
}



// function showDayTable(selectedMonth) {
//   // displayMonth 테이블을 숨깁니다.
//   document.getElementById('monthTable').style.display = 'none';

//   // dayTable을 보이게 합니다.
//   document.getElementById('dayTable').style.display = 'block';

//   // 선택된 월 데이터로 displayDay 함수를 호출합니다.
//   const fetchPromise = fetch(`/api/store/${selectedMonth}`);

//   // 확인: fetchPromise가 정의되어 있고 then 메서드를 가지고 있는지 확인
//   if (fetchPromise && typeof fetchPromise.then === 'function') {
//     fetchPromise
//       .then(response => response.json())
//       .then(data => {
//         // displayDay 함수 호출로 dayTable을 채웁니다.
//         displayDay(data.day);
//       })
//       .catch(error => {
//         console.error('Error fetching day data:', error);
//       });
//   } else {
//     console.error('Fetch promise is undefined or does not have a then method');
//   }
// }
