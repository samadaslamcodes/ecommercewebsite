const item = localStorage.getItem("id")

console.log(item)

const div = document.querySelector("#product-details-container")

// Initialize cart count from local storage
const savedCart = localStorage.getItem("cartItems");
const spn = document.querySelector("#spn");
if (savedCart && spn) {
  const items = JSON.parse(savedCart);
  spn.innerHTML = items.length;
}

let productData = null;

fetch(`https://dummyjson.com/products/${item}`)
  .then(res => res.json())
  .then(res => {
    console.log(res)
    productData = res;

    div.innerHTML = `
    <div class="col-md-6 mb-4">
        <div class="product-img-wrapper bg-white rounded shadow-sm p-4" style="height: 400px;">
            <img src="${res.thumbnail}" alt="${res.title}" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div class="mt-4">
            <h5>Product Rating</h5>
            <div class="d-flex align-items-center gap-2">
                <div class="stars">
                    ${'<i class="fa-solid fa-star text-warning"></i>'.repeat(Math.floor(res.rating))}
                    ${res.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke text-warning"></i>' : ''}
                </div>
                <span class="badge bg-info">${res.rating} / 5</span>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card border-0 shadow-sm p-4 mb-4">
            <h2 class="mb-3">${res.title}</h2>
            <div class="mb-3">
                <span class="badge bg-secondary fs-6">${res.category}</span>
                <span class="badge bg-success ms-2">In Stock</span>
            </div>
            <h3 class="text-primary mb-4">$${res.price}</h3>
            <p class="lead mb-4">${res.description}</p>
            
            <div class="d-grid gap-2 d-md-block mb-4">
                <a href="./index.html" class="btn btn-outline-dark btn-sm px-4">
                    <i class="fa-solid fa-arrow-left"></i> Go Back
                </a>
                <button class="btn btn-primary-custom btn-sm px-4 ms-md-2" onclick="addtoCart()">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>

        <!-- Specifications Section -->
        <div class="card border-0 shadow-sm p-4">
            <h5 class="mb-3"><i class="fa-solid fa-cogs"></i> Specifications</h5>
            <table class="table table-sm">
                <tr>
                    <td><strong>Brand:</strong></td>
                    <td>${res.brand || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Category:</strong></td>
                    <td>${res.category}</td>
                </tr>
                <tr>
                    <td><strong>SKU:</strong></td>
                    <td>${res.sku || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Weight:</strong></td>
                    <td>${res.weight || 'N/A'} g</td>
                </tr>
                <tr>
                    <td><strong>Dimensions:</strong></td>
                    <td>${res.dimensions?.width || 'N/A'} x ${res.dimensions?.height || 'N/A'} x ${res.dimensions?.depth || 'N/A'} cm</td>
                </tr>
                <tr>
                    <td><strong>Warranty:</strong></td>
                    <td>${res.warrantyInformation || '1 Year Warranty'}</td>
                </tr>
                <tr>
                    <td><strong>Shipping:</strong></td>
                    <td>${res.shippingInformation || 'Free Shipping'}</td>
                </tr>
                <tr>
                    <td><strong>Return Policy:</strong></td>
                    <td>${res.returnPolicy || '30 Days Return'}</td>
                </tr>
            </table>
        </div>
    </div>
    `;
    
    // Load recommendations
    loadRecommendations(res.category);
  });

function addtoCart() {
  if (!productData) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Product data not loaded",
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  // Update UI count
  const spn = document.querySelector("#spn");
  if (spn) {
    let currentCount = parseInt(spn.innerHTML) || 0;
    spn.innerHTML = currentCount + 1;
  }

  Swal.fire({
    title: "Added to Cart!",
    text: `${productData.title} has been added to your cart`,
    icon: "success",
    timer: 1500,
    showConfirmButton: false
  });

  const cartData = localStorage.getItem("cartItems");
  if (cartData) {
    const items = JSON.parse(cartData);
    items.push(productData);
    localStorage.setItem("cartItems", JSON.stringify(items));
  } else {
    const newCart = [productData];
    localStorage.setItem("cartItems", JSON.stringify(newCart));
  }
}

// Load product recommendations
function loadRecommendations(category) {
  fetch(`https://dummyjson.com/products?limit=6`)
    .then(res => res.json())
    .then(res => {
      // Filter products from same category but exclude current product
      let recommendations = res.products.filter(p => 
        p.category === category && p.id != item
      );
      
      // If not enough, add top rated products
      if (recommendations.length < 4) {
        recommendations = res.products.filter(p => p.id != item).slice(0, 4);
      }
      
      const container = document.querySelector("#recommendations-container");
      if (container) {
        recommendations.slice(0, 4).forEach(product => {
          container.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>
                    <div class="card-body">
                        <span class="card-category">${product.category}</span>
                        <h3 class="card-title" title="${product.title}">${product.title}</h3>
                        <div class="rating-section">
                            <span class="text-warning">
                                <i class="fa-solid fa-star"></i> ${product.rating.toFixed(1)}
                            </span>
                        </div>
                        <span class="card-price">$${product.price}</span>
                        <div class="card-actions">
                            <button class="btn btn-primary-custom btn-sm" onclick="addRecommendedToCart(${product.id})">
                                <i class="fa-solid fa-cart-plus"></i> Add
                            </button>
                            <button class="btn btn-secondary-custom btn-sm" onclick="viewProduct(${product.id})">
                                <i class="fa-solid fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          `;
        });
      }
    });
}

function addRecommendedToCart(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      const spn = document.querySelector("#spn");
      if (spn) {
        let currentCount = parseInt(spn.innerHTML) || 0;
        spn.innerHTML = currentCount + 1;
      }

      Swal.fire({
        title: "Added to Cart!",
        text: `${product.title} has been added to your cart`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      const cartData = localStorage.getItem("cartItems");
      if (cartData) {
        const items = JSON.parse(cartData);
        items.push(product);
        localStorage.setItem("cartItems", JSON.stringify(items));
      } else {
        localStorage.setItem("cartItems", JSON.stringify([product]));
      }
    });
}

function viewProduct(productId) {
  localStorage.setItem("id", productId);
  window.location.href = "./single.html";
}
