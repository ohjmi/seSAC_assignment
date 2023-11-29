function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(('/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        // .then(response => response.json())
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('로그인 실패')
            }
        })
        .then(data => {
            console.log(data.message);
            alert(data.message);
            checkLoginStatus();
        }).catch(error => {
            console.log('로그인 실패: ', error);
            alert('로그인 실패')
        })
}

function logout() {
    fetch('/logout')
        .then(response => response.json())
        .then(data => {
        alert(data.message);
        showLoginForm();
        })
}


function checkLoginStatus() {
    fetch('/check-login')   // 백엔드 구현: 사용자 세션 있으면 username 반납
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                // console.log('사용자 이름:', data.username);
                showProfile(data.username);
            } else {
                // console.log('로그인된 사용자 없음');
                showLoginForm();
            }
        })
        .catch(error => {
            console.error('로그인 상태 확인 오류:', error);
            showLoginForm();
        })
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

// function showProfile(username) {
//     document.getElementById('loginFormContainer').style.display = 'none';
//     document.querySelectorAll('.profile').style.display = 'block';
//     document.getElementById('usernameSpan').innerText = username;
// }

// function showLoginForm() {
//     document.getElementById('loginFormContainer').style.display = 'block';
//     document.querySelectorAll('.profile').style.display = 'none';
// }
function showProfile(username) {
    const profileElements = document.querySelectorAll('.profile');

    profileElements.forEach(profileElement => {
        profileElement.style.display = 'block';
        document.getElementById('usernameSpan').innerText = username;
        document.getElementById('loginFormContainer').style.display = 'none';
    });
}

function showLoginForm() {
    const profileElements = document.querySelectorAll('.profile');

    profileElements.forEach(profileElement => {
        profileElement.style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
    });
}