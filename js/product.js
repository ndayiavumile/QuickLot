const CART_KEY = "quicklotCart";
const WISHLIST_KEY = "quicklotWishlist";
const catalog = window.QuickLotCatalog;
let products = catalog.loadProducts();

const productHeroVisual = document.getElementById("productHeroVisual");
const productHeroBadge = document.getElementById("productHeroBadge");
const productHeroTitle = document.getElementById("productHeroTitle");
const productHeroDescription = document.getElementById("productHeroDescription");
const productHeroRating = document.getElementById("productHeroRating");
const productHeroReviews = document.getElementById("productHeroReviews");
const productHeroShipping = document.getElementById("productHeroShipping");
const productHeroPrice = document.getElementById("productHeroPrice");
const productHeroOldPrice = document.getElementById("productHeroOldPrice");
const productHeroAdd = document.getElementById("productHeroAdd");
const productHeroSave = document.getElementById("productHeroSave");
const productHighlights = document.getElementById("productHighlights");
const productSpecs = document.getElementById("productSpecs");
const relatedProducts = document.getElementById("relatedProducts");
const toast = document.getElementById("toast");

let wishlist = loadJSON(WISHLIST_KEY, []);
let cart = loadJSON(CART_KEY, []);
let activeProduct = null;

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

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("is-hidden");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
        toast.classList.add("is-hidden");
    }, 2000);
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "p1";
}

function getHighlights(product) {
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

function getSpecs(product) {
    return [
        `Category: ${product.category.replace("_", " ")}`,
        `Buyer rating: ${product.rating} stars`,
        `Review count: ${product.reviews}`,
        `Saving: ${product.save}`,
        "Shipping: 24-hour dispatch available",
        "Returns: 30-day marketplace returns policy"
    ];
}

function addToCart(productId) {
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: activeProduct.id,
            name: activeProduct.name,
            price: activeProduct.price,
            quantity: 1
        });
    }
    saveJSON(CART_KEY, cart);
    showToast(`${activeProduct.name} added to cart`);
}

function toggleWishlist() {
    if (wishlist.includes(activeProduct.id)) {
        wishlist = wishlist.filter((item) => item !== activeProduct.id);
        showToast("Removed from wishlist");
    } else {
        wishlist = [activeProduct.id, ...wishlist.filter((item) => item !== activeProduct.id)];
        showToast("Saved to wishlist");
    }

    saveJSON(WISHLIST_KEY, wishlist);
    updateWishlistButton();
}

function updateWishlistButton() {
    const isSaved = wishlist.includes(activeProduct.id);
    productHeroSave.textContent = isSaved ? "Saved" : "Wishlist";
    productHeroSave.classList.toggle("is-active", isSaved);
}

function renderRelated(product) {
    const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
    relatedProducts.innerHTML = "";

    related.forEach((item) => {
        const card = document.createElement("article");
        card.className = "saved-item";
        card.innerHTML = `
            <div class="saved-item__visual" style="--card-gradient: ${item.gradient};"></div>
            <div class="saved-item__top">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.badge}</p>
                </div>
                <strong>${formatPrice(item.price)}</strong>
            </div>
            <div class="saved-item__bottom">
                <span>${item.rating} stars</span>
                <span>${item.reviews} reviews</span>
            </div>
            <div class="saved-item__actions">
                <a class="primary-button" href="product.html?id=${encodeURIComponent(item.id)}">View</a>
                <button class="quick-button" type="button">Add</button>
            </div>
        `;

        card.querySelector("button").addEventListener("click", () => {
            const existing = cart.find((entry) => entry.id === item.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
            }
            saveJSON(CART_KEY, cart);
            showToast(`${item.name} added to cart`);
        });

        relatedProducts.appendChild(card);
    });
}

function renderProduct() {
    const productId = getProductIdFromUrl();
    activeProduct = products.find((item) => item.id === productId) || products[0];

    document.title = `${activeProduct.name} | QuickLot`;
    productHeroVisual.style.setProperty("--card-gradient", activeProduct.gradient);
    productHeroBadge.textContent = activeProduct.badge;
    productHeroTitle.textContent = activeProduct.name;
    productHeroDescription.textContent = activeProduct.description;
    productHeroRating.textContent = `${activeProduct.rating} stars`;
    productHeroReviews.textContent = `${activeProduct.reviews} reviews`;
    productHeroShipping.textContent = "Ships in 24 hrs";
    productHeroPrice.textContent = formatPrice(activeProduct.price);
    productHeroOldPrice.textContent = `Was ${formatPrice(activeProduct.oldPrice)}`;

    productHighlights.innerHTML = getHighlights(activeProduct).map((item) => `<span>${item}</span>`).join("");
    productSpecs.innerHTML = getSpecs(activeProduct).map((item) => `<span>${item}</span>`).join("");

    updateWishlistButton();
    renderRelated(activeProduct);
}

productHeroAdd.addEventListener("click", () => addToCart(activeProduct.id));
productHeroSave.addEventListener("click", toggleWishlist);

renderProduct();

window.addEventListener("storage", (event) => {
    if (event.key === catalog.PRODUCTS_KEY) {
        products = catalog.loadProducts();
        renderProduct();
    }
});
