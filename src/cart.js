document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "techtomiCart";

  const cartIcon = document.getElementById("cart-icon");
  const cartPanel = document.getElementById("cart-panel");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const cartOrderBtn = document.getElementById("cart-order-btn");
  const cartCloseBtn = document.getElementById("cart-close-btn");

  /* Betöltéskor ne jelenjen meg a kosár 😭 */
  if (cartPanel) {
    cartPanel.style.display = "none";
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function formatFt(num) {
    return num.toLocaleString("hu-HU") + " Ft";
  }

  function renderCart() {
    const cart = loadCart();
    const itemsEl = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const countEl = document.getElementById("cart-count");

    if (!itemsEl || !totalEl || !countEl) return;

    itemsEl.innerHTML = "";

    if (cart.length === 0) {
      itemsEl.innerHTML = '<p id="cart-empty-text">A kosár üres.</p>';
      totalEl.textContent = "0 Ft";
      countEl.textContent = "0";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatFt(item.price)}</div>
        </div>
        <button class="cart-remove" data-index="${index}">X</button>
      `;
      itemsEl.appendChild(row);
    });

    totalEl.textContent = formatFt(total);
    countEl.textContent = String(cart.length);
  }

  function addItem(name, price) {
    const cart = loadCart();
    cart.push({ name, price });
    saveCart(cart);
    renderCart();
    alert(name + " a kosárba került.");
  }

  // Kosár ikon / panel
  const icon = cartIcon;
  const panel = cartPanel;
  const closeBtn = cartCloseBtn;
  const orderBtn = cartOrderBtn;

  if (icon && panel) {
    icon.addEventListener("click", () => {
      panel.style.display = panel.style.display === "flex" ? "none" : "flex";
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener("click", () => {
      panel.style.display = "none";
    });
  }

  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      const cart = loadCart();
      if (cart.length === 0) {
        alert("A kosár üres, nincs mit megrendelni.");
        return;
      }
      alert("Sikeres megrendelés! Köszönjük a vásárlást.");
      saveCart([]);
      renderCart();
    });
  }

  // Törlés a kosárból
  const itemsEl = cartItemsContainer;
  if (itemsEl) {
    itemsEl.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("cart-remove")) {
        const index = Number(target.getAttribute("data-index"));
        const cart = loadCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      }
    });
  }

  // "Kosárba teszem" gombok
  const addButtons = document.querySelectorAll("[data-add-to-cart]");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const name = this.dataset.name;
      const price = parseInt(this.dataset.price, 10) || 0;
      if (!name || !price) {
        alert("Hiba: hiányzik a termék neve vagy ára.");
        return;
      }
      addItem(name, price);
    });
  });

  renderCart();
});
