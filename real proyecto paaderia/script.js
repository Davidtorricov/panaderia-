document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const alertDiv = document.getElementById("fullscreenAlert");
    const alertMessage = document.getElementById("alertMessage");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const alertSound = new Audio("WWE.mp3");

    let products = JSON.parse(localStorage.getItem("products")) || [];

    // Intento de reproducción automática de la música de fondo
    backgroundMusic.play().catch(() => {
        document.addEventListener("click", () => backgroundMusic.play(), { once: true });
    });

    // Agregar producto
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const quantity = parseInt(document.getElementById("quantity").value, 10);
        const expiration = document.getElementById("expiration").value;

        const product = { name, description, quantity, expiration };
        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));

        productForm.reset();
        renderProducts();
    });

    // Mostrar productos en la tabla
    function renderProducts() {
        productList.innerHTML = "";
        const today = new Date().toISOString().split("T")[0];

        products.forEach((product, index) => {
            const row = document.createElement("tr");

            if (product.quantity < 5) {
                showAlert(`⚠️ Stock bajo: ${product.name}`);
            }
            if (product.expiration < today) {
                showAlert(`❌ Producto caducado: ${product.name}`);
            }

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.quantity}</td>
                <td>${product.expiration}</td>
                <td>
                    <button onclick="sellProduct(${index})">Vender (-1)</button>
                    <button onclick="deleteProduct(${index})">Eliminar</button>
                </td>
            `;
            productList.appendChild(row);
        });
    }

    // Mostrar alerta en pantalla completa con sonido
    function showAlert(message) {
        backgroundMusic.pause();
        alertSound.play();

        alertMessage.innerHTML = message;
        alertDiv.style.display = "flex";
    }

    // Cerrar alerta y reanudar música
    window.closeAlert = function () {
        alertSound.pause();
        alertSound.currentTime = 0;
        backgroundMusic.play();

        alertDiv.style.display = "none";
    };

    // Vender un producto (-1 en stock)
    window.sellProduct = function (index) {
        if (products[index].quantity > 0) {
            products[index].quantity--;
            localStorage.setItem("products", JSON.stringify(products));
            renderProducts();
        } else {
            showAlert(`❌ ${products[index].name} está agotado.`);
        }
    };

    // Eliminar un producto
    window.deleteProduct = function (index) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    };

    renderProducts();
});