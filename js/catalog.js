(function () {
    const PRODUCTS_KEY = "quicklotProducts";
    const DEFAULT_PRODUCTS = [
        { id: "p1", name: "Wave ANC Headphones", category: "electronics", description: "Wireless sound with strong battery life and commuter-friendly noise cancelling.", price: 1899, oldPrice: 2799, rating: 4.8, reviews: 612, badge: "Top Tech", save: "Save 32%", gradient: "linear-gradient(135deg, #bfd8ff, #f8fbff)" },
        { id: "p2", name: "Air Fryer XL 7L", category: "appliances", description: "Family-size air fryer for faster weeknight meals and less oil.", price: 1499, oldPrice: 1999, rating: 4.7, reviews: 308, badge: "Kitchen Pick", save: "Save 25%", gradient: "linear-gradient(135deg, #ffd9b5, #fff8f0)" },
        { id: "p3", name: "Pro Gaming Controller", category: "gaming", description: "Responsive triggers, textured grip, and cross-platform compatibility.", price: 999, oldPrice: 1299, rating: 4.6, reviews: 244, badge: "Gamer Drop", save: "Save 23%", gradient: "linear-gradient(135deg, #d7cbff, #f8f5ff)" },
        { id: "p4", name: "Urban Runner Sneakers", category: "fashion", description: "Comfort-focused lifestyle sneakers built for everyday movement.", price: 1199, oldPrice: 1599, rating: 4.5, reviews: 190, badge: "Style Favorite", save: "Save 25%", gradient: "linear-gradient(135deg, #d2ffe8, #f6fffb)" },
        { id: "p5", name: "Smart LED TV 55\"", category: "electronics", description: "4K streaming ready with voice remote and sharp living-room contrast.", price: 6999, oldPrice: 8499, rating: 4.7, reviews: 521, badge: "Big Screen", save: "Save 18%", gradient: "linear-gradient(135deg, #cad8ff, #eef3ff)" },
        { id: "p6", name: "Linen Storage Ottoman", category: "home", description: "Clean modern bench seating with hidden storage for compact rooms.", price: 899, oldPrice: 1199, rating: 4.4, reviews: 88, badge: "Home Edit", save: "Save 25%", gradient: "linear-gradient(135deg, #f5e1cb, #fffaf4)" },
        { id: "p7", name: "Glow Serum Set", category: "beauty", description: "Daily skincare bundle with hydration, barrier support, and glow finish.", price: 549, oldPrice: 799, rating: 4.8, reviews: 263, badge: "Beauty Best", save: "Save 31%", gradient: "linear-gradient(135deg, #ffd7ea, #fff5fb)" },
        { id: "p8", name: "Robot Vacuum Lite", category: "home", description: "Compact smart cleaning with scheduled runs and app controls.", price: 3299, oldPrice: 4299, rating: 4.6, reviews: 172, badge: "Home Tech", save: "Save 23%", gradient: "linear-gradient(135deg, #d3e9ff, #f6fbff)" },
        { id: "p9", name: "Smartwatch Active", category: "electronics", description: "Wellness tracking, notifications, and a clean display for daily wear.", price: 2499, oldPrice: 3199, rating: 4.5, reviews: 206, badge: "Wearables", save: "Save 22%", gradient: "linear-gradient(135deg, #d0e6ff, #fbfdff)" },
        { id: "p10", name: "Espresso Machine Mini", category: "appliances", description: "Compact espresso machine with rich crema and countertop appeal.", price: 2199, oldPrice: 2899, rating: 4.7, reviews: 147, badge: "Coffee Bar", save: "Save 24%", gradient: "linear-gradient(135deg, #ead3c2, #fff7f2)" },
        { id: "p11", name: "Performance Backpack", category: "fashion", description: "Travel-ready backpack with laptop sleeve, hidden pockets, and modern lines.", price: 799, oldPrice: 1049, rating: 4.4, reviews: 119, badge: "Travel Ready", save: "Save 24%", gradient: "linear-gradient(135deg, #d8ffe9, #f8fffc)" },
        { id: "p12", name: "LED Vanity Mirror", category: "beauty", description: "Adjustable brightness mirror for makeup stations and skincare corners.", price: 699, oldPrice: 949, rating: 4.6, reviews: 132, badge: "Glow Setup", save: "Save 26%", gradient: "linear-gradient(135deg, #ffe2f1, #fff8fc)" }
    ];

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizeProduct(product, index) {
        const price = Number(product.price ?? 0);
        const oldPrice = Number(product.oldPrice ?? price);
        return {
            id: String(product.id || `p${index + 1}`),
            name: String(product.name || "Untitled Product").trim(),
            category: String(product.category || "electronics").trim(),
            description: String(product.description || "No description provided yet.").trim(),
            price: Number.isFinite(price) ? price : 0,
            oldPrice: Number.isFinite(oldPrice) ? oldPrice : 0,
            rating: Number(product.rating ?? 4.5),
            reviews: Math.max(0, Number(product.reviews ?? 0)),
            badge: String(product.badge || "Marketplace Pick").trim(),
            save: String(product.save || "Save now").trim(),
            gradient: String(product.gradient || "linear-gradient(135deg, #cfe0ff, #f7fbff)").trim()
        };
    }

    function saveProducts(products) {
        const normalized = (products || []).map((product, index) => normalizeProduct(product, index));
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalized));
        return clone(normalized);
    }

    function loadProducts() {
        try {
            const stored = localStorage.getItem(PRODUCTS_KEY);
            if (!stored) {
                return saveProducts(DEFAULT_PRODUCTS);
            }

            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                return saveProducts(DEFAULT_PRODUCTS);
            }

            return saveProducts(parsed);
        } catch (error) {
            console.error(error);
            return saveProducts(DEFAULT_PRODUCTS);
        }
    }

    function resetProducts() {
        return saveProducts(DEFAULT_PRODUCTS);
    }

    function createProductId(products) {
        const ids = (products || [])
            .map((product) => Number(String(product.id || "").replace(/^p/, "")))
            .filter((value) => Number.isFinite(value));
        const nextId = ids.length ? Math.max(...ids) + 1 : 1;
        return `p${nextId}`;
    }

    window.QuickLotCatalog = {
        PRODUCTS_KEY,
        DEFAULT_PRODUCTS: clone(DEFAULT_PRODUCTS),
        loadProducts,
        saveProducts,
        resetProducts,
        createProductId
    };
})();
