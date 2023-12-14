document.addEventListener('DOMContentLoaded', () => {
  fetchItemData();
});

function fetchItemData() {
  const idSearch = window.location.search;
  const idValue = idSearch.split('=');
  console.log(idValue)

  fetch(`/api/item/${idValue[1]}`)
    .then(response => response.json())
    .then(data => {
      displayItem(data.item);
      displayItemMonth(data.monthItem); 
        
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}

function displayItem(items) {
  const itemTableBody = document.getElementById('itemTableBody');
  itemTableBody.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.Name}</td>
      <td>${item.UnitPrice}</td>
    `;
    itemTableBody.appendChild(row);
  });
}


function displayItemMonth(monthItems) {
  const itemMonthTableBody = document.getElementById('itemMonthBody');
  itemMonthTableBody.innerHTML = '';
  monthItems.forEach(monthItem => {
    console.log(monthItem)
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${monthItem.month}</td>
      <td>${monthItem.totalRevenue}</td>
      <td>${monthItem.count}</td>
    `;
    itemMonthTableBody.appendChild(row);
  });
}




const drawChart = (labels, barData, lineData) => {
  const ctx = document.getElementById('chart_wrap').getContext('2d');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: '총 수익',
          data: barData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          type: 'line',
          label: '주문 횟수',
          data: lineData,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'category',
          labels: labels,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// 데이터베이스에서 아이템에 대한 월별 정보를 가져옵니다.
getMonthItem(itemId)
  .then((rows) => {
    const labels = rows.map((row) => row.month);
    const totalRevenueData = rows.map((row) => row.totalRevenue);
    const orderCountData = rows.map((row) => row.count);

    // 차트를 그립니다.
    drawChart(labels, totalRevenueData, orderCountData);
  })
  .catch((error) => {
    console.error('데이터를 가져오는 중 오류 발생:', error);
  });
