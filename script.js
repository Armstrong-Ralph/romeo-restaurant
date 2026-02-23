/*
 * ===== ROMEO RESTAURANT - COMPLETE JAVASCRIPT INTERACTIONS =====
 * This file handles all JavaScript interactions for the restaurant website
 * including OAuth authentication, user profiles, shopping cart, order history, addresses, and favorites
 */

// ===== GLOBAL STATE =====
let currentUser = null;
let users = []; // Database of users (in localStorage)
let cart = [];
let userAddresses = [];
let userOrders = [];
let favoriteOrders = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadAuthState();
    loadCart();
    loadUserData();
    initializeEventListeners();
    updateActiveNavLink();
    updateAuthUI();
});

/**
 * Load authentication state from localStorage
 */
function loadAuthState() {
    const savedUser = localStorage.getItem('romeoCurrentUser');
    const savedUsers = localStorage.getItem('romeoUsers');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

/**
 * Load user-specific data from localStorage
 */
function loadUserData() {
    if (currentUser) {
        const userKey = `romeo_user_${currentUser.id}`;
        const savedAddresses = localStorage.getItem(`${userKey}_addresses`);
        const savedOrders = localStorage.getItem(`${userKey}_orders`);
        const savedFavorites = localStorage.getItem(`${userKey}_favorites`);
        
        if (savedAddresses) userAddresses = JSON.parse(savedAddresses);
        if (savedOrders) userOrders = JSON.parse(savedOrders);
        if (savedFavorites) favoriteOrders = JSON.parse(savedFavorites);
    }
}

/**
 * Save user-specific data to localStorage
 */
function saveUserData() {
    if (currentUser) {
        const userKey = `romeo_user_${currentUser.id}`;
        localStorage.setItem(`${userKey}_addresses`, JSON.stringify(userAddresses));
        localStorage.setItem(`${userKey}_orders`, JSON.stringify(userOrders));
        localStorage.setItem(`${userKey}_favorites`, JSON.stringify(favoriteOrders));
    }
}

/**
 * Update authentication UI based on login state
 */
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfileDropdown) userProfileDropdown.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name.split(' ')[0]; // First name
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfileDropdown) userProfileDropdown.style.display = 'none';
    }
}

// ===== AUTHENTICATION FUNCTIONS =====

/**
 * Initialize form event listeners
 */
function initializeEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
    
    const passwordResetForm = document.getElementById('passwordResetForm');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordReset();
        });
    }
    
    const contactForm = document.querySelector('form[id="contactForm"]');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Add event listeners for "Order Now" buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dishName = this.getAttribute('data-dish');
            const priceText = this.previousElementSibling.previousElementSibling.textContent;
            const price = parseFloat(priceText.replace('$', ''));
            addToCart(dishName, price);
        });
    });

    // Add event listener for Hero "Order Now" button
    const heroOrderBtn = document.getElementById('orderBtn');
    if (heroOrderBtn) {
        heroOrderBtn.addEventListener('click', function() {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/**
 * Handle user login
 */
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        alert('❌ Please enter both email and password.');
        return;
    }
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
        alert('❌ Email not found. Please sign up first.');
        return;
    }
    
    // Simple password validation (in production, use bcrypt)
    if (user.password !== password) {
        alert('❌ Incorrect password. Please try again.');
        return;
    }
    
    // Login successful
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };
    
    localStorage.setItem('romeoCurrentUser', JSON.stringify(currentUser));
    localStorage.setItem('romeoUsers', JSON.stringify(users));
    
    if (rememberMe) {
        localStorage.setItem('romeoRememberMe', 'true');
    }
    
    loadUserData();
    updateAuthUI();
    
    // Close modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    
    alert(`✅ Welcome back, ${currentUser.name}!`);
    
    // Reset form
    document.getElementById('loginForm').reset();
}

/**
 * Handle user signup
 */
function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !phone || !password || !passwordConfirm) {
        alert('❌ Please fill in all fields.');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters long.');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('❌ Passwords do not match.');
        return;
    }
    
    if (!agreeTerms) {
        alert('❌ Please agree to the Terms and Conditions.');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert('❌ Email already registered. Please login or use a different email.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        password: password, // In production, hash this!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('romeoUsers', JSON.stringify(users));
    
    // Auto-login after signup
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
    };
    
    localStorage.setItem('romeoCurrentUser', JSON.stringify(currentUser));
    loadUserData();
    updateAuthUI();
    
    // Close modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    
    alert(`✅ Account created successfully, ${name}! Welcome to ROMEO Restaurant!`);
    
    // Reset form
    document.getElementById('signupForm').reset();
}

/**
 * Handle password reset
 */
function handlePasswordReset() {
    const resetEmail = document.getElementById('resetEmail').value.trim();
    
    if (!resetEmail) {
        alert('❌ Please enter your email address.');
        return;
    }
    
    const user = users.find(u => u.email === resetEmail);
    
    if (!user) {
        alert('❌ Email not found in our system.');
        return;
    }
    
    // In production, send reset link via email
    alert(`✅ Password reset link has been sent to ${resetEmail}. Please check your email.`);
    document.getElementById('passwordResetForm').reset();
}

/**
 * Handle OAuth login (Google)
 */
function loginWithGoogle() {
    // In production, integrate with Google OAuth
    alert('🔑 Google login is coming soon! For now, please use email/password registration.');
}

/**
 * Handle OAuth login (Facebook)
 */
function loginWithFacebook() {
    // In production, integrate with Facebook OAuth
    alert('🔑 Facebook login is coming soon! For now, please use email/password registration.');
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('romeoCurrentUser');
        localStorage.removeItem('romeoRememberMe');
        updateAuthUI();
        alert('✅ You have been logged out successfully.');
    }
}

// ===== USER PROFILE FUNCTIONS =====

/**
 * Show user profile page
 */
function showProfile() {
    if (!currentUser) {
        alert('Please login first.');
        return;
    }
    
    const profileSection = document.getElementById('profilePage');
    if (profileSection) {
        profileSection.style.display = 'block';
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profilePhone').textContent = currentUser.phone;
    }
}

/**
 * Show order history
 */
function showOrderHistory() {
    if (!currentUser) {
        alert('Please login first.');
        return;
    }
    
    const orderHistorySection = document.getElementById('orderHistoryPage');
    if (orderHistorySection) {
        orderHistorySection.style.display = 'block';
        renderOrderHistory();
    }
}

/**
 * Render order history
 */
function renderOrderHistory() {
    const orderContainer = document.getElementById('orderHistoryContainer');
    if (!orderContainer) return;
    
    if (userOrders.length === 0) {
        orderContainer.innerHTML = '<p class="text-center text-muted">No orders yet. Start ordering now!</p>';
        return;
    }
    
    orderContainer.innerHTML = '';
    userOrders.forEach((order, index) => {
        const orderDate = new Date(order.date).toLocaleDateString();
        const orderHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="card-title">Order #${index + 1}</h6>
                            <p class="text-muted mb-1">Date: ${orderDate}</p>
                            <p class="text-muted mb-1">Items: ${order.items.length}</p>
                        </div>
                        <div class="col-md-3">
                            <p class="fw-bold">Total: $${order.total.toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-sm btn-primary" onclick="toggleFavoriteOrder(${index})">
                                <i class="fas fa-heart"></i> Favorite
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        orderContainer.innerHTML += orderHTML;
    });
}

/**
 * Add order to history
 */
function addOrderToHistory(orderData) {
    const order = {
        date: new Date().toISOString(),
        items: orderData.items,
        total: orderData.total,
        address: orderData.address
    };
    
    userOrders.push(order);
    saveUserData();
}

/**
 * Toggle favorite order
 */
function toggleFavoriteOrder(orderIndex) {
    const order = userOrders[orderIndex];
    const isFavorited = favoriteOrders.some(fav => 
        fav.date === order.date && fav.total === order.total
    );
    
    if (isFavorited) {
        favoriteOrders = favoriteOrders.filter(fav => 
            !(fav.date === order.date && fav.total === order.total)
        );
        alert('❌ Removed from favorites');
    } else {
        favoriteOrders.push(order);
        alert('❤️ Added to favorites');
    }
    
    saveUserData();
    renderOrderHistory();
}

// ===== ADDRESS MANAGEMENT =====

/**
 * Show addresses page
 */
function showAddresses() {
    if (!currentUser) {
        alert('Please login first.');
        return;
    }
    
    const addressesSection = document.getElementById('addressesPage');
    if (addressesSection) {
        addressesSection.style.display = 'block';
        renderAddresses();
    }
}

/**
 * Show favorites page
 */
function showFavorites() {
    if (!currentUser) {
        alert('Please login first.');
        return;
    }
    
    const favoritesSection = document.getElementById('favoritesPage');
    if (favoritesSection) {
        favoritesSection.style.display = 'block';
        renderFavorites();
    }
}

/**
 * Render favorite orders
 */
function renderFavorites() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    if (!favoritesContainer) return;
    
    if (favoriteOrders.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center text-muted">No favorite orders yet.</p>';
        return;
    }
    
    favoritesContainer.innerHTML = '';
    favoriteOrders.forEach((order, index) => {
        const orderDate = new Date(order.date).toLocaleDateString();
        const orderHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="card-title">Favorite Order #${index + 1}</h6>
                            <p class="text-muted mb-1">Date: ${orderDate}</p>
                            <p class="text-muted mb-1">Items: ${order.items.length}</p>
                        </div>
                        <div class="col-md-3">
                            <p class="fw-bold">Total: $${order.total.toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-sm btn-danger" onclick="toggleFavoriteOrder(${index})">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        favoritesContainer.innerHTML += orderHTML;
    });
}

/**
 * Render saved addresses
 */
function renderAddresses() {
    const addressContainer = document.getElementById('addressesContainer');
    if (!addressContainer) return;
    
    addressContainer.innerHTML = '';
    
    if (userAddresses.length === 0) {
        addressContainer.innerHTML = '<p class="text-muted">No saved addresses. Add one below.</p>';
    } else {
        userAddresses.forEach((address, index) => {
            const addressHTML = `
                <div class="card mb-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h6 class="card-title">${address.label}</h6>
                                <p class="mb-0">${address.street}</p>
                                <p class="mb-0">${address.city}, ${address.state} ${address.zip}</p>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-sm btn-warning me-2" onclick="editAddress(${index})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteAddress(${index})">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            addressContainer.innerHTML += addressHTML;
        });
    }
}

/**
 * Add new address
 */
function addNewAddress() {
    const street = prompt('Enter street address:');
    if (!street) return;
    
    const city = prompt('Enter city:');
    if (!city) return;
    
    const state = prompt('Enter state:');
    if (!state) return;
    
    const zip = prompt('Enter ZIP code:');
    if (!zip) return;
    
    const label = prompt('Label (e.g., Home, Office):');
    if (!label) return;
    
    const newAddress = {
        label: label,
        street: street,
        city: city,
        state: state,
        zip: zip,
        default: userAddresses.length === 0
    };
    
    userAddresses.push(newAddress);
    saveUserData();
    renderAddresses();
    alert('✅ Address added successfully!');
}

/**
 * Edit address
 */
function editAddress(index) {
    const address = userAddresses[index];
    const newLabel = prompt('Label:', address.label);
    if (!newLabel) return;
    
    const newStreet = prompt('Street:', address.street);
    if (!newStreet) return;
    
    userAddresses[index] = {
        ...address,
        label: newLabel,
        street: newStreet
    };
    
    saveUserData();
    renderAddresses();
    alert('✅ Address updated successfully!');
}

/**
 * Delete address
 */
function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        userAddresses.splice(index, 1);
        saveUserData();
        renderAddresses();
        alert('✅ Address deleted successfully!');
    }
}

// ===== SHOPPING CART FUNCTIONS =====

/**
 * Load cart from localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem('romeoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('romeoCart', JSON.stringify(cart));
    updateCartUI();
}

/**
 * Add item to cart
 */
function addToCart(name, price) {
    const quantity = parseInt(prompt(`How many ${name} would you like?`, '1'));
    
    if (isNaN(quantity) || quantity < 1) {
        alert('❌ Please enter a valid quantity.');
        return;
    }
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: quantity
        });
    }
    
    saveCart();
    alert(`✅ ${quantity} ${name}(s) added to cart!`);
}

/**
 * Show shopping cart modal
 */
function showCart() {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    renderCartItems();
    cartModal.show();
}

/**
 * Render cart items
 */
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemHTML = `
            <div class="cart-item mb-3 pb-3 border-bottom">
                <div class="row align-items-center">
                    <div class="col-md-4">
                        <p class="mb-0 fw-bold">${item.name}</p>
                        <p class="mb-0 text-muted small">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="col-md-3">
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-secondary" onclick="decreaseQuantity(${index})">−</button>
                            <button class="btn btn-outline-secondary" disabled>${item.quantity}</button>
                            <button class="btn btn-outline-secondary" onclick="increaseQuantity(${index})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <p class="mb-0 fw-bold text-danger">$${itemTotal.toFixed(2)}</p>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Increase item quantity
 */
function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    renderCartItems();
}

/**
 * Decrease item quantity
 */
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    renderCartItems();
}

/**
 * Remove item from cart
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
}

/**
 * Update cart UI (badge count)
 */
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    if (!currentUser) {
        alert('Please login to proceed with checkout.');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    
    // Get default address or first address
    let deliveryAddress = userAddresses.find(a => a.default) || userAddresses[0];
    
    if (!deliveryAddress) {
        alert('Please add a delivery address first.');
        showAddresses();
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const orderData = {
        items: [...cart],
        total: total,
        address: deliveryAddress
    };
    
    addOrderToHistory(orderData);
    
    // Clear cart
    cart = [];
    saveCart();
    
    // Close modal
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.hide();
    
    alert(`✅ Order placed successfully!\n\nTotal: $${total.toFixed(2)}\nDelivery to: ${deliveryAddress.street}, ${deliveryAddress.city}\n\nEstimated delivery: 30-45 minutes`);
}

// ===== CONTACT FORM =====

/**
 * Handle contact form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value;
    
    // Validation
    if (!name || !email || !phone || !date || !message) {
        alert('❌ Please fill in all fields.');
        return;
    }
    
    // In production, send this data to backend
    alert(`✅ Thank you, ${name}! We've received your reservation request.\nWe'll confirm your booking at ${email} shortly.`);
    
    // Reset form
    this.reset();
}

// ===== NAVIGATION =====

/**
 * Update active navigation link on scroll
 */
function updateActiveNavLink() {
    const sections = ['home', 'menu', 'about', 'contact'];
    let currentSection = 'home';
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100) {
                currentSection = section;
            }
        }
    });
    
    // Update nav links
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);
