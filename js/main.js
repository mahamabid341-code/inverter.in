let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    const qtyToAdd = product.quantity || 1;

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qtyToAdd;
    } else {
        product.quantity = qtyToAdd;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} cart me add ho gaya hai!`);
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}