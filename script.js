// ===============================
// ROMEO RESTAURANT CART SYSTEM
// ===============================

let cart = [];

// Get all order buttons
const orderButtons = document.querySelectorAll(".order-btn");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const emptyCartMessage = document.getElementById("emptyCartMessage");

// ===============================
// ADD ITEM TO CART
// ===============================
orderButtons.forEach(button => {
    button.addEventListener("click", function () {

        const dishName = this.dataset.dish;
        const priceText = this.parentElement.querySelector(".menu-card-price").innerText;
        const price = parseFloat(priceText.replace("$", ""));

        const existingItem = cart.find(item => item.name === dishName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: dishName,
                price: price,
                quantity: 1
            });
        }

        updateCart();
    });
});

// ===============================
// UPDATE CART DISPLAY
// ===============================
function updateCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        cartCount.style.display = "none";
        cartTotal.innerText = "$0.00";
        return;
    }

    emptyCartMessage.style.display = "none";

    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-3");

        cartItem.innerHTML = `
            <div>
                <h6>${item.name}</h6>
                <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.innerText = "$" + total.toFixed(2);

    cartCount.innerText = totalItems;
    cartCount.style.display = "inline-block";
}

// ===============================
// REMOVE ITEM
// ===============================
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// ===============================
// CHECKOUT FUNCTION (Demo Payment)
// ===============================
function proceedToCheckout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalAmount = cartTotal.innerText;

    // Simple Demo Payment Simulation
    if (confirm("Your total is " + totalAmount + ". Proceed to payment?")) {
        
        alert("Payment Successful! 🎉 Thank you for your order.");

        // Save to Order History (Optional)
        saveOrderToHistory();

        // Clear cart
        cart = [];
        updateCart();

        // Close modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
    }
}

// ===============================
// SAVE ORDER TO ORDER HISTORY
// ===============================
function saveOrderToHistory() {

    const historyContainer = document.getElementById("orderHistoryContainer");
    const noOrdersMessage = document.getElementById("noOrdersMessage");

    noOrdersMessage.style.display = "none";

    const orderCard = document.createElement("div");
    orderCard.classList.add("col-md-6");

    orderCard.innerHTML = `
        <div class="card shadow">
            <div class="card-body">
                <h5 class="card-title">Order #${Math.floor(Math.random() * 10000)}</h5>
                <p class="card-text">
                    ${cart.map(item => `${item.name} (x${item.quantity})`).join("<br>")}
                </p>
                <p class="text-danger fw-bold">Total: ${cartTotal.innerText}</p>
            </div>
        </div>
    `;

    historyContainer.appendChild(orderCard);
}

// ===============================
// USER AUTHENTICATION SYSTEM
// ===============================

// Check if user already logged in when page loads
document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

// ===============================
// SIGN UP
// ===============================
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("signupPhone").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupPasswordConfirm").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = {
        name,
        email,
        phone,
        password
    };

    localStorage.setItem("romeoUser", JSON.stringify(user));
    localStorage.setItem("romeoLoggedIn", "true");

    alert("Account created successfully!");
    location.reload();
});

// ===============================
// LOGIN
// ===============================
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const savedUser = JSON.parse(localStorage.getItem("romeoUser"));

    if (!savedUser) {
        alert("No account found. Please sign up.");
        return;
    }

    if (email === savedUser.email && password === savedUser.password) {
        localStorage.setItem("romeoLoggedIn", "true");
        alert("Login successful!");
        location.reload();
    } else {
        alert("Invalid email or password.");
    }
});

// ===============================
// CHECK LOGIN STATUS
// ===============================
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("romeoLoggedIn");
    const savedUser = JSON.parse(localStorage.getItem("romeoUser"));

    if (isLoggedIn === "true" && savedUser) {

        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("userProfileDropdown").style.display = "block";
        document.getElementById("userNameDisplay").innerText = savedUser.name;

        // Fill profile section
        document.getElementById("profileName").innerText = savedUser.name;
        document.getElementById("profileEmail").innerText = savedUser.email;
        document.getElementById("profilePhone").innerText = savedUser.phone;
    }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("romeoLoggedIn");
    alert("Logged out successfully!");
    location.reload();
}
