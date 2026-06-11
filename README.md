# 🛒 QuickLot

A fully functional e-commerce marketplace demo inspired by Takealot, built with vanilla JavaScript — no frameworks, no libraries, just clean HTML, CSS, and JS.

---

## Overview

QuickLot simulates a real online shopping experience, from browsing products to checking out. It was built to demonstrate front-end development skills including dynamic DOM manipulation, local storage management, and responsive UI design.

---

## Features

- 🔍 **Product search and filtering** — find products quickly by name or category
- ❤️ **Wishlist** — save products for later
- 🕐 **Recently viewed** — automatically tracks browsing history
- 🛒 **Cart drawer** — add/remove items without leaving the page
- 👁️ **Product quick view** — preview product details inline
- 📦 **Full product page** — detailed view with all product info
- 💳 **Demo checkout flow** — simulated end-to-end purchase
- 🛠️ **Admin panel** — add, edit, and manage products via a dedicated admin page

---

## Tech Stack

| Technology | Use |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| Vanilla JavaScript | All interactivity and logic |
| Local Storage | Product and cart data persistence |

---

## Project Structure

```
QuickLot/
├── index.html          # Main storefront
├── product.html        # Full product details page
├── checkout.html       # Demo checkout flow
├── admin.html          # Admin product management panel
├── css/
│   └── styles.css      # Shared styles
└── js/
    ├── catalog.js      # Shared product catalog
    ├── app.js          # Storefront behaviour
    ├── product.js      # Product page behaviour
    ├── checkout.js     # Checkout behaviour
    └── admin.js        # Admin panel behaviour
```

---

## Getting Started

### Run locally with XAMPP

1. Clone the repository:
   ```bash
   git clone https://github.com/ndayiavumile/QuickLot.git
   ```
2. Place the project folder inside your XAMPP `htdocs` directory
3. Start Apache in XAMPP
4. Open in your browser:
   - Storefront: `http://localhost/QuickLot/index.html`
   - Admin panel: `http://localhost/QuickLot/admin.html`

### Or open directly

You can also open `index.html` directly in your browser — most features will work without a local server.

---

## Notes

- Product data added or edited in the admin panel is stored in **browser local storage** — this is a demo and does not persist across devices or browsers.
- No backend or external APIs are used; this is a fully client-side project.

---

## Author

**Katywa Aphelele** — [GitHub](https://github.com/ndayiavumile)
