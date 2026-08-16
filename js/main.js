// 1. Cart data fetch karna
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// 2. Cart save karna aur badges update karna
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 3. Top-right cart badge count update karna (Total Quantity Sum)
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
    const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');

    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// 4. Product add karne ka function
function addToCart(product) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => (item.id && item.id === product.id) || (item.name && item.name === product.name));
    const qtyToAdd = Number(product.quantity) || 1;

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 1) + qtyToAdd;
    } else {
        product.quantity = qtyToAdd;
        cart.push(product);
    }

    saveCart(cart);
    alert(`${product.name || product.title} cart me add ho gaya hai!`);
}

// 5. Shopping Cart Page Render Karna (Item list + Order Summary with Total Items)
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items-container') || document.querySelector('.cart-container');
    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 50px 20px;">
                <h3 style="color: #0b2545;">Aapka shopping cart khali hai.</h3>
                <p style="color: #666;">Koi product cart mein shamil nahi kiya gaya.</p>
                <a href="index.html" style="display: inline-block; margin-top: 15px; padding: 10px 22px; background: #fca311; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Products Dekhein</a>
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
            <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 18px 20px; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <div>
                    <h4 style="margin: 0 0 6px 0; color: #0b2545; font-size: 16px;">${item.name || item.title}</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">Rs. ${itemPrice.toLocaleString()} &times; ${itemQty}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <strong style="color: #0b2545; font-size: 16px;">Rs. ${itemTotal.toLocaleString()}</strong>
                    <button onclick="removeFromCart(${index})" style="background: #ff4d4f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">Remove</button>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 25px; max-width: 1050px; margin: 30px auto; padding: 0 15px;">
            <div>
                ${itemsHTML}
            </div>
            
            <!-- Order Summary Section -->
            <div style="background: #fff; padding: 22px; border-radius: 8px; height: fit-content; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <h3 style="margin-top: 0; color: #0b2545; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin: 15px 0; color: #555; font-size: 15px;">
                    <span>Total Items:</span>
                    <strong>${totalQuantity}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 15px 0; color: #0b2545; font-size: 17px; font-weight: bold; border-top: 1px solid #eee; padding-top: 12px;">
                    <span>Total Amount:</span>
                    <span>Rs. ${grandTotal.toLocaleString()}</span>
                </div>
                <a href="checkout.html" style="display: block; text-align: center; background: #fca311; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Proceed to Checkout</a>
            </div>
        </div>
    `;
}

// 6. Product remove karna
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCartItems();
}

// 7. Page ready hone par chalana
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();
});