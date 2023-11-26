// const exp = require('constants');
// const express = require('express');
// const session = require('express-session');
// const path = require('path');

// const app = express();
// const port = 3000;

// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// // req.body <------- 저 내용을 파싱해서 채워준다


// app.use(session({
//     secret: 'abcd1234',
//     resave: false,
//     saveUninitialized: true,
// }));

// app.use(express.static(path.join(__dirname, 'public')));
// // app.use('/static', express.static('public'));

// const products = [
//     {id: 1, name: 'Product1', price: 2000},
//     {id: 2, name: 'Product2', price: 3000},
//     {id: 3, name: 'Product3', price: 4000},
//     {id: 4, name: 'Product4', price: 5000},
// ];
// // 데이터 상품들을 보여주는 역할
// app.get('/products', (req, res) => {
//     console.log('상품정보요청');
//     res.json(products);
//     console.log('Session Info:', req.session);
// });

// // session storage에 있는 데이터들을 보여주는 역할
// app.get('/cart', (req, res) => {
//     const cart = req.session.cart || [];
//     console.log('Session Info:', req.session);
//     res.json(cart);
// });

// // 프론트에서 ID를 받아오면, 해당 ID에 해당하는 데이터를 정리함
// //session storage에 데이터를 저장하는 역할
// app.post('/add-to-cart/:productId', (req, res) => {
//     const productId = parseInt(req.params.productId);
//     const product = products.find((p) => {p.id === productId});
    
//     if (!product) {
//         return res.status(404).json({message: '상품을 찾을 수 없습니다.'});
//     }
    
//     const cart = req.session.cart || []; 
    
//     // 선택한 상품을 카트에 담기
//     cart.push({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//     });

//     // console.log(cart);
//     req.session.cart = cart;
//     res.json({ message: '상품이 장바구니에 추가되었습니다.', cart });
// });

// app.post('/update-quantity/:productsId', (req, res) => {
//     const productId = parseInt(req.params.productsId);
//     const change = parseInt(req.query.change);
//     const cart = req.session.cart;

//     const item = cart.find((i) => i.id === productId);

//     if (!item) {
//         return res.status(404).json({ message: '상품을 찾을 수 없습니다.'})
//     }
//     item.quantity = Math.max(1, item.quantity + validateHeaderValue);
// });

// app.post('remove-from-cart/:productId', (req, res) => {

// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'product.html'));
// });

// app.listen(port, () => {
//     console.log(`서버가 ${port} 열렸습니다.`);
// });

// function calculateTotalAmount(cart) {
//     let total = 0;
//     for (let i = 0; i < cart.length; i++) {
//         const item = cart[i];
//         total += item.price * item.quantity;
//     }
//     return total;
// }

// // function calculateTotalAmount2(cart) {
// //     return cart.reduce((total, item) => total + item.price * item.quantity, 0)
// // }

const exp = require('constants');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// req.body에 저 내용을 파싱해서 채워준다

app.use(session({
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'public')));



const products = [
    { id: 1, name: 'Product 1', quantity: 1, price: 2000 },
    { id: 2, name: 'Product 2', quantity: 1, price: 3000 },
    { id: 3, name: 'Product 3', quantity: 1, price: 1500 },
];

app.get('/products', (req, res) => {
    // console.log('상품정보요청')
    res.json(products);
    console.log('Session Info: ', req.session);
})

app.get('/cart', (req, res) => {
    // console.log(req.session)
    const cart = req.session.cart || [];
    console.log('Session Info: ', req.sessionStore.sessions);
    res.json(cart)
})

// 배열(1차원 배열 1 = D-Array), 두개의 객체(object)를 담고 있음
const users = [
    {id: 1, username: 'user1', password: 'password1'},
    {id: 2, username: 'user2', password: 'password2'}
];


app.post('/login', (req, res) => {
    // const {id , pw} = req.body;
    const {username, password} = req.body;
    
    console.log(username, password);

    // 검색 기능
    const user = users.find((u) => u.username == username && 
    u.password === password);
    if (user) {
        console.log('로그인 성공');
        res.json({message: '로그인 성공!'});
    } else {
        console.log('로그인 실패');
        res.status(401).json({message: '로그인 실패'});
    }
});

app.get('/profile', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({username: user.username, message: '프로필 정보'});
    } else {
        res.status(401).json({message: '로그인이 필요합니다.'});
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('세션 삭제 오류', err);
            res.status(500).json({message: '로그아웃 실패'});
        } else {
            res.json({message: '로그아웃 성공!'});
        }
    })
})

app.get('/check-login', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({ username: user.username});
    } else {
        res.status(401).json({ message: '인증되지 않은 사용자'});
    }
})


app.post('/add-to-cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);

    const product = products.find((p) => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다' })
    }

    const cart = req.session.cart || [];

     // 로그인이 되어 있지 않으면 에러 응답
     if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    // 선택한 상품을 카트에 담기
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
    })

    console.log(cart);
    req.session.cart = cart;
    res.json({ message: '상품이 장바구니에 추가되었습니다.', cart })
})

app.put('/update-quantity/:productId/:change', (req, res) => {
    const productId = parseInt(req.params.productId);
    const change = parseInt(req.params.change);
    const cart = req.session.cart;
    console.log(cart);
    console.log("change", change);
    const item = cart.find((i) => i.id === productId);

    if (!item) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다' })
    }

    item.quantity = Math.max(1, item.quantity + change);

    // 전체 카트의 총 가격 계산
    const totalAmount = calculateTotalAmount(cart);

    // 응답으로 업데이트된 카트와 전체 가격 전송
    console.log(totalAmount);
    req.session.cart = cart;
    res.json({cart, totalAmount});
})

app.delete('/remove-from-cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const cart = req.session.cart;

    const removeIndex = cart.findIndex(item => item.id === productId);
    if (removeIndex !== -1) {
        cart.splice(removeIndex, 1);
    }

    const totalAmount = calculateTotalAmount(cart);

    req.session.cart = cart;
    res.json({cart, totalAmount});

})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'))
})

app.listen(port, () => {
    console.log(`서버 ${port} is ready.`)
})


function calculateTotalAmount(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i]
        total += item.price * item.quantity;
    }
    return total;
}

// function calculateTotalAmount2(cart) {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0)
// }