const material = localStorage.getItem("cartItems");
const num = JSON.parse(material);

const div = document.querySelector("#container");

// Discount codes
const discountCodes = {
  'SAVE10': 10,
  'SAVE20': 20,
  'SAVE30': 30,
  'WELCOME': 15
};

let appliedDiscount = 0;

function getCartItem() {
    if (num === null || num.length === 0) {
        div.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-warning" role="alert">
                <i class="fa-solid fa-cart-shopping mb-3" style="font-size: 3rem;"></i>
                <h3>Your cart is empty</h3>
                <a href="/" class="btn btn-primary-custom mt-3">Go back to shop</a>
            </div>
        </div> 
        `;
    }
    else {
        div.innerHTML = "";  // Clear the current items before re-rendering 

        num.map((item, index) => {
            div.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${item.thumbnail}" alt="${item.title}">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${item.title}</h3>
                        <span class="card-category">${item.category}</span>
                        <span class="card-price">$${item.price}</span>
                        
                        <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
                            <button class="btn btn-outline-dark btn-sm rounded-circle" onclick="decrement(${index})">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span id="spn-${index}" class="fw-bold fs-5">1</span>
                            <button class="btn btn-outline-dark btn-sm rounded-circle" onclick="increment(${index})">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        
                        <div class="mt-3 p-2 bg-light rounded">
                            <p class="mb-2"><strong>Item Total:</strong> $<span id="total-${index}">${item.price}</span></p>
                        </div>
                        
                        <button class="btn btn-danger btn-sm mt-3 w-100" onclick="deleteItem(${index})">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
            `;
        });

        // Add grand total section with discount
        div.innerHTML += `
        <div class="col-12 mt-4">
            <div class="card p-4" style="background: #f8f9fa;">
                <h5>Apply Discount Code</h5>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="discountInput" placeholder="Enter code (e.g., SAVE10, SAVE20, WELCOME)">
                    <button class="btn btn-outline-secondary btn-sm" onclick="applyDiscount()">Apply</button>
                </div>
                <div id="discountInfo"></div>
            </div>
            <div class="card p-4 text-center mt-3" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <h5>Subtotal: $<span id="subtotal">0.00</span></h5>
                <h5 id="discountDisplay"></h5>
                <h3>Total: $<span id="grand-total">0.00</span></h3>
                <button class="btn btn-light btn-sm mt-3" onclick="proceedCheckout()">Proceed to Checkout</button>
            </div>
        </div>
        `;

        calculateGrandTotal();
    }
}

getCartItem();

function increment(index) {
    const spn = document.querySelector(`#spn-${index}`);
    spn.innerHTML++;
    updateItemTotal(index);
    calculateGrandTotal();
}

function decrement(index) {
    const spn = document.querySelector(`#spn-${index}`);
    if (spn.innerHTML > 1) {
        spn.innerHTML--;
        updateItemTotal(index);
        calculateGrandTotal();
    }
}

function updateItemTotal(index) {
    const quantity = parseInt(document.querySelector(`#spn-${index}`).innerHTML);
    const itemPrice = num[index].price;
    const totalPrice = (quantity * itemPrice).toFixed(2);
    document.querySelector(`#total-${index}`).innerHTML = totalPrice;
}

function calculateGrandTotal() {
    let total = 0;
    
    num.forEach((item, index) => {
        const quantity = parseInt(document.querySelector(`#spn-${index}`).innerHTML) || 1;
        total += item.price * quantity;
    });

    // Update subtotal
    const subtotalElement = document.querySelector("#subtotal");
    if (subtotalElement) {
        subtotalElement.innerHTML = total.toFixed(2);
    }

    // Apply discount
    const discountAmount = (total * appliedDiscount) / 100;
    total -= discountAmount;

    // Update discount display
    const discountDisplay = document.querySelector("#discountDisplay");
    if (discountDisplay) {
        if (appliedDiscount > 0) {
            discountDisplay.innerHTML = `<h5 style="color: #28a745;">Discount (-${appliedDiscount}%): -$${discountAmount.toFixed(2)}</h5>`;
        } else {
            discountDisplay.innerHTML = '';
        }
    }

    const grandTotalElement = document.querySelector("#grand-total");
    if (grandTotalElement) {
        grandTotalElement.innerHTML = total.toFixed(2);
    }
}

function applyDiscount() {
    const code = document.getElementById("discountInput").value.toUpperCase();
    const discountInfo = document.getElementById("discountInfo");

    if (!code) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please enter a discount code",
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    if (discountCodes[code]) {
        appliedDiscount = discountCodes[code];
        discountInfo.innerHTML = `<p class="text-success"><i class="fa-solid fa-check"></i> Code "${code}" applied! ${appliedDiscount}% discount</p>`;
        
        Swal.fire({
            icon: "success",
            title: "Discount Applied!",
            text: `${appliedDiscount}% off`,
            timer: 1500,
            showConfirmButton: false
        });
        
        calculateGrandTotal();
    } else {
        discountInfo.innerHTML = `<p class="text-danger"><i class="fa-solid fa-times"></i> Invalid code</p>`;
        Swal.fire({
            icon: "error",
            title: "Invalid Code",
            text: "Try: SAVE10, SAVE20, SAVE30, or WELCOME",
            timer: 2000,
            showConfirmButton: false
        });
    }
}

function deleteItem(index) {
    // Remove the item from the array
    num.splice(index, 1);

    // Update localStorage with the new array
    localStorage.setItem("cartItems", JSON.stringify(num));

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Item removed",
        showConfirmButton: false,
        timer: 1500
    });
    // Re-render the items after deletion
    getCartItem();
}

function proceedCheckout() {
    const grandTotal = document.querySelector("#grand-total").innerHTML;
    
    Swal.fire({
        title: "Select Payment Method",
        icon: "question",
        html: `
            <div style="text-align: center; padding: 20px;">
                <h4 style="margin-bottom: 20px; color: #333;">How do you want to pay?</h4>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="payment-btn" onclick="selectPayment('cash')" style="
                        padding: 20px 30px;
                        border: 2px solid #28a745;
                        background-color: #f0fff4;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 16px;
                        font-weight: 600;
                        color: #28a745;
                    ">
                        <i class="fa-solid fa-money-bill" style="margin-right: 10px;"></i>
                        Cash on Delivery
                    </button>
                    <button class="payment-btn" onclick="selectPayment('online')" style="
                        padding: 20px 30px;
                        border: 2px solid #007bff;
                        background-color: #f0f7ff;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 16px;
                        font-weight: 600;
                        color: #007bff;
                    ">
                        <i class="fa-solid fa-credit-card" style="margin-right: 10px;"></i>
                        Online Payment
                    </button>
                </div>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
}

function selectPayment(method) {
    const grandTotal = document.querySelector("#grand-total").innerHTML;
    
    // Create order object
    const orderItems = num.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: 1
    }));
    
    const order = {
        orderId: 'ORD-' + Date.now(),
        items: orderItems,
        total: grandTotal,
        paymentMethod: method === 'cash' ? 'Cash on Delivery' : 'Online Payment',
        status: 'processing',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
    
    // Save order to localStorage
    let orders = localStorage.getItem("orders");
    orders = orders ? JSON.parse(orders) : [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    if (method === 'cash') {
        Swal.fire({
            icon: "success",
            title: "Order Confirmed!",
            text: `Your order for $${grandTotal} has been placed.\nOrder ID: ${order.orderId}\nPayment method: Cash on Delivery\nWe will deliver it to you soon!`,
            confirmButtonText: "View Orders"
        }).then(() => {
            // Clear cart after order
            localStorage.removeItem("cartItems");
            window.location.href = "/orders";
        });
    } else if (method === 'online') {
        Swal.fire({
            icon: "info",
            title: "Online Payment",
            text: `Redirecting to payment gateway...\nAmount: $${grandTotal}`,
            confirmButtonText: "Proceed"
        }).then(() => {
            // Here you would integrate with a real payment gateway
            Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                text: `Your order for $${grandTotal} has been placed successfully!\nOrder ID: ${order.orderId}`,
                confirmButtonText: "View Orders"
            }).then(() => {
                localStorage.removeItem("cartItems");
                window.location.href = "/orders";
            });
        });
    }
}

