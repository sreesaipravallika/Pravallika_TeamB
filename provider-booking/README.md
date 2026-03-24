# QuickServ Provider Booking System

## 🚀 How to Run

### Method 1: Direct File Opening
1. Navigate to the `provider-booking` folder
2. Right-click on `index.html`
3. Select "Open with" → Choose your web browser (Chrome, Firefox, Edge, etc.)
4. The page should load immediately

### Method 2: Using File Explorer
1. Open File Explorer (Windows) or Finder (Mac)
2. Navigate to: `quickserv-auth-hub-main/provider-booking/`
3. Double-click `index.html`
4. It will open in your default browser

### Method 3: Using VS Code Live Server (if installed)
1. Open the `provider-booking` folder in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Method 4: Using Command Line
```bash
# Navigate to the folder
cd quickserv-auth-hub-main/provider-booking

# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

## 📝 Quick Test Instructions

Once the page opens:

1. **Enter a city name** in the search box:
   - Try: Mumbai, Delhi, Bangalore, or Pune
   
2. **Click "Search Providers"** button

3. **You should see provider cards** appear with:
   - Provider name and brand
   - Category badge
   - Rating
   - Time slots (clickable buttons)
   - Price display

4. **Click a time slot** - Watch the price change!

5. **Click "Book Now"** - See the confirmation modal

6. **Scroll down** to see "My Bookings" section with your booking

## 🔍 Troubleshooting

### Issue: Page is blank
**Solution:** 
- Check browser console (F12) for errors
- Make sure all 3 files are in the same folder:
  - index.html
  - style.css
  - script.js

### Issue: No styling
**Solution:**
- Verify `style.css` is in the same folder as `index.html`
- Check the file name is exactly `style.css` (not `style.css.txt`)

### Issue: No functionality
**Solution:**
- Verify `script.js` is in the same folder
- Check browser console for JavaScript errors
- Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)

### Issue: "No services available"
**Solution:**
- Make sure you entered a valid city: Mumbai, Delhi, Bangalore, or Pune
- Check spelling (case doesn't matter)
- Click the "Search Providers" button

## 📂 File Structure

```
provider-booking/
├── index.html          (Main HTML file - OPEN THIS)
├── style.css           (Styling)
├── script.js           (JavaScript functionality)
├── EXPLANATION.md      (Technical documentation)
└── README.md           (This file)
```

## ✅ Expected Behavior

1. **Initial Load**: Shows search box and empty state
2. **After Search**: Displays provider cards for that city
3. **Time Slot Click**: Highlights button and updates price
4. **Book Now**: Shows confirmation modal
5. **My Bookings**: Displays all bookings at bottom

## 🎯 Test Cities

The system has providers in these cities:
- **Mumbai** (3 providers)
- **Delhi** (3 providers)
- **Bangalore** (2 providers)
- **Pune** (2 providers)

## 📱 Browser Compatibility

Works on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera

## 💡 Tips

- Try different cities to see different providers
- Use the category filter to narrow results
- Use the sort dropdown to reorder providers
- Click different time slots to see price changes
- Check "My Bookings" section after booking

## 🆘 Still Not Working?

If you're still having issues:

1. **Check file locations**: All files must be in the same folder
2. **Check file names**: Must be exactly as shown (case-sensitive on some systems)
3. **Try a different browser**: Sometimes one browser has issues
4. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
5. **Check browser console**: Press F12 and look for error messages

## 📧 Need Help?

Check the EXPLANATION.md file for detailed technical documentation and viva questions.
