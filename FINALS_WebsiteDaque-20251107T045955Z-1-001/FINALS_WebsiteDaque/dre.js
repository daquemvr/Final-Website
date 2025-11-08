// === 🛒 ADD TO CART SYSTEM ===
// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('dre_cart') || '[]');

// Selectors
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartBtn = document.getElementById('cart-btn');
const viewCartBtn = document.getElementById('view-cart-btn');
const cartModal = document.getElementById('cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const closeButtons = document.querySelectorAll('.close');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const cartPreview = document.getElementById('cart-preview');
const cartPreviewItems = document.getElementById('cart-preview-items');
const cartPreviewTotal = document.getElementById('cart-preview-total');

let cartPreviewTimeout;

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    convertBuyNowToAddCart();
    
    // Initialize preview close button
    document.querySelector('.close-preview')?.addEventListener('click', () => {
        cartPreview.style.display = 'none';
    });

    // Initialize continue shopping button
    document.getElementById('continue-shopping')?.addEventListener('click', () => {
        cartPreview.style.display = 'none';
    });
});

// Helper function to find product image
function findProductImage(productName) {
  const productElement = Array.from(document.querySelectorAll('.product1')).find(
    el => el.querySelector('h3').textContent.trim() === productName
  );
  return productElement ? productElement.querySelector('img').src : '';
}

// Add to Cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productElement = button.closest('.product1');
    const name = productElement.querySelector('h3').textContent.trim();
    const priceText = productElement.querySelector('.price').textContent.trim();
    const price = parseFloat(priceText.replace(/[₱,]/g, ''));
    const image = productElement.querySelector('img').src;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1, image });
    }

    updateCartDisplay();
    showCartPreview();
  });
});

// Update Cart Count + Total
function updateCartDisplay() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotalElement.textContent = `Total: ₱${totalPrice.toLocaleString()}`;
  
  // Save to localStorage
  localStorage.setItem('dre_cart', JSON.stringify(cart));
  
  // Update cart modal if it's open
  if (cartModal.style.display === 'block') {
    renderCartItems();
  }
}

// Render Cart Items in Modal and Preview
function renderCartItems(container = cartItemsContainer, isPreview = false) {
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;">Your cart is empty 🛒</p>';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add(isPreview ? 'cart-preview-item' : 'cart-item');
    
    const imgSrc = item.image || findProductImage(item.name);
    div.innerHTML = `
      <img src="${imgSrc}" alt="${item.name}" class="cart-item-image">
      <div class="cart-preview-item-info">
        <p class="cart-preview-item-name">${item.name}</p>
        <p class="cart-item-price">₱${item.price.toLocaleString()}</p>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-name="${item.name}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-name="${item.name}">+</button>
          <button class="remove-item" data-name="${item.name}">×</button>
        </div>
        <p class="item-total">Subtotal: ₱${(item.price * item.quantity).toLocaleString()}</p>
      </div>
    `;
    container.appendChild(div);
    
    // Add event listeners for quantity controls
    const minusBtn = div.querySelector('.minus');
    const plusBtn = div.querySelector('.plus');
    const removeBtn = div.querySelector('.remove-item');
    
    minusBtn.addEventListener('click', () => updateQuantity(item.name, -1));
    plusBtn.addEventListener('click', () => updateQuantity(item.name, 1));
    removeBtn.addEventListener('click', () => removeFromCart(item.name));
  });

  // Add remove functionality
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      cart = cart.filter(item => item.name !== name);
      updateCartDisplay();
      renderCartItems();
    });
  });
}

// Open Cart Preview when clicking cart icon
cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showCartPreview();
});

// View Cart button opens full cart modal
if (viewCartBtn) {
  viewCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCartItems();
  });
}

// Close Modal Buttons
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

// Clear Cart
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartDisplay();
    renderCartItems();
  });
}

// Checkout
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Thank you for your purchase! 🛍️');
    cart = [];
    updateCartDisplay();
    renderCartItems();
    cartModal.style.display = 'none';
  });
}

// Update item quantity
function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            if (confirm('Remove this item from cart?')) {
                removeFromCart(itemName);
                return;
            } else {
                item.quantity = 1;
            }
        }
    }
    // Save to localStorage
    localStorage.setItem('dre_cart', JSON.stringify(cart));
    
    // Update displays
    updateCartDisplay();
    
    // Update specific item's display
    const quantityDisplays = document.querySelectorAll(`[data-quantity="${itemName}"]`);
    quantityDisplays.forEach(display => {
        display.textContent = item.quantity;
    });
    
    // Update subtotals
    const subtotalDisplays = document.querySelectorAll(`[data-subtotal="${itemName}"]`);
    subtotalDisplays.forEach(display => {
        display.textContent = `Subtotal: ₱${(item.price * item.quantity).toLocaleString()}`;
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartPreviewTotal.textContent = `Total: ₱${total.toLocaleString()}`;
}

// Remove item from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
    showCartPreview();
}

// Show Cart Preview
function showCartPreview() {
    if (!cartPreview || !cartPreviewItems) return;
    
    // If already visible, hide it
    if (cartPreview.style.display === 'flex') {
        cartPreview.style.opacity = '0';
        cartPreview.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            cartPreview.style.display = 'none';
        }, 300);
        return;
    }
    
    // Show preview and render items
    cartPreview.style.display = 'flex';
    renderCartItems(cartPreviewItems, true);
    
    // Update preview total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartPreviewTotal.textContent = `Total: ₱${total.toLocaleString()}`;
    
    // Show animation
    setTimeout(() => {
        cartPreview.style.opacity = '1';
        cartPreview.style.transform = 'translateY(0)';
    }, 10);

    // Add click outside listener
    const handleClickOutside = (e) => {
        if (!cartPreview.contains(e.target) && e.target !== cartBtn && !cartBtn.contains(e.target)) {
            cartPreview.style.opacity = '0';
            cartPreview.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                cartPreview.style.display = 'none';
            }, 300);
            document.removeEventListener('click', handleClickOutside);
        }
    };
    
    // Wait a bit before adding the click outside listener
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
}

// Close preview when clicking close button
document.getElementById('close-preview')?.addEventListener('click', () => {
  document.getElementById('cart-preview').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const cartPreview = document.getElementById('cart-preview');
  if (e.target === cartModal) {
    cartModal.style.display = 'none';
  }
  if (e.target === cartPreview) {
    cartPreview.style.display = 'none';
  }
});

// Convert Buy Now buttons to Add to Cart
function convertBuyNowToAddCart() {
  const products = document.querySelectorAll('.product1');
  
  products.forEach(product => {
    // Check if product already has an Add to Cart button
    if (!product.querySelector('.add-to-cart')) {
      const buyNowBtn = product.querySelector('.buy-btn');
      if (buyNowBtn && buyNowBtn.textContent === 'Buy Now') {
        // Create new Add to Cart button
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart';
        addToCartBtn.textContent = '🛒 Add to Cart';
        
        // Add click event listener
        addToCartBtn.addEventListener('click', () => {
          const name = product.querySelector('h3').textContent.trim();
          const priceText = product.querySelector('.price').textContent.trim();
          const price = parseFloat(priceText.replace(/[₱,]/g, ''));

          const existingItem = cart.find(item => item.name === name);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({ name, price, quantity: 1 });
          }

          updateCartDisplay();
        });

        // Insert Add to Cart button before Buy Now
        buyNowBtn.parentNode.insertBefore(addToCartBtn, buyNowBtn);
        buyNowBtn.remove(); // Remove Buy Now button
      }
    }
  });
}
