const username = document.getElementById('username');
const password = document.getElementById('password');
// const repeatpasswd = document.getElementById();
const email = document.getElementById('email');
const phone = document.getElementById('phone');

const form = document.getElementById('register-form');
// bắt sự kiện từ người dùng khi tương tác với trang
form.addEventListener(
    'submit', function(event){
        event.preventDefault();
        // lấy API từ regis 
        fetch(
            '/regis',{
                method: 'POST',
                headers:{
                    'content-type':'application/json'
                },
                // lấy dữ liệu từ thông tin vừa nhập sang dạng JSON để xử lí logic dữ liệu ở server
                body: JSON.stringify(
                    {
                        username: username.value,
                        password: password.value,
                        email: email.value,
                        phone: phone.value
                    }
                )
            }
        ).then(response => response.text())
        // xử lí dữ liệu từ server sau khi fetch
        .then(data => {
            // nếu như dữ liệu là đăng kí thành công
            if (data.includes('Registered successfully')){
                window.location.href = '/';
            }
            else{
                // lấy dữ liệu từ server
                // đưa ra mục cảnh báo trên đầu trang
                alert(data);
            }
        })
    }
);




function redirect_to_login(){
    const btn = document.getElementsByTagName("a");
    if (btn){
        // btn.addEventListener("click", () => {
        window.location.href = "/taza_login.html";
        console.log("login page");
        // })
    }
    else{
        console.log("no elements detected");
    }
}

