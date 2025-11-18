
// Función para cargar y mostrar los últimos 6 productos
async function loadLatestProducts() {
    try {
        const products = await loadProductsFromJSON();
        const latestProducts = products.slice(-6).reverse(); // Últimos 6, más recientes primero
        
        const productsGrid = document.getElementById('latest-products');
        
        if (latestProducts.length === 0) {
            productsGrid.innerHTML = '<p>No hay productos disponibles</p>';
            return;
        }
        
        productsGrid.innerHTML = latestProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${'https://raw.githubusercontent.com/GNC421/bambu/main/image_catalogo/' + product.RUTA_IMAGEN + '-1.jpeg' || 'https://via.placeholder.com/300x400'}" alt="${product.NOMBRE}">
                </div>
                <div class="product-info">
                    <h3>${product.NOMBRE}</h3>
                    <p class="product-brand">${product.MARCA}</p>
                    <div class="product-details">
                        <span class="product-size">Talla: ${product.TALLA}</span>
                        <span class="product-color">Color: ${product.COLOR}</span>
                    </div>
                    <p class="product-price">€${product.PRECIO}</p>
                    <button class="reserve-btn" onclick="reserveProduct('${product.NOMBRE}')">
                        <i class="fas fa-shopping-bag"></i> Reservar
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error cargando últimos productos:', error);
        document.getElementById('latest-products').innerHTML = '<p>Error cargando productos</p>';
    }
}

// Cargar cuando la página esté lista
loadLatestProducts();