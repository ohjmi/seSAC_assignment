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
