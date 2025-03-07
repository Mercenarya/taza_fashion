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

// chức năng của giỏ hàng
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

