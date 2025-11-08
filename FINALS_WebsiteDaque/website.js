/* 🛒 Add to Cart System */
let cart = [];
let cartCount = 0;

/* Add item to cart */
function addToCart(name = "Product", price = 10) {
  // Check if item already exists
  let existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartCount();
  updateCart();
}

/* Update total item count (sum of quantities) */
function updateCartCount() {
  cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = cartCount;
}

/* Update cart display */
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div class="cart-controls">
          <button onclick="decreaseQuantity(${index})">➖</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">➕</button>
          <span>₱${(item.price * item.quantity).toLocaleString()}</span>
          <button class="remove-btn" onclick="removeItem(${index})">❌</button>
        </div>
      </div>
    `;
  });

  document.getElementById("cart-total").innerText = "₱" + total.toLocaleString();
}

/* Increase quantity */
function increaseQuantity(index) {
  cart[index].quantity++;
  updateCart();
  updateCartCount();
}

/* Decrease quantity */
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    // Optional: confirm before removing
    if (confirm("Remove this item from cart?")) {
      cart.splice(index, 1);
    }
  }
  updateCart();
  updateCartCount();
}

/* Remove item completely */
function removeItem(index) {
  if (confirm("Are you sure you want to remove this item?")) {
    cart.splice(index, 1);
    updateCart();
    updateCartCount();
  }
}

/* Open / Close Cart Panel */
function openCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}



/*responsive design*/
const items = document.querySelectorAll('.menu, .info-section');

function revealOnScroll() {
  items.forEach(item => {
    let position = item.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;

    if (position < windowHeight - 100) {
      item.classList.add('show');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger on load

 function toggleMenu() {
    const navMenu = document.querySelector('nav ul');
    navMenu.classList.toggle('show');
  }


// Toggle main mobile menu
function toggleMenu() {
    document.querySelector('nav ul').classList.toggle('show');
  }

// Toggle dropdowns in mobile view
document.querySelectorAll('.dropdown > .dropbtn').forEach(btn => {
    btn.addEventListener('click', (e) => {

      // Prevent link navigation
      e.preventDefault();
      
      // Close other open dropdowns
      document.querySelectorAll('.dropdown').forEach(drop => {
        if (drop !== btn.parentElement) {
          drop.classList.remove('open');
        }
      });

      // Toggle current dropdown
      btn.parentElement.classList.toggle('open');
    });
  });