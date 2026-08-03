// ========================================
// ARIMEN SHOPPING CART
// ========================================

let cart = JSON.parse(localStorage.getItem("arimenCart")) || [];

const addToCartButtons =
    document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".shop-product-card");

        if (!productCard) {
            return;
        }

        const sizeSelect = productCard.querySelector("select");
        const selectedSize = sizeSelect
            ? sizeSelect.value.trim()
            : "";

        if (
            selectedSize === "" ||
            selectedSize.toLowerCase().includes("select")
        ) {
            alert("Please select a size first.");
            return;
        }

        const productImage =
            productCard.querySelector("img");

        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: Number(button.dataset.price),
            size: selectedSize,
            image: productImage ? productImage.src : "",
            quantity: 1
        };

        const existingProduct = cart.find(
            (item) =>
                item.id === product.id &&
                item.size === product.size
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        saveCart();
        
    });
});
function saveCart() {
    localStorage.setItem(
        "arimenCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}

function updateCartCount() {
    const cartCount =
        document.querySelector("#cart-count");

    if (!cartCount) {
        return;
    }

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
}


// ========================================
// CART PAGE
// ========================================

const cartItemsContainer =
    document.querySelector("#cart-items");

if (cartItemsContainer) {
    displayCart();
}

function displayCart() {
    cart =
        JSON.parse(
            localStorage.getItem("arimenCart")
        ) || [];

    const cartTotal =
        document.querySelector("#cart-total");

    if (!cartTotal) {
        return;
    }

   if (cart.length === 0) {
    cartItemsContainer.innerHTML =
        '<p class="empty-cart">Your cart is currently empty.</p>';

    cartTotal.textContent = "0.00";

    const finalTotal = document.querySelector("#final-total");
    if (finalTotal) {
        finalTotal.textContent = "4.50";
    }

    return;
}

    cartItemsContainer.innerHTML = cart
        .map(
            (item, index) => `
                <article class="cart-item">
        
                    <img
                     src="${item.image}"
                     alt="${item.name}"
                     class="cart-item-image">

                     <div class="cart-item-details">

                        <h3>${item.name}</h3>
                        <p>Size: ${item.size}</p>
                        <p>Price: £${item.price.toFixed(2)}</p>
        

                    <div class="quantity-controls">

                    
                        <button
                            type="button"
                            onclick="changeQuantity(${index}, -1)">
                            −
                        </button>
                
                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>
                    </div>

                    <p class="item-total">
                     <strong>Subtotal:</strong> £${(
                                     item.price * item.quantity
                                        ).toFixed(2)}
                                      </p>

                    <button
                     class="remove-button"
                     onclick="removeItem(${index})">
                       Remove
                </button>
                </div>
                </article>
            `
        )
        .join("");

    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = total.toFixed(2);
    const finalTotal = document.querySelector("#final-total");
const delivery = 4.50;

if (finalTotal) {
    finalTotal.textContent = (total + delivery).toFixed(2);
}
    updateCartCount();
}

function changeQuantity(index, change) {
    if (!cart[index]) {
        return;
    }

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

function removeItem(index) {
    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();
    displayCart();
}

updateCartCount();


// ========================================
// PRODUCT SEARCH AND FILTERS
// ========================================

const searchInput =
    document.querySelector(".shop-search input");

const searchButton =
    document.querySelector(".shop-search button");

const productCards =
    document.querySelectorAll(".shop-product-card");

const productCount =
    document.querySelector("#product-count");

const noResults =
    document.querySelector("#no-results");

const colourCheckboxes =
    document.querySelectorAll(
        ".colour-filters input[type='checkbox']"
    );

const categoryCheckboxes =
    document.querySelectorAll(
        ".category-filters input[type='checkbox']"
    );

const topFilterButtons =
    document.querySelectorAll(
        ".collection-categories button"
    );

let selectedTopFilter = "";

function filterProducts() {
    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const selectedColours =
        Array.from(colourCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) =>
                checkbox.value.toLowerCase().trim()
            );

    const selectedCategories =
        Array.from(categoryCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) =>
                checkbox.value.toLowerCase().trim()
            );

    let visibleProducts = 0;

    productCards.forEach((card) => {
        const productName =
            card.querySelector("h2")
                ?.textContent
                .toLowerCase()
                .trim() || "";

        const description =
            card.querySelector("p")
                ?.textContent
                .toLowerCase()
                .trim() || "";

        const colour =
            (card.dataset.colour || "")
                .toLowerCase()
                .trim();

        const category =
            (card.dataset.category || "")
                .toLowerCase()
                .trim();

        const searchableText = `
            ${productName}
            ${description}
            ${colour}
            ${category}
        `;

        const matchesSearch =
            searchText === "" ||
            searchableText.includes(searchText);

        const matchesColour =
            selectedColours.length === 0 ||
            selectedColours.some((selectedColour) =>
                colour.includes(selectedColour)
            );

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.some((selectedCategory) =>
                category.includes(selectedCategory)
            );

        const matchesTopFilter =
            selectedTopFilter === "" ||
            colour.includes(selectedTopFilter) ||
            category.includes(selectedTopFilter);

        const shouldShow =
            matchesSearch &&
            matchesColour &&
            matchesCategory &&
            matchesTopFilter;

        card.style.display =
            shouldShow ? "" : "none";

        if (shouldShow) {
            visibleProducts++;
        }
    });

    if (productCount) {
        productCount.textContent =
            `${visibleProducts} Product${
                visibleProducts === 1 ? "" : "s"
            }`;
    }

    if (noResults) {
        noResults.hidden =
            visibleProducts !== 0;
    }
}


// ========================================
// SEARCH BAR
// ========================================

if (searchButton && searchInput) {
    searchButton.addEventListener(
        "click",
        filterProducts
    );

    searchInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                filterProducts();
            }
        }
    );

    searchInput.addEventListener(
        "input",
        () => {
            selectedTopFilter = "";
            filterProducts();
        }
    );
}


// ========================================
// COLOUR CHECKBOXES
// ========================================

colourCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        selectedTopFilter = "";
        filterProducts();
    });
});


// ========================================
// CATEGORY CHECKBOXES
// ========================================

categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        selectedTopFilter = "";
        filterProducts();
    });
});


// ========================================
// TOP FILTER BUTTONS
// ========================================

topFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText =
            button.textContent
                .toLowerCase()
                .trim();

        let newFilter = "";

        if (buttonText.includes("black")) {
            newFilter = "black";
        } else if (buttonText.includes("grey")) {
            newFilter = "grey";
        } else if (buttonText.includes("blue")) {
            newFilter = "blue";
        } else if (buttonText.includes("green")) {
            newFilter = "green";
        } else if (buttonText.includes("hoodie")) {
            newFilter = "hoodie";
        }

        colourCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        categoryCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        if (searchInput) {
            searchInput.value = "";
        }

        selectedTopFilter =
            selectedTopFilter === newFilter
                ? ""
                : newFilter;

        filterProducts();
    });
});


// Show all products when the page first opens.
filterProducts();
// ========================================
// SAVED WISHLIST
// ========================================

let wishlist =
    JSON.parse(localStorage.getItem("arimenWishlist")) || [];

const wishlistButtons =
    document.querySelectorAll(".wishlist-button");

wishlistButtons.forEach((button) => {
    const productCard =
        button.closest(".shop-product-card");

    const productName =
        productCard.querySelector("h2").textContent.trim();

    if (wishlist.some(item => item.name === productName)) {
        button.classList.add("active");
        button.textContent = "♥";
    } else {
        button.textContent = "♡";
    }

    button.addEventListener("click", () => {
        if (wishlist.some(item => item.name === productName)) {
            wishlist = wishlist.filter(
                (item) => item.name !== productName
            );

            button.classList.remove("active");
            button.textContent = "♡";
        } else {
           const product = {
    name: productName,
    image: document.querySelector("#main-product-image").src,
    price: document.querySelector(".product-price").textContent
};

wishlist.push(product);

            button.classList.add("active");
            button.textContent = "♥";
        }

        localStorage.setItem(
            "arimenWishlist",
            JSON.stringify(wishlist)
        );
    });
});

const sizeGuideButton =
    document.querySelector(".size-guide-button");

const sizeGuideModal =
    document.querySelector(".size-guide-modal");

const closeSizeGuide =
    document.querySelector(".close-size-guide");

if (sizeGuideButton && sizeGuideModal && closeSizeGuide) {
    sizeGuideButton.addEventListener("click", () => {
        sizeGuideModal.classList.add("open");
    });

    closeSizeGuide.addEventListener("click", () => {
        sizeGuideModal.classList.remove("open");
    });

    sizeGuideModal.addEventListener("click", (event) => {
        if (event.target === sizeGuideModal) {
            sizeGuideModal.classList.remove("open");
        }
    });
}
// ========================================
// PRODUCT DETAILS ADD TO CART — FIXED
// ========================================

const productPageButton =
    document.querySelector(".product-add-cart");

const productPageSizeButtons =
    document.querySelectorAll(".product-size-buttons button");

let chosenSize = "";

productPageSizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        productPageSizeButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
        chosenSize = button.textContent.trim();
    });
});

if (productPageButton) {
    productPageButton.addEventListener("click", () => {
        if (!chosenSize) {
            alert("Please choose a size first.");
            return;
        }

        const pageTitle = document.querySelector(
            ".product-information h1"
        );

        const pagePrice = document.querySelector(
            ".product-price"
        );

        const pageImage = document.querySelector(
            "#main-product-image"
        );

        if (!pageTitle || !pagePrice || !pageImage) {
            alert("Product information could not be found.");
            return;
        }

        const productName = pageTitle.textContent.trim();

        const productPrice = Number(
            pagePrice.textContent
                .replace("£", "")
                .trim()
        );

        const currentProductId =
            new URLSearchParams(window.location.search).get("id") ||
            productName.toLowerCase().replaceAll(" ", "-");

       cart =
    JSON.parse(localStorage.getItem("arimenCart")) || [];

const product = {
    id: currentProductId,
    name: productName,
    price: productPrice,
    image: pageImage.src,
    size: chosenSize,
    quantity: 1
};

const existingItem = cart.find((item) => {
    return (
        item.id === product.id &&
        item.size === product.size
    );
});

if (existingItem) {
    existingItem.quantity += 1;
    existingItem.image = product.image;
} else {
    cart.push(product);
}

saveCart();

        const cartPanel = document.querySelector(".cart-panel");
const cartOverlay = document.querySelector(".cart-panel-overlay");
const closeButton = document.querySelector(".cart-panel-close");

const panelImage = document.querySelector("#cart-panel-image");
const panelName = document.querySelector("#cart-panel-name");
const panelSize = document.querySelector("#cart-panel-size");
const panelPrice = document.querySelector("#cart-panel-price");

if (
    cartPanel &&
    cartOverlay &&
    closeButton &&
    panelImage &&
    panelName &&
    panelSize &&
    panelPrice
) {
    panelImage.src = product.image;
    panelImage.alt = product.name;
    panelName.textContent = product.name;
    panelSize.textContent = `Size: ${product.size}`;
    panelPrice.textContent = `£${product.price.toFixed(2)}`;

    cartPanel.classList.add("show");
    cartOverlay.classList.add("show");

    closeButton.onclick = () => {
        cartPanel.classList.remove("show");
        cartOverlay.classList.remove("show");
    };

    cartOverlay.onclick = () => {
        cartPanel.classList.remove("show");
        cartOverlay.classList.remove("show");
    };
}
    });
}
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log(productId);
const products = {
    carbon: {
        name: "ARIMEN Carbon Tracksuit",
        price: 45.99,
        images: [
            "../media/images/carbon.jpg",
            "../media/images/carbon 2.jpg",
            "../media/images/carbon 3.jpg"
        ]
    },

    emerald: {
        name: "ARIMEN Emerald Tracksuit",
        price: 99.99,
        images: [
            "../media/images/emerald.jpg",
            "../media/images/emerald 2.jpg",
            "../media/images/emerald 3.jpg"
        ]
    },

    storm: {
        name: "ARIMEN Storm Tracksuit",
        price: 59.99,
        images: [
            "../media/images/storm.jpg",
            "../media/images/storm 2.jpg",
            "../media/images/storm 3.jpg"
        ]
    },

    sandstone: {
        name: "ARIMEN Sandstone Tracksuit",
        price: 69.99,
        images: [
            "../media/images/sandstone.jpg",
            "../media/images/sandstone 2.jpg",
            "../media/images/sandstone 3.jpg"
        ]
    },

    titanium: {
        name: "ARIMEN Titanium Tracksuit",
        price: 89.99,
        images: [
            "../media/images/titanium.jpg",
            "../media/images/titanium 2.jpg",
            "../media/images/titanium 3.jpg"
        ]
    },

    void: {
        name: "ARIMEN Void Tracksuit",
        price: 49.99,
        images: [
            "../media/images/void.jpg",
            "../media/images/void 2.jpg",
            "../media/images/void 3.jpg"
        ]
    },

    desert: {
        name: "ARIMEN Desert Tracksuit",
        price: 69.99,
        images: [
            "../media/images/desert.jpg",
            "../media/images/desert 2.jpg",
            "../media/images/desert 3.jpg"
        ]
    },

    forest: {
        name: "ARIMEN Forest Tracksuit",
        price: 79.99,
        images: [
            "../media/images/forest.jpg",
            "../media/images/forest 2.jpg",
            "../media/images/forest 3.jpg"
        ]
    },

    graphite: {
        name: "ARIMEN Graphite Tracksuit",
        price: 84.99,
        images: [
            "../media/images/graphite.jpg",
            "../media/images/graphite 2.jpg",
            "../media/images/graphite 3.jpg"
        ]
    },

    ice: {
        name: "ARIMEN Ice Tracksuit",
        price: 74.99,
        images: [
            "../media/images/ice.jpg",
            "../media/images/ice 2.jpg",
            "../media/images/ice 3.jpg"
        ]
    },

    noir: {
        name: "ARIMEN Noir Tracksuit",
        price: 94.99,
        images: [
            "../media/images/noir.jpg",
            "../media/images/noir 2.jpg",
            "../media/images/noir 3.jpg"
        ]
    },

    shadow: {
        name: "ARIMEN Shadow Tracksuit",
        price: 79.99,
        images: [
            "../media/images/shadow.jpg",
            "../media/images/shadow 2.jpg",
            "../media/images/shadow 3.jpg"
        ]
    }
};
const selectedProduct = products[productId];

if (selectedProduct) {

    const title = document.querySelector(".product-information h1");
    const price = document.querySelector(".product-price");
   const mainImage = document.querySelector("#main-product-image");
const thumbnails = document.querySelectorAll(".product-thumbnails img");

title.textContent = selectedProduct.name;
price.textContent = "£" + selectedProduct.price.toFixed(2);

const productImages =
    selectedProduct.images ||
    [selectedProduct.image];

mainImage.src = productImages[0];
mainImage.alt = selectedProduct.name;

thumbnails.forEach((thumbnail, index) => {
    const imagePath =
        productImages[index] || productImages[0];

    thumbnail.src = imagePath;
    thumbnail.alt =
        `${selectedProduct.name} view ${index + 1}`;

    thumbnail.addEventListener("click", () => {
        mainImage.src = imagePath;

        thumbnails.forEach((item) => {
            item.classList.remove("active");
        });

        thumbnail.classList.add("active");
    });
});
}

// ===============================
// PRODUCT DETAILS WISHLIST BUTTON
// ===============================

const productWishlistButton =
    document.querySelector(".product-wishlist");

if (productWishlistButton) {
    const productTitle =
        document.querySelector(".product-information h1");

    if (productTitle) {
        const productName = productTitle.textContent.trim();

        function updateProductWishlistButton() {
            if (wishlist.includes(productName)) {
                productWishlistButton.textContent = "Remove from Wishlist";
                productWishlistButton.classList.add("active");
            } else {
                productWishlistButton.textContent = "Add to Wishlist";
                productWishlistButton.classList.remove("active");
            }
        }

        updateProductWishlistButton();

        productWishlistButton.addEventListener("click", () => {
            if (wishlist.includes(productName)) {
                wishlist = wishlist.filter(
                    (item) => item !== productName
                );
            } else {
                wishlist.push(productName);
            }

            localStorage.setItem(
                "arimenWishlist",
                JSON.stringify(wishlist)
            );

            updateProductWishlistButton();
        });
    }
}
// ================================
// WISHLIST PAGE
// ================================

const wishlistContainer = document.querySelector("#wishlist-items");

if (wishlistContainer) {
    const wishlist = JSON.parse(localStorage.getItem("arimenWishlist")) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    } else {
        wishlist.forEach((product) => {
            wishlistContainer.innerHTML += `
<div class="wishlist-item">

    <h3>${product}</h3>

    <button
    class="wishlist-cart"
    onclick="addWishlistItemToCart('${product}')">
    Add to Cart
</button>

    <button
        class="wishlist-remove"
        onclick="removeWishlistItem('${product}')">
        Remove
    </button>

</div>
`;
        });
    }
}

function removeWishlistItem(productName) {
    let wishlist =
        JSON.parse(localStorage.getItem("arimenWishlist")) || [];

    wishlist = wishlist.filter(item => item !== productName);

    localStorage.setItem(
        "arimenWishlist",
        JSON.stringify(wishlist)
    );

    location.reload();
}
function addWishlistItemToCart(productName) {
    alert(`${productName} needs a size before it can be added to the cart.`);
}