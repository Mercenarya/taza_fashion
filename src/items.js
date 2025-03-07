function load_items(){
    document.addEventListener("DOMContentLoaded", function(){
        // lấy đường dẫn từ trang 
        const urlparameters = new URLSearchParams(window.location.search);
        // lấy thuộc tính name từ đường dẫn
        const productname = urlparameters.get('name');
        // Nếu lấy được tên sản phẩm từ thuộc tính name
        if(productname){
            fetch(`/outfit/${encodeURIComponent(productname)}`)
            .then(response => response.text())
            .then(data => {
 
                    // thêm dữ liệu vào các element được lấy từ data thông qua API
                    if (!data){
                        console.log('no items found');
                    }
                    else{
                        document.getElementById('name').innerText = data.name;
                        document.getElementById('price').innerText = data.price;
                        document.getElementById('description').innerText = data.description;
                        document.getElementById('image').src = data.image_url;
                    }
                    

            }).catch(err => {
                console.log(err);
            })
        }

    });
}

// Gửi email - request 
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

load_items();
