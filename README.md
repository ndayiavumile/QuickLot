# QuickLot

QuickLot is a Takealot-inspired marketplace demo built as a separate project alongside the Champs website.

## What It Includes

- Responsive storefront with search, filters, wishlist, recently viewed, and cart drawer
- Product quick view and full product page
- Demo checkout flow
- Admin product management page backed by local storage

## Project Structure

- `index.html` - storefront
- `product.html` - full product details page
- `checkout.html` - demo checkout
- `admin.html` - product admin panel
- `css/styles.css` - shared styling
- `js/catalog.js` - shared local product catalog
- `js/app.js` - storefront behavior
- `js/product.js` - product page behavior
- `js/checkout.js` - checkout behavior
- `js/admin.js` - admin panel behavior

## Run Locally

If you are using XAMPP, place the project inside `htdocs` and open:

- `http://localhost/QuickLot/index.html`
- `http://localhost/QuickLot/admin.html`

## Notes

- This project is separate from the Champs website and can be versioned on GitHub independently.
- Product changes in the admin panel are stored in browser local storage for demo purposes.
