// Estado global
let productsData = [];
let currentCategory = '';

// Inicializar página
async function initializeCategoryPage() {
    // Obtener categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('cat') || '';
    
    // Cargar productos
    productsData = await loadProductsFromCSV();
    
    // Actualizar interfaz
    updateCategoryHeader();
    renderProducts();
    //setupCategoryFilters();
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(';').map(header => header.trim());
    
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(value => value.trim());
        const product = {};
        
        headers.forEach((header, index) => {
            product[header.toLowerCase()] = values[index] || '';
        });
        
        // Convertir precio a número
        product.precio = parseFloat(product.precio) || 0;
        
        products.push(product);
    }
    
    return products;
}

// Función para cargar desde archivo
async function loadProductsFromCSV(csvPath = '../csv_catalogo/CATALOGO.csv') {
    try {
        const response = await fetch(csvPath);
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error cargando CSV:', error);
        return [];
    }
}

// Actualizar header con la categoría
function updateCategoryHeader() {
    const categoryTitle = document.getElementById('category-title');
    const breadcrumb = document.querySelector('.current-category');
    
    if (categoryTitle) {
        categoryTitle.textContent = currentCategory || 'Todos los productos';
    }
    if (breadcrumb) {
        breadcrumb.textContent = currentCategory || 'Todos los productos';
    }
}

// Filtrar productos por categoría
function filterProductsByCategory() {
    console.log('Filtrando productos para la categoría:', currentCategory);
    if (!currentCategory) {
        return productsData; // Mostrar todos si no hay categoría seleccionada
    }
    
    return productsData.filter(product => 
        product.categoria.toLowerCase() === currentCategory.toLowerCase()
    );
}

// Renderizar productos filtrados
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = filterProductsByCategory();
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No hay productos en esta categoría</h3>
                <p>Prueba con otra categoría o vuelve más tarde</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${'../image_catalogo/' + product.ruta_imagen + '-1.jpeg' || 'https://via.placeholder.com/300x400'}" alt="${product.nombre}">
                </div>
                <div class="product-info">
                    <h3>${product.nombre}</h3>
                    <p class="product-brand">${product.marca}</p>
                    <div class="product-details">
                        <span class="product-size">Talla: ${product.talla}</span>
                        <span class="product-color">Color: ${product.color}</span>
                    </div>
                    <p class="product-price">€${product.precio}</p>
                    <button class="reserve-btn" onclick="reserveProduct('${product.nombre}')">
                        <i class="fas fa-shopping-bag"></i> Reservar
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateProductCount(filteredProducts.length);
}

// Actualizar contador de productos
function updateProductCount(count) {
    const countElement = document.getElementById('product-count');
    const showingElement = document.getElementById('showing-count');
    
    if (countElement) {
        countElement.textContent = `${count} productos encontrados`;
    }
    if (showingElement) {
        showingElement.textContent = `Mostrando ${count} de ${productsData.length} productos`;
    }
}

// Función de reserva
function reserveProduct(productName) {
    const phoneNumber = '+34123456789';
    const message = `Hola! Me interesa reservar: ${productName}. Por favor, contáctenme para concretar los detalles.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}


// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryPage();
});