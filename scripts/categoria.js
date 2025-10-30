// Estado global
let productsData = [];
let currentCategory = '';
let currentPage = 1;
const productsPerPage = 6;

// Inicializar página
async function initializeCategoryPage() {
    // Obtener categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('cat') || '';
    
    // Cargar productos
    productsData = await loadProductsFromJSON();
    
    // Actualizar interfaz
    updateCategoryHeader();
    renderProducts();
    updatePageHeader();

    // Añadir event listeners a la paginación
    document.querySelector('.pagination-btn:first-child').addEventListener('click', goToPreviousPage);
    document.querySelector('.pagination-btn:last-child').addEventListener('click', goToNextPage);
}

// Función principal para cargar productos desde JSON
async function loadProductsFromJSON() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/GNC421/bambu/csvImport/csv_catalogo/inventario.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        console.log(`✅ JSON cargado correctamente: ${products.length} productos`);
        return products;
    } catch (error) {
        console.error('❌ Error cargando JSON:', error);
        console.log('📦 Cargando datos de ejemplo...');
        return []; // Retorna un array vacío en caso de error
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
        product.CATEGORIA.toLowerCase() === currentCategory.toLowerCase()
    );
}

// Renderizar productos filtrados
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const paginatedProducts = getPaginatedProducts();
    
    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No hay productos en esta categoría</h3>
                <p>Prueba con otra categoría o vuelve más tarde</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = paginatedProducts.map(product =>`
            <div class="product-card">
                <div class="product-image">
                    <img src="${'../image_catalogo/' + product.RUTA_IMAGEN + '-1.jpeg' || 'https://via.placeholder.com/300x400'}" alt="${product.NOMBRE}">
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
    }
    
    updateProductCount();
    updatePagination();
}

// Actualizar header de la página
function updatePageHeader() {
    const pageTitle = document.getElementById('category-title');
    const breadcrumb = document.querySelector('.current-category');
    
    if (pageTitle) {
        pageTitle.textContent = 'Todos los Productos';
    }
    if (breadcrumb) {
        breadcrumb.textContent = 'Todos los productos';
    }
}

function getPaginatedProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filterProductsByCategory().slice(startIndex, endIndex);
}

function updatePagination() {
    const totalPages = Math.ceil(filterProductsByCategory().length / productsPerPage);
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    const paginationInfo = document.querySelector('.pagination-info');
    
    // Actualizar info
    paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    // Actualizar botones
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
}

function goToNextPage() {
    console.log('Intentando ir a la siguiente página');
    const totalPages = Math.ceil(productsData.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
    }
}

function updateProductCount() {
    const countElement = document.getElementById('product-count');
    const showingElement = document.getElementById('showing-count');
    const totalProducts = filterProductsByCategory().length;
    const showingProducts = getPaginatedProducts().length;
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(startIndex + showingProducts - 1, totalProducts);
    
    if (countElement) {
        countElement.textContent = `${totalProducts} productos en total`;
    }
    if (showingElement) {
        showingElement.textContent = `Mostrando ${startIndex}-${endIndex} de ${totalProducts} productos`;
    }
}

// Función de reserva
function reserveProduct(productName) {
    const phoneNumber = '+34 667 33 93 17';
    const message = `Hola! Me interesa reservar: ${productName}. Por favor, contáctenme para concretar los detalles.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}


// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryPage();
});