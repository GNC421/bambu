// Datos de ejemplo para productos
const productsData = [
    {
        id: 1,
        name: "Vestido floral años 70",
        price: 25,
        category: "vestidos",
        brand: "zara",
        size: "m",
        color: "estampado",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        isNew: true
    },
    {
        id: 2,
        name: "Chaqueta de mezclilla vintage",
        price: 35,
        category: "abrigos",
        brand: "levis",
        size: "l",
        color: "azul",
        image: "https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80"
    },
    {
        id: 3,
        name: "Blusa de seda estampada",
        price: 18,
        category: "camisas",
        brand: "h&m",
        size: "s",
        color: "rosa",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80"
    },
    {
        id: 4,
        name: "Falda plisada vintage",
        price: 22,
        category: "vestidos",
        brand: "mango",
        size: "xs",
        color: "negro",
        image: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=689&q=80"
    },
    {
        id: 5,
        name: "Jeans vintage Levi's",
        price: 45,
        category: "pantalones",
        brand: "levis",
        size: "m",
        color: "azul",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80"
    },
    {
        id: 6,
        name: "Vestido negro elegante",
        price: 32,
        category: "vestidos",
        brand: "zara",
        size: "l",
        color: "negro",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80"
    }
];

// Estado de los filtros
let currentFilters = {
    category: [],
    brand: [],
    size: [],
    color: [],
    minPrice: 0,
    maxPrice: 100
};

let currentSort = 'relevance';
let currentView = 'grid';
let currentCategory = 'vestidos';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    renderProducts();
});

function initializePage() {
    // Obtener categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('cat');
    if (categoryFromUrl) {
        currentCategory = categoryFromUrl;
        updateCategoryHeader();
        // Marcar la categoría en los filtros
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryFromUrl}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            currentFilters.category.push(categoryFromUrl);
        }
    }
}

function setupEventListeners() {
    // Filtros de checkbox
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Filtros de precio rápido
    document.querySelectorAll('.price-quick-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickPriceFilter);
    });

    // Inputs de precio
    document.getElementById('min-price').addEventListener('change', handlePriceInput);
    document.getElementById('max-price').addEventListener('change', handlePriceInput);

    // Ordenamiento
    document.getElementById('sort-select').addEventListener('change', handleSortChange);

    // Vista (grid/list)
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', handleViewChange);
    });

    // Limpiar filtros
    document.getElementById('clear-filters').addEventListener('click', clearAllFilters);
}

function handleFilterChange(e) {
    const filterType = e.target.name;
    const filterValue = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
        if (!currentFilters[filterType].includes(filterValue)) {
            currentFilters[filterType].push(filterValue);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(item => item !== filterValue);
    }

    renderProducts();
    updateActiveFilters();
}

function handleQuickPriceFilter(e) {
    const min = parseInt(e.target.dataset.min);
    const max = parseInt(e.target.dataset.max);
    
    currentFilters.minPrice = min;
    currentFilters.maxPrice = max;

    // Actualizar inputs
    document.getElementById('min-price').value = min;
    document.getElementById('max-price').value = max;

    // Remover active de otros botones
    document.querySelectorAll('.price-quick-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    renderProducts();
    updateActiveFilters();
}

function handlePriceInput(e) {
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || 100;

    currentFilters.minPrice = minPrice;
    currentFilters.maxPrice = maxPrice;

    // Actualizar botones rápidos
    document.querySelectorAll('.price-quick-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    renderProducts();
    updateActiveFilters();
}

function handleSortChange(e) {
    currentSort = e.target.value;
    renderProducts();
}

function handleViewChange(e) {
    const view = e.target.closest('.view-btn').dataset.view;
    currentView = view;

    // Actualizar botones de vista
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.closest('.view-btn').classList.add('active');

    // Actualizar grid
    const productsGrid = document.getElementById('products-grid');
    productsGrid.className = `products-grid ${view}-view`;
}

function clearAllFilters() {
    // Resetear todos los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Resetear precio
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.querySelectorAll('.price-quick-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Resetear estado
    currentFilters = {
        category: [],
        brand: [],
        size: [],
        color: [],
        minPrice: 0,
        maxPrice: 100
    };

    renderProducts();
    updateActiveFilters();
}

function updateCategoryHeader() {
    const categoryTitles = {
        'vestidos': 'Vestidos',
        'camisas': 'Camisas y Blusas',
        'pantalones': 'Pantalones y Jeans',
        'abrigos': 'Abrigos y Chaquetas',
        'accesorios': 'Accesorios',
        'calzado': 'Calzado'
    };

    document.getElementById('category-title').textContent = categoryTitles[currentCategory] || 'Categoría';
    document.querySelector('.current-category').textContent = categoryTitles[currentCategory] || 'Categoría';
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = filterProducts();
    const sortedProducts = sortProducts(filteredProducts);

    if (sortedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No encontramos productos con estos filtros</h3>
                <p>¿Por qué no intentas con otros criterios?</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = sortedProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.isNew ? '<span class="product-badge">Nuevo</span>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-brand">${getBrandName(product.brand)}</p>
                    <div class="product-details">
                        <span class="product-size">Talla: ${product.size.toUpperCase()}</span>
                        <span class="product-color">Color: ${product.color}</span>
                    </div>
                    <p class="product-price">€${product.price},00</p>
                    <button class="reserve-btn" onclick="reserveProduct('${product.name}')">
                        <i class="fas fa-shopping-bag"></i> Reservar
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateProductCount(sortedProducts.length);
}

function filterProducts() {
    return productsData.filter(product => {
        // Filtro por categoría principal
        if (currentCategory && product.category !== currentCategory) {
            return false;
        }

        // Filtros adicionales
        if (currentFilters.category.length > 0 && !currentFilters.category.includes(product.category)) {
            return false;
        }

        if (currentFilters.brand.length > 0 && !currentFilters.brand.includes(product.brand)) {
            return false;
        }

        if (currentFilters.size.length > 0 && !currentFilters.size.includes(product.size)) {
            return false;
        }

        if (currentFilters.color.length > 0 && !currentFilters.color.includes(product.color)) {
            return false;
        }

        if (product.price < currentFilters.minPrice || product.price > currentFilters.maxPrice) {
            return false;
        }

        return true;
    });
}

function sortProducts(products) {
    switch (currentSort) {
        case 'price-asc':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-desc':
            return [...products].sort((a, b) => b.price - a.price);
        case 'newest':
            return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        default:
            return products;
    }
}

function getBrandName(brandKey) {
    const brands = {
        'levis': "Levi's",
        'zara': 'Zara',
        'h&m': 'H&M',
        'mango': 'Mango',
        'otras': 'Otras marcas'
    };
    return brands[brandKey] || brandKey;
}

function updateProductCount(count) {
    document.getElementById('product-count').textContent = `${count} productos encontrados`;
    document.getElementById('showing-count').textContent = `Mostrando ${count} de ${productsData.length} productos`;
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const activeFilters = [];

    // Categorías
    currentFilters.category.forEach(cat => {
        activeFilters.push({
            type: 'category',
            value: cat,
            label: getCategoryLabel(cat)
        });
    });

    // Marcas
    currentFilters.brand.forEach(brand => {
        activeFilters.push({
            type: 'brand',
            value: brand,
            label: getBrandName(brand)
        });
    });

    // Tallas
    currentFilters.size.forEach(size => {
        activeFilters.push({
            type: 'size',
            value: size,
            label: size.toUpperCase()
        });
    });

    // Colores
    currentFilters.color.forEach(color => {
        activeFilters.push({
            type: 'color',
            value: color,
            label: color.charAt(0).toUpperCase() + color.slice(1)
        });
    });

    // Precio
    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < 100) {
        activeFilters.push({
            type: 'price',
            value: 'price',
            label: `€${currentFilters.minPrice}-€${currentFilters.maxPrice}`
        });
    }

    if (activeFilters.length === 0) {
        activeFiltersContainer.innerHTML = '';
        return;
    }

    activeFiltersContainer.innerHTML = activeFilters.map(filter => `
        <div class="active-filter-tag">
            ${filter.label}
            <button class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function getCategoryLabel(category) {
    const labels = {
        'vestidos': 'Vestidos',
        'camisas': 'Camisas/Blusas',
        'pantalones': 'Pantalones/Jeans',
        'abrigos': 'Abrigos/Chaquetas',
        'accesorios': 'Accesorios',
        'calzado': 'Calzado'
    };
    return labels[category] || category;
}

function removeFilter(type, value) {
    if (type === 'price') {
        currentFilters.minPrice = 0;
        currentFilters.maxPrice = 100;
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.querySelectorAll('.price-quick-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    } else {
        currentFilters[type] = currentFilters[type].filter(item => item !== value);
        const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }

    renderProducts();
    updateActiveFilters();
}

// Función para reservar (compartida con el index)
function reserveProduct(productName) {
    const phoneNumber = '+34123456789';
    const message = `Hola! Me interesa reservar: ${productName}. Por favor, contáctenme para concretar los detalles.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}