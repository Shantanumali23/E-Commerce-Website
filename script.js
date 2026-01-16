let cart = [];
let user = JSON.parse(localStorage.getItem('auraUser')) || null;
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));

// Initialize Auth
function updateAuthUI() {
    const box = document.getElementById('userDisplay');
    if (user) {
        box.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="badge bg-dark border border-secondary me-2 p-2 px-3">
                    <i class="bi bi-person-circle me-1"></i> Hello, ${user.name}
                </span>
                <button class="btn btn-sm btn-outline-danger" onclick="logout()">Logout</button>
            </div>`;
    } else {
        box.innerHTML = `<button class="btn btn-warning btn-sm fw-bold px-4" onclick="showLogin()">Login</button>`;
    }
}

// Function to show the updated Login Modal with Password
function showLogin() {
    document.getElementById('modalUI').innerHTML = `
        <div class="text-center">
            <h4 class="fw-bold mb-4">Login to AURA</h4>
            <div class="mb-3 text-start">
                <label class="form-label small fw-bold">Full Name</label>
                <input type="text" id="nInp" class="form-control p-3" placeholder="Enter your name">
            </div>
            <div class="mb-4 text-start">
                <label class="form-label small fw-bold">Password</label>
                <div class="input-group">
                    <input type="password" id="pInp" class="form-control p-3" placeholder="Enter password">
                    <button class="btn btn-outline-secondary" type="button" onclick="togglePass()">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </div>
            <button class="btn btn-dark w-100 p-3 fw-bold rounded-pill" onclick="login()">ENTER STORE</button>
            <p class="mt-3 small text-muted text-center">New user? Sign up will be saved locally.</p>
        </div>`;
    loginModal.show();
}

// Function to handle the login logic
function login() {
    const name = document.getElementById('nInp').value;
    const password = document.getElementById('pInp').value;

    if (!name || !password) {
        alert("Please enter both Name and Password");
        return;
    }

    // Creating the user object (In a real app, you'd verify this with a database)
    user = {
        name: name,
        password: password // Saved for session simulation
    };

    localStorage.setItem('auraUser', JSON.stringify(user));

    // Update the Navbar to show "Hello, Name"
    updateAuthUI();
    loginModal.hide();

    // Optional: Success message
    console.log("Logged in successfully as " + name);
}

// Extra Feature: Toggle Password Visibility
function togglePass() {
    const passInput = document.getElementById('pInp');
    if (passInput.type === "password") {
        passInput.type = "text";
    } else {
        passInput.type = "password";
    }
}

function logout() { localStorage.removeItem('auraUser'); user = null; updateAuthUI(); }

// Search, Sort, Filter
function handleSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.product-card-wrapper');
    items.forEach(i => {
        const name = i.getAttribute('data-name').toLowerCase();
        i.style.display = name.includes(q) ? "block" : "none";
    });
}

function filterByCat(cat, btn) {
    document.getElementById('viewLabel').innerText = cat + " Products";
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const items = document.querySelectorAll('.product-card-wrapper');
    items.forEach(i => i.style.display = (cat === 'All' || i.getAttribute('data-cat') === cat) ? "block" : "none");
}

function handleSort() {
    const grid = document.getElementById('productGrid');
    const items = Array.from(document.querySelectorAll('.product-card-wrapper'));
    const mode = document.getElementById('priceSort').value;
    if (mode === 'default') return;
    items.sort((a, b) => {
        const pA = parseInt(a.getAttribute('data-price'));
        const pB = parseInt(b.getAttribute('data-price'));
        return mode === 'low' ? pA - pB : pB - pA;
    });
    items.forEach(i => grid.appendChild(i));
}

// Cart Logic
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

function updateCart() {
    document.getElementById('cartCount').innerText = cart.length;
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cartTotal').innerText = "₹" + total.toLocaleString('en-IN');
    document.getElementById('cartList').innerHTML = cart.map((i, idx) => `
        <div class="d-flex justify-content-between border-bottom mb-2 pb-1 small">
            <span>${i.name}</span>
            <b>₹${i.price}</b>
            <i class="bi bi-trash text-danger pointer" onclick="cart.splice(${idx},1);updateCart()"></i>
        </div>
    `).join('');
}

function checkAuthAndPay() {
    if (!user) return showLogin();
    if (cart.length === 0) return alert("Cart is empty!");
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('modalUI').innerHTML = `
        <h5 class="fw-bold mb-3">Pay ₹${total.toLocaleString('en-IN')}</h5>
        <div class="pay-box"><input type="radio" name="p" checked> UPI (GPay/Paytm)</div>
        <div class="pay-box"><input type="radio" name="p"> Debit/Credit Card</div>
        <div class="pay-box"><input type="radio" name="p"> Cash on Delivery</div>
        <button class="btn btn-success w-100 p-3 mt-3 fw-bold" onclick="finishOrder()">PLACE ORDER</button>`;
    loginModal.show();
}

function finishOrder() {
    const ui = document.getElementById('modalUI');
    ui.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-success"></div><h4 class="mt-3">Processing...</h4></div>`;
    setTimeout(() => {
        ui.innerHTML = `<div class="text-center p-5"><i class="bi bi-check-circle-fill text-success fs-1"></i><h2 class="mt-3">Order Success!</h2><p>Thank you, ${user.name}.</p><button class="btn btn-dark mt-3" data-bs-dismiss="modal" onclick="cart=[];updateCart()">Done</button></div>`;
    }, 2000);
}

updateAuthUI();