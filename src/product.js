// hiển thị sản phẩm - GET
var outfit_obj = {
  name:"",
  price:0,
  description:""
}

async function products(){
    var style = document.createElement('style');
    style.innerHTML = `
        .item {
            color:white;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px;
            display: inline-block;
            width: 300px;
            height: 500px;
            text-align: center;
        }
        
        .item img {
            height: 300px;
            width: 300px;
        }

        .item a {
            color: white;
            font-size: 20px;
            font-family: 'QuickSand', senrif;
        }

    `
    document.head.appendChild(style);
    const product_list = document.getElementById('products');
    try{
        const res = await fetch('/products');
        const product = await res.json();

        product_list.innerHTML = product.map(item => 
            `
            <div class="item">
                <img class="product-image" data-name="${item.name}" src="${item.image_url}">
                <h3 class="product-name" data-name="${item.name}">${item.name}</h3>
                <p class="product-price">Price: $${item.price}</p>
                <p class="product-description">${item.description}</p>
                <a class="see-all" data-name="${item.name}" href="#">See all</a>
            </div>
            `
        ).join('');
        console.log(product);

        document.querySelectorAll(".see-all").forEach(element => {
          element.addEventListener('click', function(event){
            event.preventDefault();
            const name = this.getAttribute('data-name');
            redirect_items(name);
            console.log(name);
          })
        });

        

    }
    catch(err){
        console.log(err);
        product_list.innerHTML = 'No products found !!!';
    }
}

products();


function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const cart = document.querySelector('.cart-container');
    if (cart.style.right === "0px") {
        cart.style.right = "-400px";
        setTimeout(() => overlay.style.display = 'none', 300);
    } else {
        overlay.style.display = 'block';
        setTimeout(() => cart.style.right = "0px", 10);
    }
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

// chuyển hướng tới items nếu như người dùng chọn vào 1 sản phẩm nào đó

function redirect_items(obj){
  window.location.href = `/outfit/${encodeURIComponent(obj)}`;
}