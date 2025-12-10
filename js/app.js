console.log("hello world")

const productsList = document.querySelector("#products-list")
const spn = document.querySelector("#spn")
const cartBtnContainer = document.querySelector("#cart-btn-container")

let data;
var arr = [];
let allProducts = [];

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: document.body.classList.contains('dark-mode') ? "Dark Mode ON" : "Dark Mode OFF",
    showConfirmButton: false,
    timer: 1000
  });
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Initialize cart count from local storage if available
const savedCart = localStorage.getItem("cartItems");
if (savedCart) {
  const items = JSON.parse(savedCart);
  spn.innerHTML = items.length;
}

// Initialize wishlist count
const savedWishlist = localStorage.getItem("wishlist");
const wishSpn = document.querySelector("#wish-spn");
if (savedWishlist && wishSpn) {
  const items = JSON.parse(savedWishlist);
  wishSpn.innerHTML = items.length;
}

fetch('https://dummyjson.com/products')
  .then(res => res.json())
  .then(res => {
    data = res;
    allProducts = res.products;
    console.log(res)
    displayProducts(res.products);
    window.products = res
  })

function displayProducts(products) {
  productsList.innerHTML = '';
  
  if (products.length === 0) {
    productsList.innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-info">
          <h4>No products found</h4>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
    `;
    return;
  }

  products.map((item, index) => {
    const isInWishlist = checkIfInWishlist(item.id);
    productsList.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="product-card">
              <div class="product-img-wrapper">
                  <img src="${item.thumbnail}" alt="${item.title}">
                  <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${item.id}, event)" title="Add to Wishlist">
                      <i class="fa-solid fa-heart"></i>
                  </button>
              </div>
              <div class="card-body">
                  <span class="card-category">${item.category}</span>
                  <h3 class="card-title" title="${item.title}">${item.title}</h3>
                  <div class="rating-section">
                      <span class="text-warning">
                          <i class="fa-solid fa-star"></i> ${item.rating.toFixed(1)}
                      </span>
                      <span class="text-muted">(${item.reviews?.length || 0} reviews)</span>
                  </div>
                  <span class="card-price">$${item.price}</span>
                  <div class="card-actions">
                      <button class="btn btn-primary-custom btn-sm" onclick="addtoCart(${index})">
                          <i class="fa-solid fa-cart-plus"></i> Add
                      </button>
                      <button class="btn btn-secondary-custom btn-sm" onclick="seeMore(${item.id})">
                          <i class="fa-solid fa-eye"></i> Details
                      </button>
                  </div>
              </div>
          </div>
      </div>
      `
  })
}

function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();
  const sortFilter = document.getElementById("sortFilter").value;

  let filtered = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                         product.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !categoryFilter || product.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  if (sortFilter === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortFilter === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortFilter === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  displayProducts(filtered);
}

function checkIfInWishlist(productId) {
  const wishlist = localStorage.getItem("wishlist");
  if (!wishlist) return false;
  const items = JSON.parse(wishlist);
  return items.some(item => item.id === productId);
}

function toggleWishlist(productId, event) {
  event.preventDefault();
  event.stopPropagation();
  
  const wishlist = localStorage.getItem("wishlist");
  let items = wishlist ? JSON.parse(wishlist) : [];
  
  const productIndex = items.findIndex(item => item.id === productId);
  const product = allProducts.find(p => p.id === productId);
  
  if (productIndex > -1) {
    items.splice(productIndex, 1);
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Removed from Wishlist",
      showConfirmButton: false,
      timer: 1000
    });
  } else {
    items.push(product);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Added to Wishlist",
      showConfirmButton: false,
      timer: 1000
    });
  }
  
  localStorage.setItem("wishlist", JSON.stringify(items));
  const wishSpn = document.querySelector("#wish-spn");
  if (wishSpn) wishSpn.innerHTML = items.length;
  
  // Refresh the wishlist button appearance
  filterProducts();
}

const seeMore = (id) => {
  localStorage.setItem("id", id)
  window.location = "./single.html"
}

function addtoCart(index) {
  let cartItems = data.products[index]
  console.log("cartItems : ", cartItems)

  // Update UI count
  let currentCount = parseInt(spn.innerHTML);
  spn.innerHTML = currentCount + 1;

  Swal.fire({
    title: "Added to Cart!",
    text: `${cartItems.title} has been added to your cart`,
    icon: "success",
    timer: 1500,
    showConfirmButton: false
  });

  const cartData = localStorage.getItem("cartItems");
  if (cartData) {
    const item = JSON.parse(cartData)
    item.push(cartItems);
    const strData = JSON.stringify(item)
    localStorage.setItem("cartItems", strData);
  } else {
    const data = []
    data.push(cartItems);
    const item = JSON.stringify(data)
    localStorage.setItem("cartItems", item);
  }
}

function checkME() {
  window.location = "./cart.html"
}

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      
      // Store newsletter subscription
      let subscribers = localStorage.getItem('newsletters');
      subscribers = subscribers ? JSON.parse(subscribers) : [];
      
      if (!subscribers.find(s => s.email === email)) {
        subscribers.push({
          email: email,
          subscribedDate: new Date().toLocaleString()
        });
        localStorage.setItem('newsletters', JSON.stringify(subscribers));
        
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: `Thanks for subscribing! Check ${email} for exclusive offers.`,
          timer: 2000,
          showConfirmButton: false
        });
        
        form.reset();
      } else {
        Swal.fire({
          icon: "info",
          title: "Already Subscribed",
          text: "This email is already subscribed to our newsletter.",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
});








