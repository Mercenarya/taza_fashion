// lấy id từ các trường thuộc tính cần xử lí của trang đăng nhập
const form = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");

// bắt sự kiện từ form của giao diện
form.addEventListener(
    'submit', function(event){
        event.preventDefault();
        
        fetch(
            '/auth', {
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                // lấy dữ liệu từ thông tin vừa nhập sang dạng JSON để xử lí logic dữ liệu ở server
                body: JSON.stringify(
                    {
                        username: username.value,
                        password:password.value
                    }
                )
            }
        )
        .then(response => response.text())
        .then(data => {
            if (data.includes('log in successfully')){
                window.location.href = '/home';
            }
            else{
                alert(data);
            }
        })
        .catch(
            err => {
                console.log(err);
            }
        )
    }
);

// chuyển tới trang đăng kí tài khoản
function redirect_register(){
    const redirect_btn = document.getElementById("register-rdt")
    if (redirect_btn){
        // redirect_btn.addEventListener("click", () => {
            window.location.href = 'taza_register.html';
            console.log("Redirect to register");
        // })
    }
    else{
        console.log("no events added yet.")
    }
}
