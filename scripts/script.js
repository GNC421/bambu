// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Función para reservar productos
function reserveProduct(productName) {
    const phoneNumber = '+34667339317';
    const message = `Hola! Me interesa reservar: ${productName}. Por favor, contáctenme para concretar los detalles.`;
    
    // Opción 1: Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Opción 2: Abrir email (alternativa)
    // const email = 'hola@vintagecharm.com';
    // const subject = `Reserva: ${productName}`;
    // const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    // window.location.href = mailtoUrl;
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

// Carrusel de filosofía
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Función para actualizar el carrusel
    function updateCarousel() {
        carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Event listeners para botones
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });
    
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    });
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });
});

// Cargar cuando la página esté lista
loadLatestProducts();
