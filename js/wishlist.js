// Initialize cart count
const savedCart = localStorage.getItem("cartItems");
const spn = document.querySelector("#spn");
if (savedCart && spn) {
  const items = JSON.parse(savedCart);
  spn.innerHTML = items.length;
}

const container = document.querySelector("#wishlist-container");

function displayWishlist() {
    const wishlist = localStorage.getItem("wishlist");
    
    if (!wishlist || JSON.parse(wishlist).length === 0) {
        container.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-info" role="alert">
                <i class="fa-solid fa-heart mb-3" style="font-size: 3rem;"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add products to your wishlist to save them for later</p>
                <a href="./index.html" class="btn btn-primary-custom mt-3">Continue Shopping</a>
            </div>
        </div> 
        `;
        return;
    }

    const items = JSON.parse(wishlist);
    container.innerHTML = '';

    items.forEach((item, index) => {
        container.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="product-card">
                <div class="product-img-wrapper">
                    <img src="${item.thumbnail}" alt="${item.title}">
                    <button class="wishlist-btn active" onclick="removeFromWishlist(${index})" title="Remove from Wishlist">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <span class="card-category">${item.category}</span>
                    <div class="rating-section">
                        <span class="text-warning">
                            <i class="fa-solid fa-star"></i> ${item.rating.toFixed(1)}
                        </span>
                    </div>
                    <span class="card-price">$${item.price}</span>
                    
                    <div class="card-actions">
                        <button class="btn btn-primary-custom btn-sm" onclick="addToCart(${index})">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                        <button class="btn btn-secondary-custom btn-sm" onclick="removeFromWishlist(${index})">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}

function removeFromWishlist(index) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist"));
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    
    Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Removed from Wishlist",
        showConfirmButton: false,
        timer: 1000
    });
    
    displayWishlist();
}

function addToCart(index) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist"));
    const product = wishlist[index];
    
    // Update cart
    let cartCount = parseInt(spn.innerHTML) || 0;
    spn.innerHTML = cartCount + 1;
    
    const cartData = localStorage.getItem("cartItems");
    if (cartData) {
        const items = JSON.parse(cartData);
        items.push(product);
        localStorage.setItem("cartItems", JSON.stringify(items));
    } else {
        localStorage.setItem("cartItems", JSON.stringify([product]));
    }
    
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added to Cart!",
        showConfirmButton: false,
        timer: 1500
    });
}

// Display wishlist on page load
displayWishlist();
