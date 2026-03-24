// ===================================
// DATA STRUCTURE - Service Providers Array
// ===================================
const serviceProviders = [
    {
        id: 1,
        providerName: "QuickFix Solutions",
        brandName: "QuickFix Pro",
        category: "Plumbing",
        serviceArea: "Mumbai",
        rating: 4.8,
        priceRange: "₹500 - ₹1500",
        timeSlots: [
            { time: "9:00 AM - 11:00 AM", price: 500, label: "Morning" },
            { time: "12:00 PM - 2:00 PM", price: 700, label: "Afternoon" },
            { time: "5:00 PM - 7:00 PM", price: 1000, label: "Evening" }
        ]
    },
    {
        id: 2,
        providerName: "Elite Electricals",
        brandName: "PowerPro Services",
        category: "Electrical",
        serviceArea: "Mumbai",
        rating: 4.9,
        priceRange: "₹600 - ₹1800",
        timeSlots: [
            { time: "8:00 AM - 10:00 AM", price: 600, label: "Morning" },
            { time: "1:00 PM - 3:00 PM", price: 900, label: "Afternoon" },
            { time: "6:00 PM - 8:00 PM", price: 1200, label: "Evening" }
        ]
    },
    {
        id: 3,
        providerName: "SparkClean Services",
        brandName: "SparkClean Pro",
        category: "Cleaning",
        serviceArea: "Delhi",
        rating: 4.7,
        priceRange: "₹400 - ₹1200",
        timeSlots: [
            { time: "7:00 AM - 9:00 AM", price: 400, label: "Morning" },
            { time: "11:00 AM - 1:00 PM", price: 600, label: "Afternoon" },
            { time: "4:00 PM - 6:00 PM", price: 800, label: "Evening" }
        ]
    },
    {
        id: 4,
        providerName: "Glamour Salon",
        brandName: "Glamour Studio",
        category: "Salon",
        serviceArea: "Bangalore",
        rating: 4.6,
        priceRange: "₹800 - ₹2000",
        timeSlots: [
            { time: "10:00 AM - 12:00 PM", price: 800, label: "Morning" },
            { time: "2:00 PM - 4:00 PM", price: 1200, label: "Afternoon" },
            { time: "6:00 PM - 8:00 PM", price: 1500, label: "Evening" }
        ]
    },
    {
        id: 5,
        providerName: "Master Carpenters",
        brandName: "WoodCraft Masters",
        category: "Carpentry",
        serviceArea: "Delhi",
        rating: 4.5,
        priceRange: "₹700 - ₹2500",
        timeSlots: [
            { time: "8:00 AM - 10:00 AM", price: 700, label: "Morning" },
            { time: "12:00 PM - 2:00 PM", price: 1000, label: "Afternoon" },
            { time: "5:00 PM - 7:00 PM", price: 1500, label: "Evening" }
        ]
    },
    {
        id: 6,
        providerName: "ColorPro Painters",
        brandName: "ColorPro Elite",
        category: "Painting",
        serviceArea: "Bangalore",
        rating: 4.8,
        priceRange: "₹1000 - ₹3000",
        timeSlots: [
            { time: "7:00 AM - 9:00 AM", price: 1000, label: "Morning" },
            { time: "11:00 AM - 1:00 PM", price: 1500, label: "Afternoon" },
            { time: "4:00 PM - 6:00 PM", price: 2000, label: "Evening" }
        ]
    },
    {
        id: 7,
        providerName: "HomeFlow Plumbing",
        brandName: "HomeFlow Services",
        category: "Plumbing",
        serviceArea: "Pune",
        rating: 4.7,
        priceRange: "₹450 - ₹1400",
        timeSlots: [
            { time: "9:00 AM - 11:00 AM", price: 450, label: "Morning" },
            { time: "1:00 PM - 3:00 PM", price: 650, label: "Afternoon" },
            { time: "6:00 PM - 8:00 PM", price: 950, label: "Evening" }
        ]
    },
    {
        id: 8,
        providerName: "BrightSpark Electricals",
        brandName: "BrightSpark Pro",
        category: "Electrical",
        serviceArea: "Pune",
        rating: 4.6,
        priceRange: "₹550 - ₹1600",
        timeSlots: [
            { time: "8:00 AM - 10:00 AM", price: 550, label: "Morning" },
            { time: "12:00 PM - 2:00 PM", price: 800, label: "Afternoon" },
            { time: "5:00 PM - 7:00 PM", price: 1100, label: "Evening" }
        ]
    },
    {
        id: 9,
        providerName: "FreshHome Cleaners",
        brandName: "FreshHome Elite",
        category: "Cleaning",
        serviceArea: "Mumbai",
        rating: 4.9,
        priceRange: "₹500 - ₹1500",
        timeSlots: [
            { time: "7:00 AM - 9:00 AM", price: 500, label: "Morning" },
            { time: "11:00 AM - 1:00 PM", price: 750, label: "Afternoon" },
            { time: "4:00 PM - 6:00 PM", price: 1000, label: "Evening" }
        ]
    },
    {
        id: 10,
        providerName: "Style Studio",
        brandName: "Style Studio Premium",
        category: "Salon",
        serviceArea: "Delhi",
        rating: 4.8,
        priceRange: "₹900 - ₹2500",
        timeSlots: [
            { time: "10:00 AM - 12:00 PM", price: 900, label: "Morning" },
            { time: "2:00 PM - 4:00 PM", price: 1400, label: "Afternoon" },
            { time: "6:00 PM - 8:00 PM", price: 1800, label: "Evening" }
        ]
    }
];

// ===================================
// GLOBAL STATE VARIABLES
// ===================================
let filteredProviders = [];
let selectedTimeSlots = {}; // Store selected time slot for each provider

// ===================================
// DOM ELEMENTS
// ===================================
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const providersContainer = document.getElementById('providers-container');
const noResults = document.getElementById('no-results');
const resultsInfo = document.getElementById('results-info');
const bookingsContainer = document.getElementById('bookings-container');
const bookingModal = document.getElementById('booking-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeModalX = document.querySelector('.close-modal');

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
    
    // Event Listeners
    searchBtn.addEventListener('click', searchProviders);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProviders();
    });
    categoryFilter.addEventListener('change', applyFiltersAndSort);
    sortFilter.addEventListener('change', applyFiltersAndSort);
    closeModalBtn.addEventListener('click', closeModal);
    closeModalX.addEventListener('click', closeModal);
    
    // Close modal on outside click
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });
});

// ===================================
// LOCATION FILTERING LOGIC
// ===================================
function searchProviders() {
    const location = locationInput.value.trim();
    
    // Validation: Location cannot be empty
    if (!location) {
        alert('⚠️ Please enter a city name to search for providers.');
        locationInput.focus();
        return;
    }
    
    // Filter providers by service area (case-insensitive)
    filteredProviders = serviceProviders.filter(provider => 
        provider.serviceArea.toLowerCase() === location.toLowerCase()
    );
    
    // Reset selected time slots when searching new location
    selectedTimeSlots = {};
    
    // Apply category filter and sorting
    applyFiltersAndSort();
}

// ===================================
// CATEGORY FILTERING & SORTING LOGIC
// ===================================
function applyFiltersAndSort() {
    let providers = [...filteredProviders];
    
    // Apply category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
        providers = providers.filter(p => p.category === selectedCategory);
    }
    
    // Apply sorting
    const sortBy = sortFilter.value;
    
    switch(sortBy) {
        case 'price-low':
            // Sort by minimum price (first time slot price)
            providers.sort((a, b) => {
                const minPriceA = Math.min(...a.timeSlots.map(slot => slot.price));
                const minPriceB = Math.min(...b.timeSlots.map(slot => slot.price));
                return minPriceA - minPriceB;
            });
            break;
            
        case 'price-high':
            // Sort by maximum price (last time slot price)
            providers.sort((a, b) => {
                const maxPriceA = Math.max(...a.timeSlots.map(slot => slot.price));
                const maxPriceB = Math.max(...b.timeSlots.map(slot => slot.price));
                return maxPriceB - maxPriceA;
            });
            break;
            
        case 'rating':
            // Sort by highest rating
            providers.sort((a, b) => b.rating - a.rating);
            break;
            
        default:
            // Default order (no sorting)
            break;
    }
    
    displayProviders(providers);
}

// ===================================
// DISPLAY PROVIDERS (RENDER UI)
// ===================================
function displayProviders(providers) {
    providersContainer.innerHTML = '';
    
    if (providers.length === 0) {
        noResults.style.display = 'block';
        resultsInfo.textContent = '';
        return;
    }
    
    noResults.style.display = 'none';
    resultsInfo.textContent = `✅ Found ${providers.length} provider(s) in your area`;
    
    providers.forEach(provider => {
        const card = createProviderCard(provider);
        providersContainer.appendChild(card);
    });
}

// ===================================
// CREATE PROVIDER CARD
// ===================================
function createProviderCard(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card';
    
    // Get selected time slot for this provider (if any)
    const selectedSlot = selectedTimeSlots[provider.id];
    const currentPrice = selectedSlot ? selectedSlot.price : provider.timeSlots[0].price;
    
    card.innerHTML = `
        <div class="provider-header">
            <h2 class="provider-name">${provider.providerName}</h2>
            <div class="brand-name">🏢 ${provider.brandName}</div>
            <div class="provider-meta">
                <span class="category-badge">${provider.category}</span>
                <span class="meta-item">📍 ${provider.serviceArea}</span>
                <span class="meta-item rating">⭐ ${provider.rating}</span>
            </div>
        </div>
        
        <div class="time-slots-section">
            <h3>⏰ Available Time Slots:</h3>
            <div class="time-slots" id="time-slots-${provider.id}">
                ${provider.timeSlots.map((slot, index) => `
                    <button 
                        class="time-slot ${selectedSlot && selectedSlot.time === slot.time ? 'selected' : ''}" 
                        data-provider-id="${provider.id}"
                        data-slot-index="${index}"
                        onclick="selectTimeSlot(${provider.id}, ${index})"
                    >
                        ${slot.time}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div class="price-section">
            <div class="price-label">Current Price:</div>
            <div class="price-value" id="price-${provider.id}">₹${currentPrice}</div>
            <div class="price-range">Range: ${provider.priceRange}</div>
        </div>
        
        <button 
            class="btn btn-success" 
            onclick="bookService(${provider.id})"
            style="width: 100%; margin-top: 15px;"
        >
            📅 Book Now
        </button>
    `;
    
    return card;
}

// ===================================
// TIME SLOT SELECTION & PRICE UPDATE
// ===================================
function selectTimeSlot(providerId, slotIndex) {
    // Find the provider
    const provider = serviceProviders.find(p => p.id === providerId);
    if (!provider) return;
    
    // Get the selected slot
    const selectedSlot = provider.timeSlots[slotIndex];
    
    // Store the selection
    selectedTimeSlots[providerId] = selectedSlot;
    
    // Update UI - highlight selected slot
    const slotsContainer = document.getElementById(`time-slots-${providerId}`);
    const allSlots = slotsContainer.querySelectorAll('.time-slot');
    allSlots.forEach((slot, index) => {
        if (index === slotIndex) {
            slot.classList.add('selected');
        } else {
            slot.classList.remove('selected');
        }
    });
    
    // Update price dynamically
    const priceElement = document.getElementById(`price-${providerId}`);
    priceElement.textContent = `₹${selectedSlot.price}`;
    
    // Add animation effect
    priceElement.style.transform = 'scale(1.2)';
    priceElement.style.color = '#11998e';
    setTimeout(() => {
        priceElement.style.transform = 'scale(1)';
        priceElement.style.color = '#667eea';
    }, 300);
}

// ===================================
// BOOKING FUNCTIONALITY
// ===================================
function bookService(providerId) {
    // Find the provider
    const provider = serviceProviders.find(p => p.id === providerId);
    if (!provider) return;
    
    // Validation: Must select time slot before booking
    const selectedSlot = selectedTimeSlots[providerId];
    if (!selectedSlot) {
        alert('⚠️ Please select a time slot before booking!');
        return;
    }
    
    // Create booking object
    const booking = {
        id: Date.now(), // Unique booking ID
        providerId: provider.id,
        providerName: provider.providerName,
        brandName: provider.brandName,
        category: provider.category,
        serviceArea: provider.serviceArea,
        timeSlot: selectedSlot.time,
        price: selectedSlot.price,
        bookingDate: new Date().toLocaleString(),
        status: 'Confirmed'
    };
    
    // Save to localStorage
    saveBooking(booking);
    
    // Show confirmation modal
    showBookingConfirmation(booking);
    
    // Reload bookings display
    loadBookings();
}

// ===================================
// LOCALSTORAGE - SAVE BOOKING
// ===================================
function saveBooking(booking) {
    // Get existing bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('quickserv_bookings')) || [];
    
    // Add new booking
    bookings.push(booking);
    
    // Save back to localStorage
    localStorage.setItem('quickserv_bookings', JSON.stringify(bookings));
}

// ===================================
// LOCALSTORAGE - LOAD BOOKINGS
// ===================================
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('quickserv_bookings')) || [];
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<div class="no-bookings">📭 No bookings yet. Book a service to see it here!</div>';
        return;
    }
    
    bookingsContainer.innerHTML = '';
    
    // Display bookings in reverse order (newest first)
    bookings.reverse().forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <h3>🎫 ${booking.providerName}</h3>
            <div class="booking-details">
                <p><strong>Brand:</strong> ${booking.brandName}</p>
                <p><strong>Category:</strong> ${booking.category}</p>
                <p><strong>Location:</strong> ${booking.serviceArea}</p>
                <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>
                <p><strong>Price:</strong> ₹${booking.price}</p>
                <p><strong>Booked On:</strong> ${booking.bookingDate}</p>
                <p><strong>Status:</strong> <span style="color: #11998e; font-weight: 600;">${booking.status}</span></p>
            </div>
        `;
        bookingsContainer.appendChild(bookingItem);
    });
}

// ===================================
// BOOKING CONFIRMATION MODAL
// ===================================
function showBookingConfirmation(booking) {
    const bookingDetails = document.getElementById('booking-details');
    bookingDetails.innerHTML = `
        <p><strong>Provider:</strong> ${booking.providerName}</p>
        <p><strong>Brand:</strong> ${booking.brandName}</p>
        <p><strong>Category:</strong> ${booking.category}</p>
        <p><strong>Location:</strong> ${booking.serviceArea}</p>
        <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>
        <p><strong>Price:</strong> ₹${booking.price}</p>
        <p><strong>Booking ID:</strong> #${booking.id}</p>
    `;
    
    bookingModal.style.display = 'flex';
}

function closeModal() {
    bookingModal.style.display = 'none';
}
