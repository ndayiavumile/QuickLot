const catalog = window.QuickLotCatalog;

const CATEGORY_LABELS = {
    electronics: "Electronics",
    appliances: "Appliances",
    gaming: "Gaming",
    fashion: "Fashion",
    home: "Home",
    beauty: "Beauty"
};

const adminList = document.getElementById("adminList");
const productForm = document.getElementById("productForm");
const formEyebrow = document.getElementById("formEyebrow");
const formHeading = document.getElementById("formHeading");
const adminStatus = document.getElementById("adminStatus");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productCategoryInput = document.getElementById("productCategory");
const productDescriptionInput = document.getElementById("productDescription");
const productPriceInput = document.getElementById("productPrice");
const productOldPriceInput = document.getElementById("productOldPrice");
const productRatingInput = document.getElementById("productRating");
const productReviewsInput = document.getElementById("productReviews");
const productBadgeInput = document.getElementById("productBadge");
const productSaveInput = document.getElementById("productSave");
const clearFormButton = document.getElementById("clearFormButton");
const resetCatalogButton = document.getElementById("resetCatalogButton");
const refreshCatalogButton = document.getElementById("refreshCatalogButton");
const statProducts = document.getElementById("statProducts");
const statCategories = document.getElementById("statCategories");
const statAveragePrice = document.getElementById("statAveragePrice");
const statTopRated = document.getElementById("statTopRated");

let products = catalog.loadProducts();
let editingId = null;

function formatPrice(value) {
    return "R" + Number(value).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
}

function getGradientValue() {
    const selected = document.querySelector('input[name="productGradient"]:checked');
    return selected ? selected.value : "linear-gradient(135deg, #bfd8ff, #f8fbff)";
}

function setGradientValue(value) {
    const options = document.querySelectorAll('input[name="productGradient"]');
    let matched = false;
    options.forEach((option, index) => {
        const isMatch = option.value === value;
        option.checked = isMatch;
        matched = matched || isMatch;
        if (!matched && index === 0) {
            option.checked = true;
        }
    });
}

function showStatus(message) {
    adminStatus.textContent = message;
    adminStatus.classList.remove("is-hidden");
    clearTimeout(showStatus.timeoutId);
    showStatus.timeoutId = setTimeout(() => {
        adminStatus.classList.add("is-hidden");
    }, 2400);
}

function loadProducts() {
    products = catalog.loadProducts();
}

function saveProducts(nextProducts) {
    products = catalog.saveProducts(nextProducts);
}

function updateStats() {
    const categories = new Set(products.map((product) => product.category));
    const averagePrice = products.length
        ? products.reduce((sum, product) => sum + Number(product.price), 0) / products.length
        : 0;
    const bestRated = [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)[0];

    statProducts.textContent = String(products.length);
    statCategories.textContent = String(categories.size);
    statAveragePrice.textContent = formatPrice(averagePrice);
    statTopRated.textContent = bestRated ? bestRated.name : "-";
}

function renderList() {
    if (!products.length) {
        adminList.innerHTML = `<p class="empty-cart">No products are in the catalog right now.</p>`;
        updateStats();
        return;
    }

    adminList.innerHTML = products.map((product) => `
        <article class="admin-item" data-product-id="${escapeHtml(product.id)}">
            <div class="admin-item__visual" style="--admin-gradient: ${escapeHtml(product.gradient)};"></div>
            <div class="admin-item__meta">
                <div>
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>${escapeHtml(product.description)}</p>
                </div>
                <div class="admin-chip-row">
                    <span class="admin-chip">${escapeHtml(CATEGORY_LABELS[product.category] || product.category)}</span>
                    <span class="admin-chip">${escapeHtml(product.badge)}</span>
                    <span class="admin-chip admin-chip--success">${escapeHtml(product.save)}</span>
                </div>
                <div class="admin-chip-row">
                    <span class="admin-chip">Price ${escapeHtml(formatPrice(product.price))}</span>
                    <span class="admin-chip">Was ${escapeHtml(formatPrice(product.oldPrice))}</span>
                    <span class="admin-chip">${escapeHtml(String(product.rating))} stars</span>
                    <span class="admin-chip">${escapeHtml(String(product.reviews))} reviews</span>
                </div>
            </div>
            <div class="admin-item__actions">
                <button class="primary-button" type="button" data-edit-id="${escapeHtml(product.id)}">Edit</button>
                <button class="danger-button" type="button" data-delete-id="${escapeHtml(product.id)}">Delete</button>
            </div>
        </article>
    `).join("");

    updateStats();

    adminList.querySelectorAll("[data-edit-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const product = products.find((entry) => entry.id === button.dataset.editId);
            if (!product) {
                return;
            }
            editingId = product.id;
            productIdInput.value = product.id;
            productNameInput.value = product.name;
            productCategoryInput.value = product.category;
            productDescriptionInput.value = product.description;
            productPriceInput.value = product.price;
            productOldPriceInput.value = product.oldPrice;
            productRatingInput.value = product.rating;
            productReviewsInput.value = product.reviews;
            productBadgeInput.value = product.badge;
            productSaveInput.value = product.save;
            setGradientValue(product.gradient);
            formEyebrow.textContent = "Edit Product";
            formHeading.textContent = `Update ${product.name}`;
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    adminList.querySelectorAll("[data-delete-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.deleteId;
            const product = products.find((entry) => entry.id === targetId);
            if (!product) {
                return;
            }

            const confirmed = window.confirm(`Delete ${product.name} from the QuickLot catalog?`);
            if (!confirmed) {
                return;
            }

            saveProducts(products.filter((entry) => entry.id !== targetId));
            if (editingId === targetId) {
                clearForm();
            }
            renderList();
            showStatus(`${product.name} was removed from the catalog.`);
        });
    });
}

function clearForm() {
    editingId = null;
    productForm.reset();
    productIdInput.value = "";
    formEyebrow.textContent = "Create Product";
    formHeading.textContent = "Add a new marketplace item";
    setGradientValue("linear-gradient(135deg, #bfd8ff, #f8fbff)");
}

function buildProductFromForm() {
    const price = Math.max(0, Number(productPriceInput.value));
    const oldPrice = Math.max(price, Number(productOldPriceInput.value));
    const rating = Math.min(5, Math.max(0, Number(productRatingInput.value)));
    const reviews = Math.max(0, Number(productReviewsInput.value));

    return {
        id: editingId || catalog.createProductId(products),
        name: productNameInput.value.trim(),
        category: productCategoryInput.value,
        description: productDescriptionInput.value.trim(),
        price,
        oldPrice: oldPrice || price,
        rating,
        reviews,
        badge: productBadgeInput.value.trim(),
        save: productSaveInput.value.trim(),
        gradient: getGradientValue()
    };
}

productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nextProduct = buildProductFromForm();
    const nextProducts = editingId
        ? products.map((product) => product.id === editingId ? nextProduct : product)
        : [nextProduct, ...products];

    saveProducts(nextProducts);
    renderList();
    showStatus(editingId ? `${nextProduct.name} was updated.` : `${nextProduct.name} was added.`);
    clearForm();
});

clearFormButton.addEventListener("click", () => {
    clearForm();
    showStatus("Form cleared and ready for a new product.");
});

resetCatalogButton.addEventListener("click", () => {
    const confirmed = window.confirm("Reset the QuickLot catalog back to the default demo products?");
    if (!confirmed) {
        return;
    }

    products = catalog.resetProducts();
    clearForm();
    renderList();
    showStatus("QuickLot was reset to the default demo catalog.");
});

refreshCatalogButton.addEventListener("click", () => {
    loadProducts();
    renderList();
    showStatus("Catalog refreshed from local storage.");
});

window.addEventListener("storage", (event) => {
    if (event.key === catalog.PRODUCTS_KEY) {
        loadProducts();
        renderList();
        if (editingId && !products.find((product) => product.id === editingId)) {
            clearForm();
        }
    }
});

loadProducts();
renderList();
clearForm();
