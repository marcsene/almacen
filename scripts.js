// =========================================
// 1. PRODUCTOS
// =========================================

const products = [
    {
    id: 1,
    name: "coca-cola-15-1",
    category: "Bebidas",
    price: 1500,
    image: "assets/images/cocacola-15-1.jpg"
},
    {
        id: 2,
        name: "Pan",
        category: "Abarrotes",
        price: 1500,
        image: "assets/images/pan.jpg"
    },
    {
        id: 3,
        name: "Papas Fritas",
        category: "Snacks",
        price: 1500,
        image: "assets/images/papa fritas.jpg"
    },
    {
        id: 4,
        name: "Detergente",
        category: "Aseo",
        price: 3990,
        image: "assets/images/detergente.jpg"
    },
    {
        id: 5,
        name: "Shampoo",
        category: "Higiene",
        price: 2990,
        image: "assets/images/shampoo.jpg"
    },
    {
        id: 6,
        name: "Leche 1L",
        category: "Abarrotes",
        price: 1190,
        image: "assets/images/leche 1L.jpg"
    },
    {
        id: 7,
        name: "Arroz 1kg",
        category: "Abarrotes",
        price: 1800,
        image: "assets/images/arroz.jpg"
    },
    {
        id: 8,
        name: "Jugo de Naranja",
        category: "Bebidas",
        price: 2290,
        image: "assets/images/jugo naranja.jpg"
    },
    {
        id: 9,
        name: "Galletas",
        category: "Snacks",
        price: 1200,
        image: "assets/images/galletas.jpg"
    },
    {
        id: 10,
        name: "Lavalozas",
        category: "Aseo",
        price: 2490,
        image: "assets/images/lavaloza.jpg"
    },
    {
        id: 11,
        name: "Pasta Dental",
        category: "Higiene",
        price: 1990,
        image: "assets/images/pasta dental.jpg"
    },
    {
        id: 12,
        name: "Helado",
        category: "Congelados",
        price: 2500,
        image: "assets/images/helado.jpg"
    }
];



// =========================================
// 2. MONEDAS
// =========================================

const currencies = {
    CLP: {
        name: "Peso chileno",
        symbol: "$",
        rate: 1
    },

    USD: {
        name: "Dólar estadounidense",
        symbol: "$",
        rate: 0.001
    },

    EUR: {
        name: "Euro",
        symbol: "€",
        rate: 0.0009
    }
};


// =========================================
// 3. ESTADO DE LA APLICACIÓN
// =========================================

// Recuperamos el carrito guardado.
// Si no existe, usamos un array vacío.
let cart = JSON.parse(
    localStorage.getItem("almacen-cart")
) || [];

let selectedCategory = "Todos";
let searchTerm = "";
let selectedCurrency = "CLP";


// =========================================
// 4. ELEMENTOS DEL DOM
// =========================================

const productList =
    document.getElementById("product-list");

const searchInput =
    document.getElementById("product-search");

const currencySelector =
    document.getElementById("currency-selector");

const cartItems =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

const cartCount =
    document.getElementById("cart-count");

const whatsappButton =
    document.getElementById("whatsapp-button");


// =========================================
// 5. GUARDAR CARRITO
// =========================================

function saveCart() {

    localStorage.setItem(
        "almacen-cart",
        JSON.stringify(cart)
    );
}


// =========================================
// 6. FORMATEAR PRECIO
// =========================================

function formatPrice(price) {

    const currency =
        currencies[selectedCurrency];

    const convertedPrice =
        price * currency.rate;

    return `${currency.symbol}${convertedPrice.toLocaleString(
        selectedCurrency === "CLP"
            ? "es-CL"
            : "en-US",
        {
            minimumFractionDigits:
                selectedCurrency === "CLP"
                    ? 0
                    : 2,

            maximumFractionDigits:
                selectedCurrency === "CLP"
                    ? 0
                    : 2
        }
    )}`;
}


// =========================================
// 7. MOSTRAR PRODUCTOS
// =========================================

function renderProducts() {

    const filteredProducts =
        products.filter(product => {

            const matchesCategory =
                selectedCategory === "Todos" ||
                product.category === selectedCategory;

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                product.category
                    .toLowerCase()
                    .includes(searchTerm);

            return matchesCategory && matchesSearch;
        });


    productList.innerHTML = "";


    if (filteredProducts.length === 0) {

        productList.innerHTML = `
            <div class="no-products">
                <p>😕 No encontramos productos.</p>
            </div>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const productCard =
            document.createElement("article");

        productCard.className =
            "product-card";


        productCard.innerHTML = `
            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <button
                    class="add-button"
                    data-id="${product.id}"
                >
                    Agregar al carrito
                </button>

            </div>
        `;


        productList.appendChild(productCard);
    });


    document
        .querySelectorAll(".add-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        Number(button.dataset.id);

                    addToCart(productId);
                }
            );
        });
}


// =========================================
// 8. AGREGAR AL CARRITO
// =========================================

function addToCart(productId) {

    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        const product =
            products.find(
                item => item.id === productId
            );

        if (!product) return;


        cart.push({
            ...product,
            quantity: 1
        });
    }


    // Guardamos después de modificar.
    saveCart();

    renderCart();
}


// =========================================
// 9. MOSTRAR CARRITO
// =========================================

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                🛒 Tu carrito está vacío.
            </p>
        `;

        cartTotal.textContent =
            formatPrice(0);

        cartCount.textContent = totalItems;

if (totalItems > 0) {
    cartCount.classList.remove("cart-count-animation");

    void cartCount.offsetWidth;

    cartCount.classList.add("cart-count-animation");
}

        return;
    }


    let total = 0;
    let totalItems = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        totalItems += item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `
            <div class="cart-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    ${formatPrice(item.price)}
                </span>

            </div>

            <div class="cart-item-controls">

                <button
                    class="quantity-button"
                    data-action="decrease"
                    data-id="${item.id}"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    class="quantity-button"
                    data-action="increase"
                    data-id="${item.id}"
                >
                    +
                </button>

                <button
                    class="remove-button"
                    data-action="remove"
                    data-id="${item.id}"
                >
                    ✕
                </button>

            </div>
        `;


        cartItems.appendChild(cartItem);
    });


    cartTotal.textContent =
        formatPrice(total);

    cartCount.textContent =
        totalItems;


    document
        .querySelectorAll(
            ".quantity-button, .remove-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    const action =
                        button.dataset.action;

                    updateCartItem(
                        id,
                        action
                    );
                }
            );
        });
}


// =========================================
// 10. ACTUALIZAR CARRITO
// =========================================

function updateCartItem(
    productId,
    action
) {

    const item =
        cart.find(
            product => product.id === productId
        );


    if (!item) return;


    if (action === "increase") {

        item.quantity++;
    }


    if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(
                product =>
                    product.id !== productId
            );
        }
    }


    if (action === "remove") {

        cart = cart.filter(
            product =>
                product.id !== productId
        );
    }


    // Guardamos el nuevo estado.
    saveCart();

    renderCart();
}


// =========================================
// 11. FILTRO POR CATEGORÍA
// =========================================

function filterByCategory(category) {

    selectedCategory = category;

    renderProducts();
}


// =========================================
// 12. BÚSQUEDA
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        event => {

            searchTerm =
                event.target.value
                    .toLowerCase()
                    .trim();

            renderProducts();
        }
    );
}


// =========================================
// 13. CAMBIO DE MONEDA
// =========================================

if (currencySelector) {

    currencySelector.addEventListener(
        "change",
        event => {

            selectedCurrency =
                event.target.value;

            renderProducts();
            renderCart();
        }
    );
}


// =========================================
// 14. BOTONES DE CATEGORÍA
// =========================================

document
    .querySelectorAll("[data-category]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;

                filterByCategory(category);
            }
        );
    });


// =========================================
// 15. WHATSAPP
// =========================================

if (whatsappButton) {

    whatsappButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "Tu carrito está vacío. Agrega productos antes de realizar el pedido."
                );

                return;
            }


            let message =
                "Hola, quiero realizar el siguiente pedido:%0A%0A";


            cart.forEach(item => {

                message +=
                    `• ${item.name} x${item.quantity} — ${formatPrice(
                        item.price * item.quantity
                    )}%0A`;
            });


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum +
                        item.price *
                        item.quantity,
                    0
                );


            message +=
                `%0ATotal: ${formatPrice(total)}`;


            const phone =
                "+56945729310";


            const whatsappURL =
                `https://wa.me/${phone}?text=${message}`;


            window.open(
                whatsappURL,
                "_blank"
            );
        }
    );
}


// =========================================
// 16. INICIO
// =========================================


// ===============================
// BOTÓN DEL CARRITO DEL HEADER
// ===============================

const cartButton = document.querySelector(".cart-button");

if (cartButton) {
    cartButton.addEventListener("click", function () {
        const cartSection = document.getElementById("cart");

        if (cartSection) {
            cartSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else {
            console.error("No se encontró la sección #cart");
        }
    });
}
renderProducts();
renderCart();