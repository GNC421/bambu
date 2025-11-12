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