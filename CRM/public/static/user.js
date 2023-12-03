document.addEventListener('DOMContentLoaded', () => {
  const pageNumbersContainer = document.getElementById('pageNumbersContainer');
  let currentPage = 1;

  // 페이지 갱신 함수
  function updatePage(page = currentPage, searchName = '') {
    fetch(`/api/user?page=${page}&search=${searchName}`)
      .then(response => response.json())
      .then(data => {
        displayUser(data.users);
        updatePaginationInfo(data.currentPage, data.totalPage);

      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  // 페이지 정보 갱신 함수
  function updatePaginationInfo(currentPage, totalPage) {
    updatePageNumbers(totalPage);
    updateButtonsVisibility(currentPage, totalPage);
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
  window.prevButton = function () {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  };

  // 다음 페이지로 이동 함수
  window.nextButton = function () {
    currentPage++;
    updatePage();
  };

  // 특정 페이지로 이동 함수
  function goToPage(page) {
    currentPage = page;
    updatePage();
  }

  // 검색 버튼 클릭 시 이벤트 처리
  window.searchButton= function () {
    const searchValue = document.getElementById('searchInput').value.trim();
    updatePage(1, searchValue);
}


  // 초기 페이지 로딩
  updatePage();

  // 필요에 따라서 displayUser 함수 구현
  function displayUser(users) {
    const userTableBody = document.getElementById('userTable');
    userTableBody.innerHTML = '';

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

  // 이전 페이지, 다음 페이지 버튼의 표시 여부 갱신 함수
  function updateButtonsVisibility(currentPage, totalPage) {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    prevButton.style.display = currentPage === 1 ? 'none' : 'block';
    nextButton.style.display = currentPage === totalPage ? 'none' : 'block';
  }
});
