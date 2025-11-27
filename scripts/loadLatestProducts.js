
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
        
        renderLatestProducts(latestProducts, productsGrid);

        // Inicializar sliders de productos
        document.querySelectorAll('.product-image-slider').forEach(slider => {
            initSlider(slider);
        });
        
    } catch (error) {
        console.error('Error cargando últimos productos:', error);
        document.getElementById('latest-products').innerHTML = '<p>Error cargando productos</p>';
    }
}

function renderLatestProducts(latestProducts, productsGrid) {
    
    if (latestProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No hay productos en esta categoría</h3>
                <p>Prueba con otra categoría o vuelve más tarde</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = latestProducts.map(product =>`
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

function initSlider(slider) {
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

// Cargar cuando la página esté lista
loadLatestProducts();