
// Set up Object
function FashionModels(image,name,type,info,price,note) {
  this.image = image
  this.name = name;
  this.type = type;
  this.info = info;
  this.price = price;
  this.note = note;
}



// Car models and brands
let cortune = new FashionModels(
    "https://i.pinimg.com/474x/52/f6/a1/52f6a1b8d5471ef19e794c89f629a041.jpg",
    "Versace","Cortune Golden Satin Dresses","Dress",
    4500000,"update version of this year"
)

let siviar = new FashionModels(
    "https://cdn.storims.com/api/v2/image/resize?path=https://storage.googleapis.com/storims_cdn/storims/uploads/8568cf1db40c5b315e6eea5766bf0c13.jpeg&format=jpeg",
    "Bỉght Crystal","Siviar Bright Crystal","Perfume",
    1500000,"update version of this year"
)

let palamor = new FashionModels(
    "https://assets.vogue.com/photos/55c6518308298d8be222f94c/master/w_2560%2Cc_limit/00030m.jpg",
    "Palampor","Plamor Aste","Outfit",3500000,"update this year"
)

let bavier = new FashionModels(
    "https://assets.vogue.com/photos/55c6516308298d8be220b0db/master/w_2560%2Cc_limit/00050m.jpg",
    "Bavier Versace","Versace","vest",4000000,"update this year"
)

let javeira = new FashionModels(
    "https://rawganique.com/cdn/shop/products/vest-fleece-20181025_DSC3834-2_1024x1024.jpg?v=1684633089",
    "Javeira","Javeira Cotton veste","Cotton vest",1300000,"update this year"
)

let eros = new FashionModels(
  "https://nuochoarosa.com/wp-content/uploads/2024/11/Versace-Eros-Eau-De-Parfum-Gift-Set-3-e1732717891168.jpg",
  "Eros Perfume","Eros De Perfum","Perfume",2700000,"update this year"
)

let metalmesh = new FashionModels(
  "https://di2ponv0v5otw.cloudfront.net/posts/2023/03/26/642097cc5d686be78c09c095/s_wp_642097f7bd66cd0c09234721.webp",
  "Metal Mesh","Versace Metal Mesh","Dress",3400000,"update in spring"
)

let bluesatin = new FashionModels(
  "https://i.pinimg.com/474x/82/58/73/825873cea4451b70c79a2b943b3181e1.jpg",
  "Light blue Satin","Light Blue Satin Dresses","Dress",3780000,"Spring coming up"
)


// Create array object and push all cars into it
const product = [
  cortune,
  siviar,
  palamor,
  bavier,
  javeira,
  eros,
  metalmesh,
  bluesatin
]

// Display Product models on screen
arr_car(product);








function arr_car(arr){

  var heads = document.createElement('head')

 

  var styles = document.createElement('style')
  styles.innerHTML = `
      .sell-models {
          height: 500px;
          width: 250px;
          background-color: none;
          padding:20px;
          border-radius: 5px;
          text-align: center;
          font-family: "Cormorant Garamond", serif;
          color: black;
          margin-left: 50px;
          margin-bottom: 15px;
          // background-image: linear-gradient(to bottom,rgb(46, 45, 45), rgb(23, 23, 23));
          color: white;
          
          
      }

      .sell-queue {
          text-align: center;
          margin-bottom: 50px;
          display: flex;
          width:1400px;
          background-image: linear-gradient(to right,rgb(21, 20, 20), rgb(23, 23, 23));
          margin-left: 60px;
          margin-top:50px;
          overflow-y: hidden;
          overflow-x: hidden;

      }

      .sell-queue img{
          height: 350px;
          width: 290px;
          object-fit: cover;
          margin-left: -20px;
          margin-top: -20px;
          
      }
      
      .sell-type {
        color: grey;
        transition: 1;
        background-color:none;
      }
      .sell-type:hover {
        transform: 1.2;
        // color: grey;
      }

      .content {
        margin-top: 10px;
        margin-left: -10px;
        font-family: sans-serif;
        text-align: start;
        width: 450px;
        font-size: 15px;
      }

      .sell-name{
        margin-bottom: 10px;
      }

      .sell-models {
          transition: 0.1s;
          
      }


      
      .sell-series {
        font-weight: 100;
        font-size: 20px;
        font-family: 'QuickSand', senrif;
      }
      .sell-info {
        font-weight: 100;
        ont-family: 'QuickSand', senrif;
      }
      .sell-price{
        font-weight: 100;
        font-family: 'QuickSand', senrif;
      }
      #shop-now {
        height:30px;
        width: 292px;
        background-color: white;
        border: none;
        font-family: 'QuickSand', senrif;
        margin-left: -10px;
      }
      #shop-now:hover{
        background-color: grey;
      }
    `
  document.head.appendChild(styles)


// Create product template and append it into main element
  const models_queue = document.getElementById("sell-queue");
    arr.forEach(item => {
        let template = document.createElement("div");
        template.classList.add("sell-models");
        template.innerHTML = `
          <div class="sell-image">
            <img src="${item.image}" alt="${item.name}" class="sell-img" id = "img">
          </div>
          <div class="content">
            
            
            <div class="sell-series" id = "series">${item.type}</div>
            <p class="sell-info" id ="info">${item.info}</p>
            <div class="sell-price" id = "price">${item.price.toLocaleString()} VNĐ</div>
            <br>
            <button id="shop-now">SHOP NOW</button>
          </div>
        `;

      
        template.addEventListener("click", () => get_product_info(item));
        models_queue.appendChild(template);
        //append template to html file
        
      });

    // const modelobject = document.getElementsByClassName("sell-models");
    // for (let obj = 0; obj < modelobject.length; obj++){
    //   modelobject[obj].styles
    // }
}



// Display model's information
function display_model(obj) {
    let img = document.getElementById("car-img");
    let carname = document.getElementById("car-name");
    let type = document.getElementById("car-type");
    let info = document.getElementById("car-info");
    let price = document.getElementById("car-price");
    let note = document.getElementById("car-note");
    
    // return all value of product have created
    try {
        img.src = obj.image
        carname.textContent = obj.name;
        type.textContent = obj.type;
        info.textContent = obj.info;
        note.textContent = obj.note;
        price.textContent = obj.price;
    }
    catch (e){
        return e;
    }
}

// redirect to product page
function btn_redirect(){
  // window.location.href = "availablesell.html";
  // display_assigned_product(porsche,product);
  // get_product_info()

}

// redirect to product page when prodcuct model  clicked
function display_assigned_product(obj,arr){
  
  const model = document.getElementById("product-car")
  const model_car = document.createElement("div");
  model_car.classList.add("product-container");
  
  
    try {
      
      if (arr.includes(obj.name)) {
         
          
          model_car.innerHTML = `
          <div class="product-image">
            <img src="${obj.image}" alt="${obj.name}" class="car-img">
          </div>
          <div class="product-content">
            <button>show more</button>
            <span style="font-size:30px">
              <b class="product-name">${obj.name}
            </b></span>
            <div class="product-series">${obj.type}</div>
            <p class="product-info">${obj.info}</p>
            <div class="product-price">${obj.price.toLocaleString()} VNĐ</div>
            <div class="product-note">${obj.note}</div>
          </div>
        `;

        // if button queried
        model.appendChild(model_car);

        
      }
    }
    catch(e) {
      console.error(e);
    }
    
  }
  

  function get_product_info(obj){
    const sell_image = obj.image
    const sell_name = obj.name
    const sell_type = obj.type
    const sell_info = obj.info
    const sell_price = obj.price

    console.log(
      {
        "image":sell_image,
        "name":sell_name,
        "info":sell_info,
        "series":sell_type,
        "price":sell_price
      }
    )
    
  }



