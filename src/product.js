async function products(){


    var head = document.createElement('head');
    var style = document.createElement('style');
    style.innerHTML = `
        .item {
            color:white;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px;
            display: inline-block;
            width: 200px;
            text-align: center;
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
                <h3>${item.name}</h3>
                <p>Giá: $${item.price}</p>
            </div>
            `
        ).join('');
        console.log(product);
    }
    catch(err){
        console.log(err);
        product_list.innerHTML = 'No products found !!!';
    }
}

products();

// document.addEventListener('DOMContentLoaded', products);