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
    const phoneNumber = '+34123456789';
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

// Función para cargar CSV (la misma que usas en categoria.js)
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

// Función parseCSV simplificada
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

    console.log('Productos cargados desde CSV:', products);
    
    return products;
}

// Función para cargar y mostrar los últimos 6 productos
async function loadLatestProducts() {
    try {
        const products = await loadProductsFromCSV();
        const latestProducts = products.slice(-6).reverse(); // Últimos 6, más recientes primero
        
        const productsGrid = document.getElementById('latest-products');
        
        if (latestProducts.length === 0) {
            productsGrid.innerHTML = '<p>No hay productos disponibles</p>';
            return;
        }
        
        productsGrid.innerHTML = latestProducts.map(product => `
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
        
    } catch (error) {
        console.error('Error cargando últimos productos:', error);
        document.getElementById('latest-products').innerHTML = '<p>Error cargando productos</p>';
    }
}

// Cargar cuando la página esté lista
loadLatestProducts();