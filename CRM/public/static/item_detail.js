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

      // drawChart(
      //   data.map(item => item.month),       // labels
      //   data.map(item => item.totalRevenue), // barData
      //   data.map(item => item.count)         // lineData
      // );
      // const test = drawChart();
      // console.log('메롱메롱:',test);
        
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


// function displayItemMonth(monthItems) {
//   const itemMonthTableBody = document.getElementById('itemMonthBody');
//   itemMonthTableBody.innerHTML = '';
//   monthItems.forEach(monthItem => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>${monthItem.month}</td>
//       <td>${monthItem.totalRevenue}</td>
//       <td>${monthItem.count}</td>
//     `;
//     itemMonthTableBody.appendChild(row);
//     drawChart(monthItem.month, monthItem.totalRevenue, monthItem.count);
//   });
// }
function displayItemMonth(monthItems) {
  const itemMonthTableBody = document.getElementById('itemMonthBody');
  itemMonthTableBody.innerHTML = '';

  // 배열을 초기화합니다.
  const chartData = {
    labels: [],
    barData: [],
    lineData: [],
  };

  monthItems.forEach(monthItem => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${monthItem.month}</td>
      <td>${monthItem.totalRevenue}</td>
      <td>${monthItem.count}</td>
    `;
    itemMonthTableBody.appendChild(row);

    // 각 월의 데이터를 차트 데이터에 추가
    chartData.labels.push(monthItem.month);
    chartData.barData.push(monthItem.totalRevenue);
    chartData.lineData.push(monthItem.count);
  });

  // 전체 데이터를 한 번에 차트에 전달
  drawChart(chartData.labels, chartData.barData, chartData.lineData);

}


// drawChart = (labels, barData, lineData) => {
//   const ctx = document.getElementById('chart_wrap').getContext('2d');

// var cc = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           type: 'bar',
//           label: '총 수익',
//           data: barData,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//         },
//         {
//           type: 'line',
//           label: '주문 횟수',
//           data: lineData,
//           borderColor: 'rgba(255, 99, 132, 1)',
//           borderWidth: 1,
//           fill: false,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         x: {
//           type: 'category',
//           labels: labels,
//         },
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// };

// drawChart([],[],[]);

// 차트를 생성하고 업데이트하는 함수
function drawChart(labels, barData, lineData) {
  console.log(lineData);
  // 이전 차트 인스턴스를 확인하고 제거
  if (window.myChart) {
    window.myChart.destroy();
  }

  const ctx = document.getElementById('chart_wrap').getContext('2d');

  // 새로운 차트 인스턴스 생성
  window.myChart = new Chart(ctx, {
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
}