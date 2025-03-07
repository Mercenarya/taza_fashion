
function sendemail(){
    const email_form = document.getElementById("send-email-form");
    const email_field = document.getElementById("email-field");
    email_form.addEventListener(
      'submit', function(event){
        event.preventDefault();
        fetch(
          '/send-email', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
  
            body: JSON.stringify(
              {
                email: email_field.value
              }
            )
          }
        )
        // xử lí phản hồi dữ liệu từ server
        .then(response => response.text())
        .then(data => {
            if (data.includes('email sent, We will give you an answer later')){
              alert(data);
            }
            else {
              alert(data);
            }
          }
        )
      }
    )
  
  }
  
window.onload = function(){
    sendemail();
}

// chức năng đăng xuất
function logout(){
    fetch("/logout",
      {
        // gửi yêu cầu đăng xuất
        method: "POST",
        headers:{
          'content-type':'application/json'
        }
      }
    )
    .then(response => response.text())
    .then(data =>
      {
        
        window.location.href = '/';
        
      }
    )
}