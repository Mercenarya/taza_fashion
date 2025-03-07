// khai báo các thưu viện cần hỗ trợ trong express js
const express = require('express');
const bordyparser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

//Kết nối Database
var conn = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Minh_17102004',
        database: 'taza'
    }
);

//kiểm tra kết nối 
conn.connect(function(err, result)
    {
        if (err) {
            throw err;
        }
    }
)

conn.connect(function(err) {
    if (err) throw err;
    conn.query("SELECT * FROM user", function (err, result) {
      if (err) throw err;
      result.forEach(user => {
        console.log(user.username+" - "+user.password);
      })
    });
  });


// điều chỉnh chia route
const app = express();
// tạo đường dẫn static ở thư mục public và src
app.use(express.static('public'));
app.use(express.static('src'));
app.use(cors())
app.use(bordyparser.json());
// tạo kế thừa và lấy các thuộc tính cần cho xử lí logic bằng json
app.use(bordyparser.urlencoded({extended: true}));




app.get('/', (req, res) =>{
    res.redirect('/taza_login.html');
});

// tạo phiên người dùng 
app.use(session(
    {
        secret: 'thebois',
        resave: true,
        saveUninitialized: true
    }
))


// route đăng nhập mục login
// auth dùng để POST API từ người dùng nhập vào thông tin đăng nhập, phản hồi kết quả ở login.js
app.post('/auth', (req, res) =>
    {
        
        let username = req.body.username;
        let password = req.body.password;
        // lấy yêu cầu thông tin username và password từ người dùng
        console.log("Username:", username);
        console.log("Password:", password);
        // kiểm tra kết quả 

        // truy vấn để kiểm tra xem người dùng có tồn tại và cho ra các điều kiện
        conn.query('SELECT * FROM user WHERE username = ? AND password = ?',[username,password],
            (err, result) =>{
                // nếu truy vấn database có vấn đề hoặc bị lỗi
                if (err) {
                    res.send(err);
                }
                // nếu 2 yêu cầu nhập thông tin từ người dùng không có
                if (!username || !password) {
                    return res.send("Please fill your information");
                }
                // nếu thông tin người dùng chứa số lượng kí tự > 0 và tồn tại 
                if (result.length > 0){
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.send("log in successfully");
                }
                // nếu người dùng không tồn tại hoặc thông tin username,password bị nhập sai
                else{
                    res.send("wrong password or username");
                }
                res.end();
            }
        )
    }
);


// xử lí API từ đăng kí người dùng bằng middlewware regis
app.post('/regis', (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
    // kiểm tra API từ mục bod
    console.log(req.body)
    conn.query('INSERT INTO user (username,password,email,phone) VALUES (?, ?, ?, ?)',[username, password, email, phone],
        (err, result) => {
            // bắt ngoại lệ nếu thông tin người nhập đã tồn tại 
            try {
                if (err){
                    res.send("Invalid username, email or phone number");
                }
                else {
                    res.send('Registered successfully');
                    
                }
            }
            catch (err){
                res.send(err);
                // phản hồi lỗi về ứng dụng và giữ nguyên live server 
            }
        }
    )
    
});


// route mục register
app.get('/register', (req, res) =>
    {
        res.redirect('/taza_register.html');
    }
);

// route chia mục home
app.get('/home', (req, res) => 
    {
        if (req.session.loggedin){
            res.redirect("/taza_home.html");
        }
        else{
            res.send('Please login first');
            res.redirect('/taza_login.html');
            
        }
        
    }
)

// chức năng chuyển hướng đến services
app.get('/services',(req, res) =>
    {
        res.redirect('taza_service.html');
    }
)



// route chia mục products
app.get('/product', (req, res) =>
    {
        res.redirect('/taza_products.html');
    }
);

app.get('/products', (req, res) =>
    {
        conn.query('SELECT * FROM product',(err, result) =>
            {
                if (err){
                    throw err;
                }
                else{
                    res.status(200).json(result);
                }
                console.log(result);
            }
        )
    }
)

// gửi yêu cầu send email để lấy offer
app.post('/send-email', (req, res) =>
    {
        const email = req.body.email;
        console.log(email);
        conn.query('INSERT INTO email (email_field) VALUES (?)',[email],(err,result) =>
            {
                if(err){
                    throw err;
                }
                if (!email){
                    res.send("Email is Required");
                }
                else{
                    res.send("email sent, We will give you an answer later");
                }
            }
        )
    }
)

// kiểm tra tài khoản email trước khi off



app.get('/taza', (req, res) => 
    {
        res.redirect('/taza');
    }

)




app.post("/item", (req, res) => 
    {
        const name = req.body.name;
        console.log(name);
        conn.query("SELECT * FROM product WHERE name = ?",[name], (err, result) =>
            {
                if (err){
                    throw err;
                }
                if (result.length > 0){
                    res.send(`Product show off`);
                }
                else {
                    res.send("No product selected");
                }
            }
        )
    }
)




app.post('/outfit/:name', (req, res) => {
    // lấy phần tử name từ trong danh sách sản phẩm
    const name = req.params.name;
    // kiểm tra từ CSDL xem có thực thể nào trùng qua name
    conn.query('SELECT * FROM product WHERE name = ?',[name],
            (err, result) => {
                if(err){
                    throw err;
                }
                else{
                    res.json(
                        {
                            "name":result[0].name,
                            "price":result[0].price,
                            "description":result[0].description
                        }
                    );
                    // res.redirect("/taza_items.html");
                }
                
            }
        )
    }
)

app.get('/outfit/:name', (req, res) => {
        const filePath = path.join(__dirname, 'taza_items.html');
        const name = req.params.name;
        conn.query("SELECT * FROM product WHERE name = ?", [name], (err, result) => {
                if(err){
                    throw err;

                }
                else{
                    const product = result[0];
                    try {
                        res.send(
                            `
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <link rel="stylesheet" href="/static/items.css">
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    
                                <link rel="preconnect" href="https://fonts.googleapis.com">
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..800;1,200..800&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Gothic+A1&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    
                                
                                <link rel="preconnect" href="https://fonts.googleapis.com">
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                <link href="https://fonts.googleapis.com/css2?family=Bodoni+Mo
                                da:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Corm
                                orant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,3
                                0;1,400;1,500;1,600;1,700&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    
                                <link rel="preconnect" href="https://fonts.googleapis.com">
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6.
                                .96,400..900;1,6..96,400..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,
                                700;1,300;1,400;1,500;1,600;1,700&family=Raleway:ital,wght@0,100..900;1,10
                                0..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                                <link rel="preconnect" href="https://fonts.googleapis.com">
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>items</title>
                            </head>
                            <body>
                                <div class="topbar">
                                    <a href="/home">Home</a>
                                    <a href="/product">Product</a>
                                    <a href="/taza">Taza</a>
                                    <a href="/services">Service</a>
                                    <div class="searchbar">
                                        <input id="search-field" placeholder="outfit/models...">
                                        <button id="search-btn"><i class="fa fa-search"></i></button>
                                    </div>
                                    
                                    <div class="cart">
                                        <div class="cart-icon" onclick="toggleCart()">
                                            <i class="fas fa-shopping-cart"></i>
                                            <span id="cart-count">1</span>
                                        </div>
                                    </div>
                                    <div class="option">
                                        <div class="avt">
                                            <img src="images/avt.png" alt="">
                                        </div>
                                        <button id="option-selection">
                                            <i class="fa fa-gear"></i>
                                        </button>
                                        <div class="option-content">
                                            <a href="Profile">Profile</a>
                                            <a href="Settings">Settings</a>
                                            
                                            <a id="logout-btn" name="log-out" href="#" onclick="logout()">Logout</a>
                                            
                                        </div>
                                    </div>
                                </div>
    
                            <!-- hiển thị sản phẩm -->
                                <div class="item-container">
                                    <div class="item-img">
                                        <img id="image" src="${product.image_url}">
                                    </div>
                                    <div class="item-information">
                                        <h2 id="name">${product.name}</h2>
                                        <div id="price" class="price">${product.price}$</div>
                                        <div id="description" class="description">${product.description}</div>
                                        <div class="brands">brands</div><br>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span><br><br>
                                        <button id="add-to-cart">ADD TO CART</button>
                                    </div>
    
    
                                    <div class="image-selection">
                                        <div class="image1">
                                            <img src="" alt="">
                                        </div>
                                        <div class="image2">
                                            <img src="" alt="">
                                        </div>
                                        <div class="image3">
                                            <img src="" alt="">
                                        </div>
                                    </div>
                                </div>
    
                            <!-- hiển thị sản phẩm -->
    
                                <footer>
                                    <div class="newsletter">
                                        <h2>STAY UP TO DATE ABOUT<br>OUR LATEST OFFERS</h2>
                                        <form id="send-email-form" method="POST" action='/send-email'>
                                            <div class="subscribe-box">
                                                <input name="email" id="email-field" type="email" placeholder="Enter your email address">
                                                <button type="submit">Subscribe to Newsletter</button>
                                            </div>
                                        </form>
                                    </div>
    
                                    <div class="footer-content">
                                        <div class="footer-section company">
                                            <h3>SHOP.CO</h3>
                                            <p>We have clothes that suit your style and which you're proud to wear. From women<br>to men.</p>
                                            <div class="social-icons">
                                                <a href="#"><i class="fa fa-twitter"></i></a>
                                                <a href="#"><i class="fa fa-facebook"></i></a>
                                                <a href="#"><i class="fa fa-instagram"></i></a>
                                                <a href="#"><i class="fa fa-github"></i></a>
                                            </div>
                                        </div>
    
                                        
    
                                        <div class="footer-section links">
                                            <h3>COMPANY</h3>
                                            <ul>
                                                <li><a href="#">About</a></li>
                                                <li><a href="#">Features</a></li>
                                                <li><a href="#">Works</a></li>
                                                <li><a href="#">Career</a></li>
                                            </ul>
                                        </div>
    
                                        <div class="footer-section links">
                                            <h3>HELP</h3>
                                            <ul>
                                                <li><a href="#">Customer Support</a></li>
                                                <li><a href="#">Delivery Details</a></li>
                                                <li><a href="#">Terms & Conditions</a></li>
                                                <li><a href="#">Privacy Policy</a></li>
                                            </ul>
                                        </div>
    
                                        <div class="footer-section links">
                                            <h3>FAQ</h3>
                                            <ul>
                                                <li><a href="#">Account</a></li>
                                                <li><a href="#">Manage Deliveries</a></li>
                                                <li><a href="#">Orders</a></li>
                                                <li><a href="#">Payments</a></li>
                                            </ul>
                                        </div>
    
                                        <div class="footer-section links">
                                            <h3>RESOURCES</h3>
                                            <ul>
                                                <li><a href="#">Free eBooks</a></li>
                                                <li><a href="#">Development Tutorial</a></li>
                                                <li><a href="#">How to - Blog</a></li>
                                                <li><a href="#">Youtube Playlist</a></li>
                                            </ul>
                                        </div>
                                    </div>
    
                                    <div class="footer-bottom">
                                        <p>Shop.co © 2000-2023, All Rights Reserved</p>
                                        <div class="payment-icons">
                                            <img src="images/visa.png" alt="Visa">
                                            <img src="images/mastercard.png" alt="MasterCard">
                                            <img src="images/paypal.png" alt="PayPal">
                                            <img src="images/applepay.png" alt="Apple Pay">
                                            <img src="images/googlepay.png" alt="Google Pay">
                                        </div>
                                    </div>
                                </footer>
                                <script lang="text/javascript" src="items.js"></script>
                                    
                            </body>
                            </html>
                            `
                        )
                        // ghi nội dung vào file
                    }
                    catch (err){
                        res.send(err);
                    }
                    // bắt lỗi nhưng vẫn chạy được =)) ảo thế nhờ
                    
                }
            }
        )
    }
)


// mục thanh toán
app.get('/payment', (req, res) => {
        res.redirect('/taza_payment.html')
    }
)

app.get('/about', (req, res) => {
    res.redirect('/taza_about.html')
})

// đăng xuất tài khoản người dùng
app.post('/logout', 
    (req, res) =>
        {
            if (req.session){
                req.session.destroy((err) => {
                        if (err){
                            throw err;
                        }
                        else{
                            res.redirect('/');
                        }
                    }

                )
            }
            else {
                res.send("No session found")
            }
        }
)





app.get("/logout", (req, res)=> {
        res.send('You have logged out')
    }
)



// tạo localhost chạy tại port 5000
app.listen(5000, () => {
    console.log('server is running on http://localhost:5000');
});



// req : Request - đưa yêu cầu đến server
// res : resposne - trả về yêu cầu từ người dùng như trả về 1 trang web nếu ng dùng đăng nhập thành công hoặc một thông báo