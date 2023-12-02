// document.addEventListener('DOMContentLoaded', () => {
//     fetch('/api/user')
//         .then((response) => response.json())
//         .then((userData) => displayUser(userData))
// });

// function displayUser(userData) {

//     const userTableBody = document.getElementById('userTable');
//     userData.forEach(user => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//         <td>${user.Id}</td>
//         <td>${user.Name}</td>
//         <td>${user.Gender}</td>
//         <td>${user.Age}</td>
//         <td>${user.Birthdate}</td>
//         <td>${user.Address}</td>
//       `;
//         userTableBody.appendChild(row);
//     });
// }



document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => {
        // data.users가 배열이므로 forEach를 사용할 수 있습니다.
        console.log(data.users);
        displayUser(data.users);
        updatePaginationInfo(data.currentPage);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  });


  const userTableBody = document.getElementById('userTable');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const currentPageElement = document.getElementById('currentPage');
  const pageNumbersContainer = document.getElementById('pageNumbersContainer');

  let currentPage = 1;

  // 페이지 갱신 함수
  function updatePage() {
    fetch(`/api/user?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        displayUser(data.users);
        updatePaginationInfo(data.currentPage, data.totalPage);
      });
  }

  // 페이지 정보 갱신 함수
  function updatePaginationInfo(currentPage, totalPage) {
    currentPageElement.textContent = `Page ${currentPage}`;
    updatePageNumbers(totalPage);
  }

  // 페이지 번호 갱신 함수
  function updatePageNumbers(totalPage) {
    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPage; i++) {
      const pageNumberElement = document.createElement('span');
      pageNumberElement.textContent = i;
      pageNumberElement.className = 'page-number';
      pageNumberElement.addEventListener('click', () => goToPage(i));
      pageNumbersContainer.appendChild(pageNumberElement);
    }
  }

  // 이전 페이지로 이동 함수
  function goToPrevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  // 다음 페이지로 이동 함수
  function goToNextPage() {
    currentPage++;
    updatePage();
  }

  // 특정 페이지로 이동 함수
  function goToPage(page) {
    currentPage = page;
    updatePage();
  }

  // 페이징 버튼 이벤트 핸들러 등록
  prevButton.addEventListener('click', goToPrevPage);
  nextButton.addEventListener('click', goToNextPage);

  // 초기 페이지 로딩
  updatePage();

  
function displayUser(users) {

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.Id}</td>
        <td>${user.Name}</td>
        <td>${user.Gender}</td>
        <td>${user.Age}</td>
        <td>${user.Birthdate}</td>
        <td>${user.Address}</td>
      `;
        userTableBody.appendChild(row);
    });
}

