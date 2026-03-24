# Location Selection Feature

## Overview
The QuickServ application now includes a comprehensive location selection feature that allows users to either automatically detect their location using GPS or manually select their city.

## Features Implemented

### 1. **Automatic Location Detection (GPS)**
- Uses browser's Geolocation API to detect user's current location
- Reverse geocoding using OpenStreetMap Nominatim API to convert coordinates to city/state
- Shows loading animation while detecting location
- Handles all permission states (granted, denied, unavailable)

### 2. **Permission Handling**
- **First Visit**: Shows a beautiful modal asking for location permission
- **Permission Granted**: Automatically detects and displays location
- **Permission Denied**: Shows error message and provides manual entry option
- **Location Services Off**: Prompts user to enable or enter manually

### 3. **Manual Location Entry**
- Searchable dropdown with popular Indian cities
- Real-time search filtering
- Clean, modern UI with smooth animations
- Quick selection from pre-populated city list

### 4. **UI Components**

#### Location Button (Navbar)
- Displays current location or "Select Location"
- MapPin icon for visual clarity
- Responsive design for mobile and desktop
- Smooth hover effects

#### Location Dropdown
- Modern card-based design
- "Use Current Location" button with GPS detection
- Search input for filtering cities
- List of popular cities (Mumbai, Delhi, Bangalore, etc.)
- Error messages with clear icons
- Mobile-responsive (full-width on mobile)

#### Permission Modal
- Eye-catching gradient icon
- Clear explanation of why location is needed
- Two action buttons:
  - "Allow Location Access" (primary)
  - "Enter Manually" (secondary)
- "Skip for now" option
- Animated entrance

### 5. **Data Persistence**
- Saves selected location to localStorage
- Persists across page reloads
- Key: `qs_location`
- Format: `{ city, state, country, lat?, lon? }`

### 6. **Error Handling**
- Permission denied
- Position unavailable
- Timeout errors
- Network errors
- Clear, user-friendly error messages

### 7. **Mobile Responsiveness**
- Dropdown becomes bottom sheet on mobile
- Touch-friendly button sizes
- Optimized layout for small screens
- Hides greeting text on mobile to save space

## Technical Implementation

### Technologies Used
- **React Hooks**: useState, useEffect, useRef
- **Browser APIs**: Geolocation API
- **External API**: OpenStreetMap Nominatim (reverse geocoding)
- **Icons**: Lucide React (MapPin, Search, Navigation, etc.)
- **Storage**: localStorage

### Component Structure
```
LocationSelector.tsx
├── Location Button (Navbar)
├── Location Dropdown
│   ├── Header
│   ├── Detect Location Button
│   ├── Error Display
│   ├── Search Input
│   └── Cities List
└── Permission Modal
    ├── Icon
    ├── Title & Description
    ├── Action Buttons
    └── Skip Option
```

### Key Functions
- `detectLocation()`: Handles GPS detection and reverse geocoding
- `selectLocation()`: Handles manual city selection
- `handleLocationChange()`: Callback to parent component

## User Flow

### First-Time User
1. User logs into dashboard
2. Permission modal appears automatically
3. User clicks "Allow Location Access"
4. Browser shows native permission prompt
5. If granted: Location detected and displayed
6. If denied: Error shown with manual entry option

### Returning User
1. User logs into dashboard
2. Saved location loaded from localStorage
3. Location displayed in navbar
4. User can click to change location anytime

### Manual Entry Flow
1. User clicks location button
2. Dropdown opens
3. User searches or selects from list
4. Location updated and saved
5. Dropdown closes

## Styling Features
- Modern gradient backgrounds
- Smooth animations (slide-down, scale-in, fade-in)
- Hover effects on all interactive elements
- Loading spinner during detection
- Color-coded error messages
- Consistent with app's design system

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (requires HTTPS)
- Mobile browsers: Full support

## Security & Privacy
- Location permission required before access
- User can deny and use manual entry
- Location data stored locally only
- No server-side tracking
- HTTPS required for Geolocation API

## Future Enhancements
- Add more cities to the list
- Integrate with backend for nearby providers
- Show distance to service providers
- Add map view for location selection
- Support for international locations
- Location-based service filtering

## Usage Example

```tsx
import LocationSelector from "@/components/LocationSelector";

function Dashboard() {
  const [location, setLocation] = useState("");

  function handleLocationChange(loc) {
    setLocation(`${loc.city}, ${loc.state}`);
    // Use location for filtering services, etc.
  }

  return (
    <LocationSelector onLocationChange={handleLocationChange} />
  );
}
```

## Testing Checklist
- ✅ First-time user sees permission modal
- ✅ GPS detection works when permission granted
- ✅ Error shown when permission denied
- ✅ Manual search filters cities correctly
- ✅ Location persists after page reload
- ✅ Mobile responsive design works
- ✅ Dropdown closes when clicking outside
- ✅ Loading animation shows during detection
- ✅ All animations smooth and performant
- ✅ Accessible keyboard navigation

## Notes
- OpenStreetMap Nominatim API has usage limits (1 request/second)
- For production, consider using a paid geocoding service
- Location accuracy depends on device GPS capability
- HTTPS is required for Geolocation API to work
