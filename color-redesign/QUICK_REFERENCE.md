# 🎨 Quick Reference Card

## Color Scheme Cheat Sheet

---

## 🎯 Primary Colors

```css
Primary Blue:    #2563EB  /* Main brand color */
Secondary Green: #10B981  /* Success/Confirmation */
Accent Orange:   #F59E0B  /* Featured items */
Accent Purple:   #8B5CF6  /* Premium services */
```

---

## 📝 Common Use Cases

### Navigation Bar
```html
<nav class="navbar">
    <div class="navbar-container">
        <div class="navbar-brand">Logo</div>
        <ul class="navbar-menu">
            <li><a href="#" class="navbar-link">Link</a></li>
        </ul>
    </div>
</nav>
```

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
```

### Forms
```html
<div class="form-group">
    <label class="form-label">Label</label>
    <input type="text" class="form-input" placeholder="Placeholder">
</div>
```

### Service Cards
```html
<div class="service-card">
    <div class="card-header">
        <div class="card-icon">🔧</div>
        <h3 class="card-title">Title</h3>
    </div>
    <div class="card-body">
        <p class="card-description">Description</p>
        <div class="card-footer">
            <div class="card-price">₹299</div>
            <button class="btn btn-primary btn-sm">Book</button>
        </div>
    </div>
</div>
```

---

## 🎨 Color Variables

```css
/* Primary */
--primary-main: #2563EB
--primary-hover: #1D4ED8

/* Secondary */
--secondary-main: #10B981
--secondary-light: #34D399

/* Neutrals */
--neutral-white: #FFFFFF
--neutral-50: #F9FAFB
--neutral-200: #E5E7EB
--neutral-600: #4B5563
--neutral-800: #1F2937

/* Semantic */
--success: #10B981
--error: #EF4444
--warning: #F59E0B
--info: #3B82F6
```

---

## ✨ Hover Effects

```css
/* Button Hover */
transform: translateY(-2px);
box-shadow: 0 12px 30px rgba(37, 99, 235, 0.4);

/* Card Hover */
transform: translateY(-4px);
border-color: #2563EB;
```

---

## 📊 Text Colors

```css
Headings:      #111827  /* Neutral 900 */
Body Text:     #4B5563  /* Neutral 600 */
Secondary:     #6B7280  /* Neutral 500 */
Muted:         #9CA3AF  /* Neutral 400 */
```

---

## 🎯 Quick Tips

1. **Primary Blue** for main actions
2. **Green** for success/confirmation
3. **Orange** for featured items
4. **Purple** for premium services
5. **White** for card backgrounds
6. **Off-white** (#F9FAFB) for page background

---

## 📱 Responsive Classes

```css
.container      /* Max-width container */
.section        /* Section padding */
.text-center    /* Center text */
.mt-lg          /* Margin top large */
.mb-xl          /* Margin bottom extra large */
```

---

## ✅ Accessibility

- All colors meet WCAG AA standards
- Contrast ratio: 4.5:1 minimum
- Focus states clearly visible
- Keyboard navigation supported

---

**Open `demo.html` to see everything in action!**
