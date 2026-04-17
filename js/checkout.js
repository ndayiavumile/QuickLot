const CART_KEY = "quicklotCart";
const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY = 75;

const summaryList = document.getElementById("summaryList");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryDelivery = document.getElementById("summaryDelivery");
const summaryTotal = document.getElementById("summaryTotal");
const checkoutForm = document.getElementById("checkoutForm");
const successCard = document.getElementById("successCard");
const successMessage = document.getElementById("successMessage");
const paymentNote = document.getElementById("paymentNote");
const paymentStep = document.getElementById("paymentStep");
const reviewStep = document.getElementById("reviewStep");

let cart = loadCart();

function loadCart() {
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function formatPrice(value) {
    return "R" + Number(value).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getSubtotal() {
    return cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
}

function getDelivery() {
    const subtotal = getSubtotal();
    return subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY;
}

function renderSummary() {
    if (!cart.length) {
        summaryList.innerHTML = `<p class="empty-cart">Your cart is empty. Go back and add a few products first.</p>`;
        summarySubtotal.textContent = formatPrice(0);
        summaryDelivery.textContent = formatPrice(0);
        summaryTotal.textContent = formatPrice(0);
        return;
    }

    summaryList.innerHTML = "";

    cart.forEach((item) => {
        const row = document.createElement("article");
        row.className = "summary-item";
        row.innerHTML = `
            <div class="saved-item__top">
                <div>
                    <strong>${item.name}</strong>
                    <p>${item.quantity} x ${formatPrice(item.price)}</p>
                </div>
                <strong>${formatPrice(Number(item.price) * Number(item.quantity))}</strong>
            </div>
        `;
        summaryList.appendChild(row);
    });

    const subtotal = getSubtotal();
    const delivery = getDelivery();
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryDelivery.textContent = formatPrice(delivery);
    summaryTotal.textContent = formatPrice(subtotal + delivery);
}

function updateCheckoutSteps() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "card";
    const paymentMessages = {
        card: "Card payment is selected for the fastest checkout experience.",
        wallet: "Quick wallet keeps the flow fast and mobile friendly.",
        eft: "Instant EFT works well for marketplace-style bank checkout."
    };

    if (paymentNote) {
        paymentNote.textContent = paymentMessages[paymentMethod] || paymentMessages.card;
    }

    if (paymentStep) {
        paymentStep.classList.add("is-active");
    }

    if (reviewStep) {
        reviewStep.classList.toggle("is-active", cart.length > 0);
    }
}

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!cart.length) {
        alert("Your cart is empty. Please go back and add products first.");
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();

    if (!name || !email) {
        alert("Please complete the checkout form first.");
        return;
    }

    const orderNumber = "QL-" + Math.floor(100000 + Math.random() * 900000);
    successMessage.textContent = `${name}, your demo order ${orderNumber} has been placed successfully. A confirmation would normally be sent to ${email}.`;
    successCard.classList.remove("is-hidden");
    if (paymentStep) {
        paymentStep.classList.add("is-done");
    }
    if (reviewStep) {
        reviewStep.classList.remove("is-active");
        reviewStep.classList.add("is-done");
    }

    cart = [];
    saveCart(cart);
    renderSummary();
    updateCheckoutSteps();
    checkoutForm.reset();
});

document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.addEventListener("change", updateCheckoutSteps);
});

renderSummary();
updateCheckoutSteps();
