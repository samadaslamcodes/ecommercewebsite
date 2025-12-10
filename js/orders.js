// Initialize cart count
const savedCart = localStorage.getItem("cartItems");
const spn = document.querySelector("#spn");
if (savedCart && spn) {
  const items = JSON.parse(savedCart);
  spn.innerHTML = items.length;
}

const container = document.querySelector("#orders-container");

function displayOrders() {
    const orders = localStorage.getItem("orders");
    
    if (!orders || JSON.parse(orders).length === 0) {
        container.innerHTML = `
        <div class="alert alert-info text-center" role="alert">
            <i class="fa-solid fa-box mb-3" style="font-size: 3rem;"></i>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet. Start shopping now!</p>
            <a href="/" class="btn btn-primary-custom mt-3">Continue Shopping</a>
        </div> 
        `;
        return;
    }

    const orderList = JSON.parse(orders);
    container.innerHTML = '';

    orderList.forEach((order, index) => {
        const itemsHTML = order.items.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.title} x${item.quantity}</span>
                <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        container.innerHTML += `
        <div class="order-card">
            <div class="row">
                <div class="col-md-8">
                    <h5>Order #${order.orderId}</h5>
                    <p class="text-muted mb-2">
                        <i class="fa-solid fa-calendar"></i> ${order.date}
                    </p>
                    <div class="order-items mt-3">
                        <h6>Items:</h6>
                        ${itemsHTML}
                    </div>
                </div>
                <div class="col-md-4 text-md-end">
                    <div class="mb-3">
                        <span class="order-status status-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                    <h5>Total: $${order.total}</h5>
                    <p class="text-muted">
                        <i class="fa-solid fa-credit-card"></i> ${order.paymentMethod}
                    </p>
                </div>
            </div>
        </div>
        `;
    });
}

// Display orders on page load
displayOrders();
