// Default products agar admin ne pehle se koi na dale hon
const defaultSiteProducts = [
    { id: 101, name: "DVP14SS2 PLC Controller", price: 18500, category: "PLC Controllers", image: "images/plc.jpg" },
    { id: 102, name: "VFD Inverter 5.5KW", price: 34000, category: "VFD Inverters", image: "images/vfd.jpg" }
];

// Admin ke added products fetch karna
function getActiveProducts() {
    const saved = localStorage.getItem('site_products');
    return saved ? JSON.parse(saved) : defaultSiteProducts;
}

// Cart Data Handlers
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
    const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');
    cartCountElements.forEach(el => el.textContent = totalItems);
}

// Add to Cart Functionality
function addToCart(product) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id == product.id || item.name == product.name);
    const qtyToAdd = Number(product.quantity) || 1;

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 1) + qtyToAdd;
    } else {
        product.quantity = qtyToAdd;
        cart.push(product);
    }

    saveCart(cart);
    alert(`${product.name} cart mein shamil ho gaya hai!`);
}

// Cart Page Render Functionality (Buttons, Qty + / -, Remove)
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                <div style="font-size: 50px; color: #cbd5e1; margin-bottom: 15px;">🛒</div>
                <h3 style="color: #0b2545; margin-bottom: 8px;">Aapka shopping cart khali hai</h3>
                <p style="color: #64748b; margin-bottom: 20px; font-size: 14px;">Store se products browse karein aur cart mein add karein.</p>
                <a href="index.html" style="display: inline-block; padding: 10px 24px; background: #1e88e5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">Products Dekhein</a>
            </div>
        `;
        return;
    }

    let grandTotal = 0;
    let totalQuantity = 0;
    let itemsHTML = '';

    cart.forEach((item, index) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.quantity) || 1;
        const itemTotal = itemPrice * itemQty;
        grandTotal += itemTotal;
        totalQuantity += itemQty;

        itemsHTML += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 18px 20px; border-radius: 10px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #edf2f7;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.image || 'images/plc.jpg'}" onerror="this.src='https://via.placeholder.com/60'" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;">
                    <div>
                        <h4 style="margin: 0 0 5px 0; color: #0b2545; font-size: 15px;">${item.name}</h4>
                        <div style="color: #1e88e5; font-weight: 700; font-size: 14px;">Rs. ${itemPrice.toLocaleString()}</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
                        <button onclick="changeQty(${index}, -1)" style="border:none; background:#f8fafc; padding: 6px 12px; cursor:pointer; font-weight:bold;">-</button>
                        <span style="padding: 0 12px; font-weight: 600; font-size: 14px;">${itemQty}</span>
                        <button onclick="changeQty(${index}, 1)" style="border:none; background:#f8fafc; padding: 6px 12px; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                    <strong style="color: #0b2545; min-width: 90px; text-align: right; font-size: 15px;">Rs. ${itemTotal.toLocaleString()}</strong>
                    <button onclick="removeFromCart(${index})" style="background: #fee2e2; color: #ef4444; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">Remove</button>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 25px; max-width: 1100px; margin: 30px auto;">
            <div>${itemsHTML}</div>
            
            <div style="background: #fff; padding: 25px; border-radius: 10px; height: fit-content; border: 1px solid #edf2f7; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <h3 style="margin-top: 0; color: #0b2545; border-bottom: 1px solid #edf2f7; padding-bottom: 12px; font-size: 17px;">Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin: 15px 0; color: #64748b; font-size: 14px;">
                    <span>Total Quantity:</span>
                    <strong style="color: #0b2545;">${totalQuantity} units</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 15px 0; color: #64748b; font-size: 14px;">
                    <span>Shipping:</span>
                    <strong style="color: #10b981;">Free</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 15px 0 20px 0; color: #0b2545; font-size: 18px; font-weight: 800; border-top: 1px solid #edf2f7; padding-top: 15px;">
                    <span>Total Bill:</span>
                    <span style="color: #1e88e5;">Rs. ${grandTotal.toLocaleString()}</span>
                </div>
                <a href="checkout.html" style="display: block; text-align: center; background: linear-gradient(135deg, #1e88e5 0%, #00acc1 100%); color: white; padding: 13px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(30,136,229,0.3);">Proceed to Checkout</a>
            </div>
        </div>
    `;
}

function changeQty(index, delta) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity = (Number(cart[index].quantity) || 1) + delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        displayCartItems();
    }
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();
});s