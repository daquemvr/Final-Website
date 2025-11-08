// ======== CART SYSTEM ========

// Select elements
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartBtn = document.querySelector(".cart-btn");



// Cart data
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======== FUNCTIONS ========

// Open & Close Cart
function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
  renderCart();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}

closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ======== Add to Cart ========
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const image = btn.dataset.image;

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, image, qty: 1 });
    }

    saveCart();
    openCart();
  });
});

// 🛒 Open cart when clicking the cart icon
cartBtn.addEventListener("click", openCart);


// ======== Render Cart ========
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>₱${item.price.toLocaleString()}</p>
        <div class="qty-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.qty}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-index="${index}">x</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString();

  // Add event listeners
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(btn.dataset.index, 1);
      saveCart();
    });
  });

  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      cart[btn.dataset.index].qty++;
      saveCart();
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = cart[btn.dataset.index];
      if (item.qty > 1) item.qty--;
      else cart.splice(btn.dataset.index, 1);
      saveCart();
    });
  });
}

// ======== Save & Refresh ========
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ======== Checkout ========
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cart = [];
  saveCart();
  closeCart();
});

// Initial render
renderCart();


const cartCount = document.getElementById("cart-count");

// update renderCart function
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0";
    cartCount.textContent = "0";
    cartCount.classList.remove("show");
    return;
  }

  let total = 0;
  let itemCount = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    itemCount += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>₱${item.price.toLocaleString()}</p>
        <div class="qty-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.qty}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-index="${index}">x</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString();
  cartCount.textContent = itemCount;
  cartCount.classList.add("show");

  // Button listeners
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(btn.dataset.index, 1);
      saveCart();
    });
  });

  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      cart[btn.dataset.index].qty++;
      saveCart();
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = cart[btn.dataset.index];
      if (item.qty > 1) item.qty--;
      else cart.splice(btn.dataset.index, 1);
      saveCart();
    });
  });
}
