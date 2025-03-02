// khai báo các thưu viện cần hỗ trợ trong express js
const express = require('express');
const bordyparser = require('body-parser');
const mysql = require('mysql2');

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
// tạo đường dẫn static ở thư mục public 
app.use(express.static('public'));
app.use(express.static('src'));

app.use(bordyparser.json());
app.use(bordyparser.urlencoded({extended: true}));
// test đường dẫn 
app.get('/', (req, res) =>{
    res.redirect('/taza_login.html');
    // res.redirect('/public/taza_login.html');
});

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
                    res.send("log in successfully");
                }
                // nếu người dùng không tồn tại hoặc thông tin username,password bị nhập sai
                else{
                    res.send("wrong password or username");
                }
                
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
        res.redirect("/taza_home.html");
    }
)


// route chia mục products
app.get('/products', (req, res) =>
    {
        res.redirect('/taza_products.html');
    }

);






// tạo localhost chạy tại port 5000
app.listen(5000, () => {
    console.log('server is running on http://localhost:5000')
});


// req : Request - đưa yêu cầu đến server
// res : resposne - trả về yêu cầu từ người dùng như trả về 1 trang web nếu ng dùng đăng nhập thành công hoặc một thông báo