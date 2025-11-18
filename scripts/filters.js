let currentFilters = {
    brand: [],
    size: [], 
    color: [],
    minPrice: 0,
    maxPrice: 999
};

let emptyFilters = {
    brand: [],
    size: [], 
    color: [],
    minPrice: 0,
    maxPrice: 999
};

function areFiltersEmpty() {
    return JSON.stringify(getCurrentFilters()) === JSON.stringify(emptyFilters);
}

let productsDataFiltered = [];

const colorMap = {
    'MARRON': '#8B4513',
    'MARRÓN': '#8B4513', 
    'CAFE': '#683510ff',
    'CAFÉ': '#683510ff',
    'BROWN': '#8B4513',
    'NEGRO': '#000000',
    'BLANCO': '#FFFFFF',
    'ROJO': '#FF0000',
    'AZUL': '#0000FF',
    'VERDE': '#008000',
    'ROSA': '#FFC0CB',
    'AMARILLO': '#FFFF00',
    'GRIS': '#808080',
    'NARANJA': '#FFA500',
    'MORADO': '#800080',
    'BEIGE': '#F5F5DC',
    'LILA': '#E6E6FA',
    'TURQUESA': '#40E0D0',
    'MOSTAZA': '#FFDB58'
};

function getColorHex(colorName) {
    return colorMap[colorName.toUpperCase()] || '#CCCCCC';
}

// Inicializar filtros
function initializeFilters(products) {
    productsDataFiltered = products;
    setupMobileFilters();
    setupPriceFilters();
    generateDynamicFilters(); // Ahora genera filtros basados en los productos
    setupFilterEvents();
}

// Generar filtros dinámicos basados en productsDataFiltered
function generateDynamicFilters() {
    generateBrandFilters();
    generateSizeFilters();
    generateColorFilters();
}

// Configurar eventos de precio
function setupPriceFilters() {

    // Inputs de precio manual
    document.getElementById('min-price').addEventListener('change', handlePriceInput);
    document.getElementById('max-price').addEventListener('change', handlePriceInput);

    applyFilters();
}

// Generar filtros de marcas dinámicamente
function generateBrandFilters() {
    // Obtener marcas únicas de los productos actuales
    const brands = [...new Set(productsDataFiltered.map(p => p.MARCA))].sort();
    const brandContainer = document.querySelector('.filter-options-brands');
    
    if (brandContainer) {
        if (brands.length === 0) {
            brandContainer.innerHTML = '<p>No hay marcas disponibles</p>';
            return;
        }
        
        brandContainer.innerHTML = brands.map(brand => `
            <label class="filter-option">
                <input type="checkbox" name="brand" value="${brand}">
                <span class="checkmark"></span>
                ${brand}
            </label>
        `).join('');
    }
}

// Generar filtros de tallas dinámicamente
function generateSizeFilters() {
    // Obtener marcas únicas de los productos actuales
    const brands = [...new Set(productsDataFiltered.map(p => p.TALLA))].sort();
    const brandContainer = document.querySelector('.filter-options-sizes');
    
    if (brandContainer) {
        if (brands.length === 0) {
            brandContainer.innerHTML = '<p>No hay marcas disponibles</p>';
            return;
        }
        
        brandContainer.innerHTML = brands.map(brand => `
            <label class="filter-option">
                <input type="checkbox" name="size" value="${brand}">
                <span class="checkmark"></span>
                ${brand}
            </label>
        `).join('');
    }
}

//Mostrar filtros de color dinámicamente
function generateColorFilters() {
    const availableColors = [...new Set(productsDataFiltered.map(p => p.COLOR))];
    const colorContainer = document.querySelector('.color-filters');
    
    if (!colorContainer) return;
    
    // Convertir colores disponibles a mayúsculas para comparación
    const availableSet = new Set(availableColors.map(c => c.toUpperCase()));
    
    // Generar HTML solo para los colores disponibles
    const colorFiltersHTML = Object.keys(colorMap)
        .filter(colorKey => availableSet.has(colorKey))
        .map(colorKey => {
            const hexColor = colorMap[colorKey];
            const borderStyle = colorKey === 'BLANCO' ? 'border: 1px solid #ddd;' : '';
            
            return `
                <label class="color-option">
                    <input type="checkbox" name="color" value="${colorKey.toLowerCase()}">
                    <span class="color-swatch" style="background-color: ${hexColor}; ${borderStyle}"></span>
                    ${colorKey.charAt(0) + colorKey.slice(1).toLowerCase()}
                </label>
            `;
        })
        .join('');
    
    colorContainer.innerHTML = colorFiltersHTML;
}

// Manejar cambio en inputs de precio
function handlePriceInput() {
    currentFilters.minPrice = parseInt(document.getElementById('min-price').value) || 0;
    currentFilters.maxPrice = parseInt(document.getElementById('max-price').value) || 100;
    
    applyFilters();
}

// Configurar eventos de filtros
function setupFilterEvents() {
    // Event delegation para checkboxes de marca
    document.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && (e.target.name === 'brand' || e.target.name === 'size' || e.target.name === 'color')) {
            handleFilterChange(e.target.name, e.target.value, e.target.checked);
        }
    });
    
    // Limpiar filtros
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
}

// Manejar cambio de filtros
function handleFilterChange(filterType, filterValue, isChecked) {
    if (isChecked) {
        if (!currentFilters[filterType].includes(filterValue)) {
            currentFilters[filterType].push(filterValue);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(item => item !== filterValue);
    }
    applyFilters();
}

// Aplicar filtros
function applyFilters() {
    const filteredProducts = productsDataFiltered.filter(product => {
        // Filtro por marca
        if (currentFilters.brand.length > 0 && !currentFilters.brand.includes(product.MARCA)) {
            return false;
        }

        // Filtro por talla
        if (currentFilters.size.length > 0 && !currentFilters.size.includes(product.TALLA +"")) {
            return false;
        }

        // Filtro por color
        if (currentFilters.color.length > 0 && !currentFilters.color.includes(product.COLOR.toLowerCase())) {
            return false;
        }

        if (product.PRECIO < currentFilters.minPrice || product.PRECIO > currentFilters.maxPrice) {
            return false;
        }
        
        return true;
    });
    
    // Disparar evento personalizado
    const event = new CustomEvent('filtersUpdated', { detail: filteredProducts });
    document.dispatchEvent(event);
}

// Limpiar todos los filtros
function clearAllFilters() {
    currentFilters = emptyFilters;
    
    // Desmarcar todos los checkboxes
    document.querySelectorAll('input[name="size"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[name="color"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    
    applyFilters();
}

// Actualizar filtros cuando cambien los productos (para categorías)
function updateFilters(newProducts) {
    productsDataFiltered = newProducts;
    generateDynamicFilters();
    clearAllFilters(); // Limpiar filtros al cambiar de categoría
}

// Obtener filtros actuales
function getCurrentFilters() {
    return currentFilters;
}


// En setupMobileFilters(), añade esto:
function setupMobileFilters() {
    const mobileToggle = document.getElementById('mobile-filters-toggle');
    const filtersSidebar = document.getElementById('filters-sidebar');
    const closeFilters = document.getElementById('close-filters');
    
    if (mobileToggle && filtersSidebar && closeFilters) {
        // Abrir filtros
        mobileToggle.addEventListener('click', () => {
            filtersSidebar.classList.add('active');
        });
        
        // Cerrar filtros
        closeFilters.addEventListener('click', () => {
            filtersSidebar.classList.remove('active');
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!filtersSidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                filtersSidebar.classList.remove('active');
            }
        });
    }
}