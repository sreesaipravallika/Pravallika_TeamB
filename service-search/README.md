# QuickServ Service Search Feature

## Overview

A real-time service search feature that allows users to find service providers by typing in a search box. Built with vanilla HTML, CSS, and JavaScript - no frameworks required.

## Features

- **Real-time Search**: Results update as you type
- **Case-Insensitive Matching**: "Plumber" matches "plumber", "PLUMBER", etc.
- **Partial Matching**: Typing "plum" shows "plumber" results
- **Dynamic Result Count**: Shows "X services found" or "No services found"
- **Clear Button**: Quick reset with X button
- **Popular Tags**: One-click search for common services
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Professional hover effects and transitions

## File Structure

```
service-search/
├── index.html      # Main HTML structure
├── style.css       # Complete styling
├── data.js         # Service providers data (25 items)
├── script.js       # Search logic and functionality
└── README.md       # This file
```

## How to Use

1. Open `index.html` in a web browser
2. Type a service name in the search box (e.g., "plumber", "electrician")
3. Results appear instantly as you type
4. Click "Book Now" on any service card
5. Use the X button to clear search
6. Click popular tags for quick searches

## Search Logic Explanation

### Filtering Algorithm

The search uses **case-insensitive partial matching** across multiple fields:

```javascript
function filterServices(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    
    return serviceProviders.filter(service => {
        const matchesProviderName = service.providerName.toLowerCase().includes(lowerSearchTerm);
        const matchesServiceName = service.serviceName.toLowerCase().includes(lowerSearchTerm);
        const matchesCategory = service.category.toLowerCase().includes(lowerSearchTerm);
        const matchesLocation = service.location.toLowerCase().includes(lowerSearchTerm);
        
        return matchesProviderName || matchesServiceName || matchesCategory || matchesLocation;
    });
}
```

### Search Fields

The search checks these fields:
- **Provider Name**: "QuickFix Plumbing"
- **Service Name**: "Plumber"
- **Category**: "Home Services"
- **Location**: "Mumbai, Maharashtra"

### Examples

| Search Term | Matches | Reason |
|------------|---------|--------|
| "plum" | Plumber services | Partial match in service name |
| "ELECTRICIAN" | Electrician services | Case-insensitive match |
| "tutor" | All tutor services | Exact match in service name |
| "mumbai" | All Mumbai providers | Location match |
| "home" | All home services | Category match |

## Result Count Logic

```javascript
function updateResultCount(count) {
    if (count === 1) {
        resultCount.textContent = '1 service found';
    } else {
        resultCount.textContent = `${count} services found`;
    }
}
```

- Shows singular "1 service found" for one result
- Shows plural "X services found" for multiple results
- Hides when no search is active

## Data Structure

Each service provider has:

```javascript
{
    id: 1,
    providerName: "QuickFix Plumbing",
    serviceName: "Plumber",
    category: "Home Services",
    location: "Mumbai, Maharashtra",
    price: "₹299",
    priceUnit: "/hr",
    rating: 4.8,
    reviews: 234
}
```

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations
- **JavaScript (ES6)**: Search logic, DOM manipulation
- **Google Fonts**: Inter font family

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Instant search (no delays)
- Filters 25 items in <1ms
- Smooth 60fps animations
- No external API calls

## Future Enhancements

- Add sorting (price, rating, location)
- Add filters (category, price range)
- Add pagination for large datasets
- Add service provider details modal
- Integrate with backend API

## Credits

Built for QuickServ - A service booking platform
