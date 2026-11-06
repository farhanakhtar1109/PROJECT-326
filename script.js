// ======================================
// DINEEASE - SMART PRE-ORDERING WEBSITE
// ======================================

// ---------- DATA ----------
const restaurants = [
  {
    id: 1, name: "The Urban Kitchen", state: "Punjab", city: "Ludhiana",
    type: "North Indian & Continental", rating: "4.8",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700"
  },
  {
    id: 2, name: "Royal Spice", state: "Punjab", city: "Amritsar",
    type: "Punjabi & Indian", rating: "4.7",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700"
  },
  {
    id: 3, name: "Food Junction", state: "Punjab", city: "Jalandhar",
    type: "Fast Food & Chinese", rating: "4.6",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700"
  },
  {
    id: 4, name: "The Delhi Diner", state: "Delhi", city: "New Delhi",
    type: "Multi-Cuisine", rating: "4.8",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700"
  },
  {
    id: 5, name: "Mumbai Masala", state: "Maharashtra", city: "Mumbai",
    type: "Indian & Street Food", rating: "4.5",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700"
  },
  {
    id: 6, name: "Pune Food Studio", state: "Maharashtra", city: "Pune",
    type: "Continental & Italian", rating: "4.7",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700"
  },
  {
    id: 7, name: "Noida Food House", state: "Uttar Pradesh", city: "Noida",
    type: "Indian & Chinese", rating: "4.5",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?w=700"
  },
  {
    id: 8, name: "Jaipur Royal Table", state: "Rajasthan", city: "Jaipur",
    type: "Rajasthani & Indian", rating: "4.8",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700"
  }
];

const menu = [
  {
    id: 101, name: "Paneer Butter Masala", category: "Main Course",
    price: 260, description: "Creamy paneer curry with Indian spices.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700"
  },
  {
    id: 102, name: "Veg Biryani", category: "Rice",
    price: 190, description: "Aromatic rice with fresh vegetables.",
    image: "https://www.cookingcarnival.com/wp-content/uploads/2025/09/Vegetable-Dum-Biryani-5.jpg?w=700"
  },
  {
    id: 103, name: "Butter Chicken", category: "Main Course",
    price: 320, description: "Classic creamy chicken curry.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700"
  },
  {
    id: 104, name: "Margherita Pizza", category: "Pizza",
    price: 280, description: "Cheese, tomato and fresh basil.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700"
  },
  {
    id: 105, name: "White Sauce Pasta", category: "Pasta",
    price: 230, description: "Creamy pasta with herbs.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700"
  },
  {
    id: 106, name: "Veg Burger", category: "Fast Food",
    price: 150, description: "Crispy patty with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700"
  },
  {
    id: 107, name: "Chocolate Brownie", category: "Dessert",
    price: 120, description: "Rich chocolate dessert.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700"
  },
  {
    id: 108, name: "Cold Coffee", category: "Beverages",
    price: 110, description: "Chilled coffee with creamy texture.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700"
  },
  {
    id: 109, name: "French Fries", category: "Snacks",
    price: 100, description: "Golden crispy salted fries.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700"
  }
];

// ---------- APP STATE ----------
let selectedRestaurant = null;
let cart = JSON.parse(localStorage.getItem("dineEaseCart")) || [];
let currentAuthMode = "login";

// ---------- HELPERS ----------
const $ = (id) => document.getElementById(id);

function money(amount) {
  return "₹" + Number(amount).toFixed(2);
}

function saveCart() {
  localStorage.setItem("dineEaseCart", JSON.stringify(cart));
  updateCartCount();
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getTax() {
  return getSubtotal() * 0.05;
}

function getOrderType() {
  return document.querySelector('input[name="orderType"]:checked')?.value || "preorder";
}

// ---------- PAGE NAVIGATION ----------
function showPage(pageId) {
  const target = $(pageId);
  if (!target || !target.classList.contains("page")) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  target.classList.add("active");

  document.querySelectorAll("[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  if (pageId === "cart") renderCart();
  if (pageId === "menu") renderMenu();
  if (pageId === "orders") renderOrders();
  if (pageId === "checkout") renderCheckoutSummary();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", function(event) {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    event.preventDefault();
    showPage(pageButton.dataset.page);
  }
});

// ---------- STATE AND CITY FILTER ----------
const locations = {
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
  "Delhi": ["New Delhi"],
  "Maharashtra": ["Mumbai", "Pune"],
  "Uttar Pradesh": ["Noida"],
  "Rajasthan": ["Jaipur"]
};

function loadStates() {
  const stateSelect = $("stateSelect");

  Object.keys(locations).forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}

$("stateSelect").addEventListener("change", function() {
  const citySelect = $("citySelect");
  citySelect.innerHTML = '<option value="">Choose City</option>';

  const cities = locations[this.value] || [];

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  citySelect.disabled = cities.length === 0;
  $("restaurantGrid").innerHTML =
    '<p class="empty-message">Now select a city to see restaurants.</p>';
});

$("citySelect").addEventListener("change", function() {
  renderRestaurants($("stateSelect").value, this.value);
});

function renderRestaurants(state, city) {
  const grid = $("restaurantGrid");

  const results = restaurants.filter(restaurant =>
    restaurant.state === state && restaurant.city === city
  );

  if (!results.length) {
    grid.innerHTML = '<p class="empty-message">No demo restaurants found in this city.</p>';
    return;
  }

  grid.innerHTML = results.map(restaurant => `
    <article class="restaurant-card">
      <img src="${restaurant.image}" alt="${restaurant.name}">
      <div class="restaurant-info">
        <h3>${restaurant.name}</h3>
        <p>${restaurant.type} · ${restaurant.city}</p>
        <div class="card-bottom">
          <span class="price">★ ${restaurant.rating}</span>
          <button class="small-btn" data-restaurant="${restaurant.id}">View Menu</button>
        </div>
      </div>
    </article>
  `).join("");
}

$("restaurantGrid").addEventListener("click", function(event) {
  const button = event.target.closest("[data-restaurant]");
  if (!button) return;

  const restaurant = restaurants.find(item =>
    item.id === Number(button.dataset.restaurant)
  );

  if (cart.length && selectedRestaurant && selectedRestaurant.id !== restaurant.id) {
    const confirmed = confirm(
      "Your cart has items from another restaurant. Clear the cart and continue?"
    );
    if (!confirmed) return;

    cart = [];
    saveCart();
  }

  selectedRestaurant = restaurant;
  $("menuRestaurantName").textContent =
    "Menu from " + restaurant.name + " · " + restaurant.city;

  renderMenu();
  showPage("menu");
});

// ---------- MENU ----------
function renderMenu() {
  const grid = $("menuGrid");

  if (selectedRestaurant) {
    $("menuRestaurantName").textContent =
      "Menu from " + selectedRestaurant.name + " · " + selectedRestaurant.city;
  }

  grid.innerHTML = menu.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}">
      <div class="food-info">
        <span class="eyebrow">${food.category}</span>
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <div class="card-bottom">
          <span class="price">${money(food.price)}</span>
          <button class="small-btn" data-add="${food.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
}

$("menuGrid").addEventListener("click", function(event) {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const food = menu.find(item => item.id === Number(button.dataset.add));
  if (!food) return;

  const existing = cart.find(item => item.id === food.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...food, quantity: 1 });
  }

  saveCart();
  showToast(food.name + " added to cart!");
});

// ---------- CART ----------
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("cartCount").textContent = count;
}

function renderCart() {
  const container = $("cartItems");

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-message">
        <h3>Your cart is empty!</h3>
        <p>Add some delicious food to continue.</p>
        <button class="primary-btn" data-page="restaurants">Explore Restaurants</button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>${money(item.price)} each</p>
          <div class="quantity-controls">
            <button data-decrease="${item.id}">−</button>
            <strong>${item.quantity}</strong>
            <button data-increase="${item.id}">+</button>
          </div>
        </div>
        <strong class="price">${money(item.price * item.quantity)}</strong>
        <button class="remove-btn" data-remove="${item.id}">Remove</button>
      </article>
    `).join("");
  }

  const subtotal = getSubtotal();
  const tax = getTax();

  $("cartSubtotal").textContent = money(subtotal);
  $("cartTax").textContent = money(tax);
  $("cartTotal").textContent = money(subtotal + tax);
}

$("cartItems").addEventListener("click", function(event) {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");

  if (increase) {
    const item = cart.find(i => i.id === Number(increase.dataset.increase));
    if (item) item.quantity++;
  }

  if (decrease) {
    const item = cart.find(i => i.id === Number(decrease.dataset.decrease));
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== item.id);
      }
    }
  }

  if (remove) {
    const id = Number(remove.dataset.remove);
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  renderCart();
});

$("checkoutBtn").addEventListener("click", function() {
  if (!cart.length) {
    showToast("Your cart is empty!");
    return;
  }

  showPage("checkout");
});

// ---------- CHECKOUT ORDER TYPE ----------
document.querySelectorAll('input[name="orderType"]').forEach(radio => {
  radio.addEventListener("change", function() {
    updateOrderTypeFields();
    renderCheckoutSummary();
  });
});

function updateOrderTypeFields() {
  const type = getOrderType();

  $("preorderFields").classList.toggle("hidden", type !== "preorder");
  $("addressFields").classList.toggle("hidden", type !== "delivery");
  $("deliveryFee").textContent = type === "delivery" ? money(40) : money(0);
}

function renderCheckoutSummary() {
  const container = $("checkoutItems");
  const subtotal = getSubtotal();
  const tax = getTax();
  const delivery = getOrderType() === "delivery" ? 40 : 0;

  container.innerHTML = cart.map(item => `
    <div class="summary-line">
      <span>${item.name} × ${item.quantity}</span>
      <strong>${money(item.price * item.quantity)}</strong>
    </div>
  `).join("");

  $("checkoutSubtotal").textContent = money(subtotal);
  $("checkoutTax").textContent = money(tax);
  $("deliveryFee").textContent = money(delivery);
  $("checkoutTotal").textContent = money(subtotal + tax + delivery);
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function validatePreorder() {
  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const guests = $("guestCount").value;
  const date = $("arrivalDate").value;
  const time = $("arrivalTime").value;

  if (!name || !phone || !guests || !date || !time) {
    showToast("Please fill all required pre-order details.");
    return false;
  }

  if (!validatePhone(phone)) {
    showToast("Enter a valid 10-digit mobile number.");
    return false;
  }

  const selectedDateTime = new Date(date + "T" + time);
  if (selectedDateTime <= new Date()) {
    showToast("Choose a future arrival date and time.");
    return false;
  }

  return true;
}

function validateDelivery() {
  const name = $("deliveryName").value.trim();
  const phone = $("deliveryPhone").value.trim();
  const address = $("deliveryAddress").value.trim();
  const city = $("deliveryCity").value.trim();
  const pin = $("deliveryPincode").value.trim();

  if (!name || !phone || !address || !city || !pin) {
    showToast("Please complete all required delivery details.");
    return false;
  }

  if (!validatePhone(phone)) {
    showToast("Enter a valid 10-digit mobile number.");
    return false;
  }

  if (!/^\d{6}$/.test(pin)) {
    showToast("Enter a valid 6-digit PIN code.");
    return false;
  }

  return true;
}

// ---------- PLACE ORDER ----------
$("placeOrderBtn").addEventListener("click", function() {
  if (!cart.length) {
    showToast("Your cart is empty!");
    showPage("restaurants");
    return;
  }

  const type = getOrderType();

  if (type === "preorder" && !validatePreorder()) return;
  if (type === "delivery" && !validateDelivery()) return;

  const payment = document.querySelector('input[name="payment"]:checked').value;

  let customerDetails = {};

  if (type === "preorder") {
    customerDetails = {
      name: $("customerName").value.trim(),
      phone: $("customerPhone").value.trim(),
      email: $("customerEmail").value.trim(),
      guests: $("guestCount").value,
      arrivalDate: $("arrivalDate").value,
      arrivalTime: $("arrivalTime").value,
      seating: $("seating").value,
      occasion: $("occasion").value,
      dietPreference: $("dietPreference").value,
      allergyInfo: $("allergyInfo").value.trim(),
      specialInstructions: $("specialInstructions").value.trim()
    };
  } else {
    customerDetails = {
      name: $("deliveryName").value.trim(),
      phone: $("deliveryPhone").value.trim(),
      address: $("deliveryAddress").value.trim(),
      city: $("deliveryCity").value.trim(),
      pincode: $("deliveryPincode").value.trim(),
      landmark: $("deliveryLandmark").value.trim()
    };
  }

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = type === "delivery" ? 40 : 0;

  const order = {
    orderId: "DE" + Date.now().toString().slice(-7),
    restaurant: selectedRestaurant ? selectedRestaurant.name : "DineEase Demo Restaurant",
    type: type === "preorder" ? "Restaurant Pre-Order" : "Home Delivery",
    items: [...cart],
    customer: customerDetails,
    payment: payment,
    subtotal: subtotal,
    tax: tax,
    deliveryFee: deliveryFee,
    total: subtotal + tax + deliveryFee,
    status: "Confirmed",
    createdAt: new Date().toLocaleString()
  };

  const orders = JSON.parse(localStorage.getItem("dineEaseOrders")) || [];
  orders.unshift(order);
  localStorage.setItem("dineEaseOrders", JSON.stringify(orders));

  cart = [];
  saveCart();

  showToast("Your order has been confirmed!");
  showPage("orders");
});

// ---------- LOGIN AND CREATE ACCOUNT ----------
$("loginTab").addEventListener("click", () => setAuthMode("login"));
$("signupTab").addEventListener("click", () => setAuthMode("signup"));

function setAuthMode(mode) {
  currentAuthMode = mode;

  $("loginTab").classList.toggle("active", mode === "login");
  $("signupTab").classList.toggle("active", mode === "signup");

  $("authName").classList.toggle("hidden", mode !== "signup");
  $("authNameLabel").classList.toggle("hidden", mode !== "signup");

  $("authName").required = mode === "signup";
  $("authSubmit").textContent = mode === "signup" ? "Create Account" : "Login";
  $("authMessage").textContent = "";
}

$("authForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = $("authName").value.trim();
  const email = $("authEmail").value.trim().toLowerCase();
  const password = $("authPassword").value;

  const users = JSON.parse(localStorage.getItem("dineEaseUsers")) || [];

  if (currentAuthMode === "signup") {
    if (users.some(user => user.email === email)) {
      $("authMessage").textContent = "An account with this email already exists.";
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("dineEaseUsers", JSON.stringify(users));
    $("authMessage").textContent = "Account created successfully! You can now login.";
    setAuthMode("login");
    return;
  }

  const user = users.find(user =>
    user.email === email && user.password === password
  );

  if (!user) {
    $("authMessage").textContent = "Incorrect email or password.";
    return;
  }

  localStorage.setItem("dineEaseCurrentUser", JSON.stringify({
    name: user.name,
    email: user.email
  }));

  $("loginNav").textContent = "Account";
  $("authMessage").textContent = "Login successful!";
  showToast("Welcome to DineEase, " + user.name + "!");
  showPage("home");
});

// ---------- MY ORDERS ----------
function renderOrders() {
  const container = $("ordersList");
  const orders = JSON.parse(localStorage.getItem("dineEaseOrders")) || [];

  if (!orders.length) {
    container.innerHTML = `
      <div class="empty-message">
        <h3>No orders yet</h3>
        <p>Your confirmed orders will appear here.</p>
        <button class="primary-btn" data-page="restaurants">Explore Restaurants</button>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const customer = order.customer || {};

    let extraDetails = "";

    if (order.type === "Restaurant Pre-Order") {
      extraDetails = `
        <p><strong>Customer:</strong> ${escapeHTML(customer.name)}</p>
        <p><strong>Phone:</strong> ${escapeHTML(customer.phone)}</p>
        <p><strong>Guests:</strong> ${escapeHTML(customer.guests)}</p>
        <p><strong>Arrival:</strong> ${escapeHTML(customer.arrivalDate)} at ${escapeHTML(customer.arrivalTime)}</p>
        <p><strong>Seating:</strong> ${escapeHTML(customer.seating)}</p>
        <p><strong>Occasion:</strong> ${escapeHTML(customer.occasion)}</p>
        <p><strong>Special Instructions:</strong> ${escapeHTML(customer.specialInstructions || "None")}</p>
      `;
    } else {
      extraDetails = `
        <p><strong>Customer:</strong> ${escapeHTML(customer.name)}</p>
        <p><strong>Phone:</strong> ${escapeHTML(customer.phone)}</p>
        <p><strong>Address:</strong> ${escapeHTML(customer.address)}, ${escapeHTML(customer.city)} - ${escapeHTML(customer.pincode)}</p>
      `;
    }

    const itemNames = (order.items || []).map(item =>
      `${escapeHTML(item.name)} × ${item.quantity}`
    ).join(", ");

    return `
      <article class="order-card">
        <h3>Order #${escapeHTML(order.orderId)}</h3>
        <p><strong>Restaurant:</strong> ${escapeHTML(order.restaurant)}</p>
        <p><strong>Order Type:</strong> ${escapeHTML(order.type)}</p>
        <p><strong>Items:</strong> ${itemNames}</p>
        ${extraDetails}
        <p><strong>Payment:</strong> ${escapeHTML(order.payment)}</p>
        <p><strong>Total:</strong> ${money(order.total)}</p>
        <p><strong>Placed:</strong> ${escapeHTML(order.createdAt)}</p>
        <span class="order-status">${escapeHTML(order.status)}</span>
      </article>
    `;
  }).join("");
}

// Basic protection when showing customer-entered text inside HTML
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// ---------- INITIALIZE ----------
loadStates();
updateCartCount();
renderMenu();
updateOrderTypeFields();
setAuthMode("login");

const currentUser = JSON.parse(localStorage.getItem("dineEaseCurrentUser"));
if (currentUser) {
  $("loginNav").textContent = "Account";
}