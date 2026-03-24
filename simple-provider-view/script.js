// ========================================
// SERVICE PROVIDERS DATA ARRAY
// ========================================
const serviceProviders = [
    {
        providerName: "QuickFix Solutions",
        brandName: "QuickFix Pro",
        category: "Plumbing",
        serviceArea: "Mumbai",
        timings: "9:00 AM - 11:00 AM, 2:00 PM - 5:00 PM",
        priceRange: "₹500 - ₹1500"
    },
    {
        providerName: "Elite Electricals",
        brandName: "PowerPro Services",
        category: "Electrical",
        serviceArea: "Mumbai",
        timings: "8:00 AM - 12:00 PM, 3:00 PM - 7:00 PM",
        priceRange: "₹600 - ₹1800"
    },
    {
        providerName: "SparkClean Services",
        brandName: "SparkClean Pro",
        category: "Cleaning",
        serviceArea: "Delhi",
        timings: "7:00 AM - 1:00 PM, 4:00 PM - 8:00 PM",
        priceRange: "₹400 - ₹1200"
    },
    {
        providerName: "Glamour Salon",
        brandName: "Glamour Studio",
        category: "Salon & Beauty",
        serviceArea: "Bangalore",
        timings: "10:00 AM - 8:00 PM",
        priceRange: "₹800 - ₹2000"
    },
    {
        providerName: "Master Carpenters",
        brandName: "WoodCraft Masters",
        category: "Carpentry",
        serviceArea: "Delhi",
        timings: "8:00 AM - 6:00 PM",
        priceRange: "₹700 - ₹2500"
    },
    {
        providerName: "ColorPro Painters",
        brandName: "ColorPro Elite",
        category: "Painting",
        serviceArea: "Bangalore",
        timings: "7:00 AM - 5:00 PM",
        priceRange: "₹1000 - ₹3000"
    },
    {
        providerName: "HomeFlow Plumbing",
        brandName: "HomeFlow Services",
        category: "Plumbing",
        serviceArea: "Pune",
        timings: "9:00 AM - 6:00 PM",
        priceRange: "₹450 - ₹1400"
    },
    {
        providerName: "BrightSpark Electricals",
        brandName: "BrightSpark Pro",
        category: "Electrical",
        serviceArea: "Pune",
        timings: "8:00 AM - 7:00 PM",
        priceRange: "₹550 - ₹1600"
    },
    {
        providerName: "FreshHome Cleaners",
        brandName: "FreshHome Elite",
        category: "Cleaning",
        serviceArea: "Chennai",
        timings: "7:00 AM - 6:00 PM",
        priceRange: "₹500 - ₹1500"
    },
    {
        providerName: "Style Studio",
        brandName: "Style Studio Premium",
        category: "Salon & Beauty",
        serviceArea: "Chennai",
        timings: "10:00 AM - 9:00 PM",
        priceRange: "₹900 - ₹2500"
    }
];

// ========================================
// MAIN SEARCH FUNCTION
// ========================================
function searchProviders() {
    // Step 1: Get the location entered by user
    const locationInput = document.getElementById('location');
    const userLocation = locationInput.value.trim();

    // Step 2: Validate - check if user entered something
    if (userLocation === '') {
        alert('Please enter a city name!');
        return;
    }

    // Step 3: Filter providers based on location
    // Convert both to lowercase for case-insensitive comparison
    const matchingProviders = serviceProviders.filter(function(provider) {
        return provider.serviceArea.toLowerCase() === userLocation.toLowerCase();
    });

    // Step 4: Display results
    displayResults(matchingProviders, userLocation);
}

// ========================================
// DISPLAY RESULTS FUNCTION
// ========================================
function displayResults(providers, location) {
    // Get the results container
    const resultsDiv = document.getElementById('results');
    const noResultsDiv = document.getElementById('no-results');

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Check if any providers found
    if (providers.length === 0) {
        // No providers found - show message
        resultsDiv.style.display = 'none';
        noResultsDiv.style.display = 'block';
    } else {
        // Providers found - show them
        resultsDiv.style.display = 'grid';
        noResultsDiv.style.display = 'none';

        // Create a card for each provider
        providers.forEach(function(provider) {
            // Create card HTML
            const card = `
                <div class="provider-card">
                    <h3>${provider.providerName}</h3>
                    <span class="brand">🏢 ${provider.brandName}</span>
                    <p class="info"><strong>Category:</strong> ${provider.category}</p>
                    <p class="info"><strong>Service Area:</strong> ${provider.serviceArea}</p>
                    <p class="info"><strong>Available Timings:</strong> ${provider.timings}</p>
                    <p class="info"><strong>Price Range:</strong> ${provider.priceRange}</p>
                    <span class="category">${provider.category}</span>
                </div>
            `;

            // Add card to results
            resultsDiv.innerHTML += card;
        });
    }
}

// ========================================
// ALLOW SEARCH ON ENTER KEY
// ========================================
document.getElementById('location').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchProviders();
    }
});
