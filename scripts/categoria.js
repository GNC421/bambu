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

    // Inicializar filtros con los productos cargados
    if (typeof initializeFilters === 'function') {
        initializeFilters(filterProductsByCategory());
    }
    
    // Escuchar cambios de filtros
    document.addEventListener('filtersUpdated', (e) => {
        productsData = e.detail;
        renderProducts();
    });

    // Añadir event listeners a la paginación
    document.querySelector('.pagination-btn:first-child').addEventListener('click', goToPreviousPage);
    document.querySelector('.pagination-btn:last-child').addEventListener('click', goToNextPage);

    // Inicializar sliders de productos
    document.querySelectorAll('.product-image-slider').forEach(slider => {
        initSlider(slider);
    });
}

// Función principal para cargar productos desde JSON
async function loadProductsFromJSON() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/GNC421/bambu/main/csv_catalogo/inventario.json');
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
    if (!currentCategory) {
        return productsData; // Mostrar todos si no hay categoría seleccionada
    }
    
    return productsData.filter(product => 
        product.CATEGORIA.toLowerCase() === currentCategory.toLowerCase()
    );
}

// Renderizar productos
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
                ${generateProductSlider(product)}
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
    return productsData.slice(startIndex, endIndex);
}

function updatePagination() {
    const length = productsData.length;
    const totalPages = Math.ceil(length / productsPerPage);
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
    const totalPages = Math.ceil(productsData / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
    }
}

function updateProductCount() {
    const length = productsData.length;
    const countElement = document.getElementById('product-count');
    const showingElement = document.getElementById('showing-count');
    const showingProducts = getPaginatedProducts().length;
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(startIndex + showingProducts - 1, length);
    
    if (countElement) {
        countElement.textContent = `${length} productos en total`;
    }
    if (showingElement) {
        showingElement.textContent = `Mostrando ${startIndex}-${endIndex} de ${length} productos`;
    }
}

// Función de reserva
function reserveProduct(productName) {
    const phoneNumber = '+34 667 33 93 17';
    const message = `Hola! Me interesa reservar: ${productName}. Por favor, contáctenme para concretar los detalles.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function generateProductSlider(product) {
    const baseUrl = 'https://raw.githubusercontent.com/GNC421/bambu/main/image_catalogo/';
    const imageFiles = product.RUTA_IMAGEN;
    const images = imageFiles.map(file => `${baseUrl}${file}`);
    
    return `
        <div class="product-image-slider">
            <div class="slider-container">
                ${images.map((imgSrc, index) => `
                    <img src="${imgSrc}" 
                         alt="${product.NOMBRE}" 
                         class="slider-image ${index === 0 ? 'active' : ''}">
                `).join('')}
            </div>
            ${images.length > 1 ? `
                <button class="slider-prev">‹</button>
                <button class="slider-next">›</button>
                <div class="slider-dots">
                    ${images.map((_, index) => `
                        <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}


// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryPage();
});

function initSlider(slider) {
    console.log('Inicializando slider:', slider);
    const images = Array.from(slider.querySelectorAll('.slider-image'))
        .filter(img => img.style.display !== 'none'); // Solo imágenes visibles
    
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    let currentIndex = 0;
    
    function showSlide(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (images[index]) {
            images[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        }
    }
    
    // Ocultar controles si solo hay 1 imagen visible
    if (images.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (slider.querySelector('.slider-dots')) {
            slider.querySelector('.slider-dots').style.display = 'none';
        }
        return;
    }
    
    prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = images.length - 1;
        showSlide(newIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= images.length) newIndex = 0;
        showSlide(newIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
}