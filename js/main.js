 // 1. Cart data localStorage se nikalna
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// 2. Cart ko save karna aur count update karna
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 3. Top menu me cart count show karna
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');

    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// 4. Product add karne ka function (Product page ke liye)
function addToCart(product) {
    let cart = getCart();
    // Check karein ke item pehle se cart me hai ya nahi
    const existingIndex = cart.findIndex(item => (item.id && item.id === product.id) || (item.name && item.name === product.name));
    const qtyToAdd = product.quantity || 1;

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + qtyToAdd;
    } else {
        product.quantity = qtyToAdd;
        cart.push(product);
    }

    saveCart(cart);
    alert(`${product.name || product.title || 'Item'} cart me add ho gaya hai!`);
}

// 5. Cart Page par items aur summary render karna (Cart page ke liye)
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const orderSummaryContainer = document.getElementById('order-summary');

    // Agar yeh page cart.html nahi hai, to function yahi rok do
    if (!cartItemsContainer) return;

    const cart = getCart();

    // Agar cart khali hai
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-sm border text-center">
                <p class="text-slate-500 mb-4">Aapka cart bilkul khali hai.</p>
                <a href="index.html" class="inline-block bg-accent hover:bg-yellow-500 text-navy px-6 py-2 rounded-md font-bold transition">Products Dekhein</a>
            </div>`;
        
        if (orderSummaryContainer) orderSummaryContainer.innerHTML = '';
        return;
    }

    // Agar items hain, to unhe HTML me design karna
    let itemsHTML = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = item.quantity || 1;
        const itemTotal = itemPrice * itemQty;
        grandTotal += itemTotal;

        itemsHTML += `
            <div class="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 class="font-bold text-navy text-lg">${item.name || item.title || 'Product'}</h3>
                    <p class="text-sm text-slate-500 mt-1">Rs. ${itemPrice.toLocaleString()} &times; ${itemQty}</p>
                </div>
                <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <span class="font-bold text-navy text-lg">Rs. ${itemTotal.toLocaleString()}</span>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded text-sm font-medium transition">Remove</button>
                </div>
            </div>
        `;
    });

    // Items screen par dikhana
    cartItemsContainer.innerHTML = itemsHTML;

    // Right side par Order Summary dikhana
    if (orderSummaryContainer) {
        orderSummaryContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                <h3 class="text-xl font-bold text-navy mb-4 border-b pb-2">Order Summary</h3>
                <div class="flex justify-between text-slate-600 mb-4">
                    <span>Total Items:</span>
                    <span>${cart.length}</span>
                </div>
                <div class="flex justify-between font-bold text-xl text-navy border-t pt-4">
                    <span>Total Amount:</span>
                    <span>Rs. ${grandTotal.toLocaleString()}</span>
                </div>
                <a href="checkout.html" class="block text-center mt-6 bg-accent hover:bg-yellow-500 text-navy py-3 rounded-lg font-bold transition w-full">
                    Proceed to Checkout
                </a>
            </div>
        `;
    }
}

// 6. Item remove karne ka function
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1); // Array se item nikalna
    saveCart(cart); // Bacha hua cart save karna
    displayCartItems(); // Screen ko refresh karna
}

// 7. Jab page khule to count aur items update ho jayein
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();
});