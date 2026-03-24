/**
 * ============================================
 * SERVICE SEARCH - MAIN JAVASCRIPT
 * ============================================
 * 
 * Implements real-time service search with:
 * - Case-insensitive partial matching
 * - Dynamic result count
 * - Clear button functionality
 * - Popular tag click handlers
 * - Smooth animations
 */

// ============================================
// DOM ELEMENTS
// ============================================

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsContainer = document.getElementById('resultsContainer');
const resultCount = document.getElementById('resultCount');
const noResults = document.getElementById('noResults');
const initialState = document.getElementById('initialState');
const popularTags = document.querySelectorAll('.popular-tag');

// ============================================
// STATE MANAGEMENT
// ============================================

let currentSearchTerm = '';
let filteredResults = [];

// ============================================
// SEARCH LOGIC
// ============================================

/**
 * Filter services based on search term
 * Uses case-insensitive partial matching
 * 
 * @param {string} searchTerm - The search query
 * @returns {Array} - Filtered service providers
 */
function filterServices(searchTerm) {
    // If search term is empty, return empty array
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }

    // Convert search term to lowercase for case-insensitive matching
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    // Filter services using partial matching
    return serviceProviders.filter(service => {
        // Check if search term matches provider name, service name, or category
        const matchesProviderName = service.providerName.toLowerCase().includes(lowerSearchTerm);
        const matchesServiceName = service.serviceName.toLowerCase().includes(lowerSearchTerm);
        const matchesCategory = service.category.toLowerCase().includes(lowerSearchTerm);
        const matchesLocation = service.location.toLowerCase().includes(lowerSearchTerm);

        // Return true if any field matches
        return matchesProviderName || matchesServiceName || matchesCategory || matchesLocation;
    });
}

// ============================================
// UI RENDERING
// ============================================

/**
 * Create HTML for a single service card
 * 
 * @param {Object} service - Service provider data
 * @returns {string} - HTML string for the card
 */
function createServiceCard(service) {
    return `
        <div class="service-card">
            <div class="card-header">
                <div>
                    <h3 class="provider-name">${service.providerName}</h3>
                    <p class="service-name">${service.serviceName}</p>
                </div>
                <span class="category-badge">${service.category}</span>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <span class="card-info-icon">📍</span>
                    <span>${service.location}</span>
                </div>
                <div class="card-info">
                    <span class="card-info-icon">⭐</span>
                    <span>${service.rating} (${service.reviews} reviews)</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="price">
                    ${service.price}
                    <span class="price-label">${service.priceUnit}</span>
                </div>
                <button class="book-btn" onclick="bookService(${service.id})">Book Now</button>
            </div>
        </div>
    `;
}

/**
 * Render search results to the DOM
 * 
 * @param {Array} results - Filtered service providers
 */
function renderResults(results) {
    // Clear previous results
    resultsContainer.innerHTML = '';

    // If no search has been performed, show initial state
    if (currentSearchTerm === '') {
        initialState.style.display = 'block';
        noResults.style.display = 'none';
        resultCount.classList.add('hidden');
        return;
    }

    // Hide initial state
    initialState.style.display = 'none';

    // If no results found, show no results message
    if (results.length === 0) {
        noResults.style.display = 'block';
        resultCount.classList.add('hidden');
        return;
    }

    // Hide no results message
    noResults.style.display = 'none';

    // Render service cards
    results.forEach(service => {
        resultsContainer.innerHTML += createServiceCard(service);
    });

    // Update result count
    updateResultCount(results.length);
}

/**
 * Update the result count display
 * 
 * @param {number} count - Number of results
 */
function updateResultCount(count) {
    if (count === 0 || currentSearchTerm === '') {
        resultCount.classList.add('hidden');
        return;
    }

    resultCount.classList.remove('hidden');
    
    if (count === 1) {
        resultCount.textContent = '1 service found';
    } else {
        resultCount.textContent = `${count} services found`;
    }
}

// ============================================
// SEARCH HANDLERS
// ============================================

/**
 * Perform search and update UI
 */
function performSearch() {
    // Get search term from input
    currentSearchTerm = searchInput.value.trim();

    // Filter services
    filteredResults = filterServices(currentSearchTerm);

    // Render results
    renderResults(filteredResults);

    // Show/hide clear button
    if (currentSearchTerm !== '') {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }
}

/**
 * Clear search and reset UI
 */
function clearSearch() {
    // Clear input
    searchInput.value = '';
    currentSearchTerm = '';

    // Hide clear button
    clearBtn.classList.remove('visible');

    // Reset results
    filteredResults = [];
    resultsContainer.innerHTML = '';

    // Show initial state
    initialState.style.display = 'block';
    noResults.style.display = 'none';
    resultCount.classList.add('hidden');

    // Focus input
    searchInput.focus();
}

// ============================================
// EVENT LISTENERS
// ============================================

// Real-time search on input
searchInput.addEventListener('input', performSearch);

// Search button click
searchBtn.addEventListener('click', performSearch);

// Clear button click
clearBtn.addEventListener('click', clearSearch);

// Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Popular tag clicks
popularTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const searchTerm = tag.getAttribute('data-search');
        searchInput.value = searchTerm;
        performSearch();
    });
});

// ============================================
// BOOKING FUNCTION
// ============================================

/**
 * Handle booking button click
 * 
 * @param {number} serviceId - ID of the service to book
 */
function bookService(serviceId) {
    const service = serviceProviders.find(s => s.id === serviceId);
    
    if (service) {
        alert(`Booking ${service.serviceName} from ${service.providerName}\n\nPrice: ${service.price}${service.priceUnit}\nLocation: ${service.location}\n\nThis is a demo. In production, this would redirect to a booking page.`);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
function init() {
    console.log('Service Search initialized');
    console.log(`Total service providers: ${serviceProviders.length}`);
    
    // Show initial state
    initialState.style.display = 'block';
    noResults.style.display = 'none';
    resultCount.classList.add('hidden');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
