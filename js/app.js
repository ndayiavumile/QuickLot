const catalog = window.QuickLotCatalog;
let products = catalog.loadProducts();

const CART_KEY = "quicklotCart";
const WISHLIST_KEY = "quicklotWishlist";
const RECENT_KEY = "quicklotRecent";
const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY = 75;

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const resultsSummary = document.getElementById("resultsSummary");
const sortSelect = document.getElementById("sortSelect");
const categoryButtons = document.querySelectorAll(".category-chip");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartToggle = document.getElementById("cartToggle");
const heroCartButton = document.getElementById("heroCartButton");
const cartClose = document.getElementById("cartClose");
const cartList = document.getElementById("cartList");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const cartTotal = document.getElementById("cartTotal");
const shippingFill = document.getElementById("shippingFill");
const shippingMessage = document.getElementById("shippingMessage");
const wishlistGrid = document.getElementById("wishlistGrid");
const recentGrid = document.getElementById("recentGrid");
const mobileCartButton = document.getElementById("mobileCartButton");
const mobileCartSummary = document.getElementById("mobileCartSummary");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");
const productModal = document.getElementById("productModal");
const productModalBackdrop = document.getElementById("productModalBackdrop");
const productModalClose = document.getElementById("productModalClose");
const productModalVisual = document.getElementById("productModalVisual");
const productModalBadge = document.getElementById("productModalBadge");
const productModalTitle = document.getElementById("productModalTitle");
const productModalDescription = document.getElementById("productModalDescription");
const productModalRating = document.getElementById("productModalRating");
const productModalReviews = document.getElementById("productModalReviews");
const productModalShipping = document.getElementById("productModalShipping");
const productModalPrice = document.getElementById("productModalPrice");
const productModalOldPrice = document.getElementById("productModalOldPrice");
const productModalHighlights = document.getElementById("productModalHighlights");
const productModalAdd = document.getElementById("productModalAdd");
const productModalSave = document.getElementById("productModalSave");
const productModalDetails = document.getElementById("productModalDetails");

let activeCategory = "all";
let activeSort = "featured";
let cart = loadJSON(CART_KEY, []);
let wishlist = loadJSON(WISHLIST_KEY, []);
let recent = loadJSON(RECENT_KEY, []);
let activeModalProductId = null;

function loadJSON(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
        console.error(error);
        return fallback;
    }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(value) {
    return "R" + Number(value).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getProduct(productId) {
    return products.find((product) => product.id === productId) || null;
}

function syncCartWithProducts() {
    const productMap = new Map(products.map((product) => [product.id, product]));
    cart = cart.filter((item) => productMap.has(item.id)).map((item) => {
        const liveProduct = productMap.get(item.id);
        return {
            ...item,
            name: liveProduct.name,
            price: liveProduct.price
        };
    });
    saveJSON(CART_KEY, cart);
}

function getProductHighlights(product) {
    const categoryHighlights = {
        electronics: ["Fast dispatch available", "12-month marketplace warranty", "High-demand tech pick"],
        appliances: ["Ideal for kitchen upgrades", "Popular household essential", "Strong value in this price band"],
        gaming: ["Built for low-latency play", "Great gift option", "Popular with weekend buyers"],
        fashion: ["Everyday style staple", "Easy add-to-cart price point", "Works for travel and casual wear"],
        home: ["Helps refresh living spaces", "Good for apartments and family homes", "Consistent seller in home category"],
        beauty: ["Gift-ready and personal-care friendly", "Strong beauty bundle appeal", "Popular self-care pick"]
    };

    return categoryHighlights[product.category] || ["Marketplace favorite", "Fast-moving product", "Worth a closer look"];
}

function getFilteredProducts() {
    const query = (searchInput.value || "").trim().toLowerCase();

    return products.filter((product) => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const text = `${product.name} ${product.description} ${product.badge}`.toLowerCase();
        const matchesQuery = !query || text.includes(query);
        return matchesCategory && matchesQuery;
    });
}

function sortProducts(items) {
    const sorted = [...items];

    switch (activeSort) {
        case "price_low":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "price_high":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
            break;
        case "saving":
            sorted.sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price));
            break;
        default:
            sorted.sort((a, b) => products.findIndex((entry) => entry.id === a.id) - products.findIndex((entry) => entry.id === b.id));
            break;
    }

    return sorted;
}

function showToast(message) {
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.remove("is-hidden");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
        toast.classList.add("is-hidden");
    }, 2000);
}

function rememberViewed(productId) {
    recent = [productId, ...recent.filter((entry) => entry !== productId)].slice(0, 4);
    saveJSON(RECENT_KEY, recent);
    renderSavedSections();
}

function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter((entry) => entry !== productId);
        showToast("Removed from wishlist");
    } else {
        wishlist = [productId, ...wishlist.filter((entry) => entry !== productId)];
        showToast("Saved to wishlist");
    }

    saveJSON(WISHLIST_KEY, wishlist);
    renderProducts();
    renderSavedSections();
}

function renderProducts() {
    const filteredProducts = sortProducts(getFilteredProducts());
    productGrid.innerHTML = "";

    if (!filteredProducts.length) {
        productGrid.innerHTML = `<article class="product-card"><h3>No matches yet</h3><p>Try a different product name or change the category filter.</p></article>`;
        resultsSummary.textContent = "No products matched this search.";
        return;
    }

    resultsSummary.textContent = `Showing ${filteredProducts.length} of ${products.length} products.`;

    filteredProducts.forEach((product) => {
        const isSaved = wishlist.includes(product.id);
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-card__visual" style="--card-gradient: ${product.gradient};"></div>
            <div class="product-card__badge-row">
                <span class="product-badge">${product.badge}</span>
                <span class="save-badge">${product.save}</span>
            </div>
            <div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
            <div class="rating-row">
                <span>${product.rating} stars</span>
                <span>${product.reviews} reviews</span>
            </div>
            <div class="price-row">
                <div>
                    <strong>${formatPrice(product.price)}</strong>
                    <span>Was ${formatPrice(product.oldPrice)}</span>
                </div>
                <span>Ships in 24 hrs</span>
            </div>
            <div class="buy-row">
                <button class="inline-buy" type="button">Add to cart</button>
                <button class="quick-button ${isSaved ? "is-active" : ""}" type="button">${isSaved ? "Saved" : "Wishlist"}</button>
            </div>
        `;

        card.addEventListener("click", (event) => {
            if (event.target.closest("button")) {
                return;
            }
            rememberViewed(product.id);
            openProductModal(product.id);
        });

        card.querySelector(".inline-buy").addEventListener("click", () => addToCart(product.id));
        card.querySelector(".quick-button").addEventListener("click", () => toggleWishlist(product.id));
        productGrid.appendChild(card);
    });
}

function openProductModal(productId) {
    const product = getProduct(productId);
    if (!product || !productModal) {
        return;
    }

    activeModalProductId = product.id;
    rememberViewed(product.id);
    productModalVisual.style.setProperty("--card-gradient", product.gradient);
    productModalBadge.textContent = product.badge;
    productModalTitle.textContent = product.name;
    productModalDescription.textContent = product.description;
    productModalRating.textContent = `${product.rating} stars`;
    productModalReviews.textContent = `${product.reviews} reviews`;
    productModalShipping.textContent = "Ships in 24 hrs";
    productModalPrice.textContent = formatPrice(product.price);
    productModalOldPrice.textContent = `Was ${formatPrice(product.oldPrice)}`;
    productModalSave.textContent = wishlist.includes(product.id) ? "Saved" : "Wishlist";
    productModalSave.classList.toggle("is-active", wishlist.includes(product.id));
    if (productModalDetails) {
        productModalDetails.href = `product.html?id=${encodeURIComponent(product.id)}`;
    }
    productModalHighlights.innerHTML = getProductHighlights(product)
        .map((highlight) => `<span>${highlight}</span>`)
        .join("");

    productModal.classList.remove("is-hidden");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeProductModal() {
    if (!productModal) {
        return;
    }

    productModal.classList.add("is-hidden");
    productModal.setAttribute("aria-hidden", "true");
    activeModalProductId = null;
    if (cartDrawer.classList.contains("is-hidden")) {
        document.body.classList.remove("no-scroll");
    }
}

function buildSavedCard(productId, removeMode) {
    const product = getProduct(productId);
    if (!product) {
        return "";
    }

    return `
        <article class="saved-item">
            <div class="saved-item__visual" style="--card-gradient: ${product.gradient};"></div>
            <div class="saved-item__top">
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.badge}</p>
                </div>
                <strong>${formatPrice(product.price)}</strong>
            </div>
            <div class="saved-item__bottom">
                <span>${product.rating} stars</span>
                <span>${product.reviews} reviews</span>
            </div>
            <div class="saved-item__actions">
                <button class="inline-buy" type="button" data-add-id="${product.id}">Add</button>
                <button class="quick-button ${removeMode ? "is-active" : ""}" type="button" data-save-id="${product.id}">${removeMode ? "Remove" : "Keep"}</button>
            </div>
        </article>
    `;
}

function bindSavedButtons(container, removeMode) {
    container.querySelectorAll("[data-add-id]").forEach((button) => {
        button.addEventListener("click", () => addToCart(button.dataset.addId));
    });

    container.querySelectorAll("[data-save-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.dataset.saveId;
            if (removeMode) {
                toggleWishlist(productId);
                return;
            }

            rememberViewed(productId);
            showToast("Kept in recently viewed");
        });
    });
}

function renderSavedSections() {
    const wishlistItems = wishlist.map((productId) => buildSavedCard(productId, true)).filter(Boolean);
    const recentItems = recent.map((productId) => buildSavedCard(productId, false)).filter(Boolean);

    wishlistGrid.innerHTML = wishlistItems.length ? wishlistItems.join("") : `<p class="empty-cart">Wishlist items will appear here when products are saved.</p>`;
    recentGrid.innerHTML = recentItems.length ? recentItems.join("") : `<p class="empty-cart">Recently viewed products will appear here as you browse.</p>`;

    bindSavedButtons(wishlistGrid, true);
    bindSavedButtons(recentGrid, false);
}

function addToCart(productId) {
    const product = getProduct(productId);
    if (!product) {
        return;
    }

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveJSON(CART_KEY, cart);
    rememberViewed(productId);
    updateCart();
    openCart();
    showToast(`${product.name} added to cart`);
}

function changeQuantity(productId, amount) {
    const item = cart.find((entry) => entry.id === productId);
    if (!item) {
        return;
    }

    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter((entry) => entry.id !== productId);
    }

    saveJSON(CART_KEY, cart);
    updateCart();
}

function updateCart() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY;
    const total = subtotal + delivery;
    const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
    const amountLeft = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

    cartCount.textContent = String(itemCount);
    mobileCartSummary.textContent = itemCount === 0 ? "0 items" : `${itemCount} item${itemCount === 1 ? "" : "s"} - ${formatPrice(subtotal)}`;
    cartSubtotal.textContent = formatPrice(subtotal);
    cartDelivery.textContent = formatPrice(delivery);
    cartTotal.textContent = formatPrice(total);
    if (shippingFill) {
        shippingFill.style.width = `${progress}%`;
    }
    if (shippingMessage) {
        shippingMessage.textContent = amountLeft > 0
            ? `Add products worth ${formatPrice(amountLeft)} to unlock free delivery.`
            : "Free delivery unlocked on this basket.";
    }

    if (!cart.length) {
        cartList.innerHTML = `<p class="empty-cart">Your cart is empty. Add a few deals to get started.</p>`;
        return;
    }

    cartList.innerHTML = "";

    cart.forEach((item) => {
        const row = document.createElement("article");
        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item__top">
                <div>
                    <strong>${item.name}</strong>
                    <p>${formatPrice(item.price)} each</p>
                </div>
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
            <div class="cart-item__bottom">
                <div class="qty-controls">
                    <button type="button" aria-label="Remove one">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" aria-label="Add one">+</button>
                </div>
                <span>In stock</span>
            </div>
        `;

        const [minusButton, plusButton] = row.querySelectorAll(".qty-controls button");
        minusButton.addEventListener("click", () => changeQuantity(item.id, -1));
        plusButton.addEventListener("click", () => changeQuantity(item.id, 1));
        cartList.appendChild(row);
    });
}

function openCart() {
    cartDrawer.classList.remove("is-hidden");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeCart() {
    cartDrawer.classList.add("is-hidden");
    cartDrawer.setAttribute("aria-hidden", "true");
    if (productModal.classList.contains("is-hidden")) {
        document.body.classList.remove("no-scroll");
    }
}

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category || "all";
        categoryButtons.forEach((chip) => chip.classList.toggle("is-active", chip === button));
        renderProducts();
    });
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderProducts();
});

searchInput.addEventListener("input", renderProducts);

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        activeSort = sortSelect.value;
        renderProducts();
    });
}

cartToggle.addEventListener("click", openCart);
heroCartButton.addEventListener("click", openCart);
mobileCartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (!cart.length) {
            showToast("Add a few products first");
            return;
        }

        window.location.href = "checkout.html";
    });
}

if (productModalBackdrop) {
    productModalBackdrop.addEventListener("click", closeProductModal);
}

if (productModalClose) {
    productModalClose.addEventListener("click", closeProductModal);
}

if (productModalAdd) {
    productModalAdd.addEventListener("click", () => {
        if (!activeModalProductId) {
            return;
        }
        addToCart(activeModalProductId);
    });
}

if (productModalSave) {
    productModalSave.addEventListener("click", () => {
        if (!activeModalProductId) {
            return;
        }
        toggleWishlist(activeModalProductId);
        if (activeModalProductId) {
            productModalSave.textContent = wishlist.includes(activeModalProductId) ? "Saved" : "Wishlist";
            productModalSave.classList.toggle("is-active", wishlist.includes(activeModalProductId));
        }
    });
}

document.querySelectorAll("[data-product-id]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.productId));
});

renderProducts();
renderSavedSections();
syncCartWithProducts();
updateCart();

window.addEventListener("storage", (event) => {
    if (event.key === catalog.PRODUCTS_KEY) {
        products = catalog.loadProducts();
        syncCartWithProducts();
        renderProducts();
        renderSavedSections();
        updateCart();
        if (activeModalProductId && !getProduct(activeModalProductId)) {
            closeProductModal();
        }
    }
});
