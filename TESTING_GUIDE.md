# Testing Guide - Role-Based Authentication System

## 🚀 Quick Start

Run the development server:
```bash
npm run dev
```

Then open your browser to the local URL shown (usually `http://localhost:5173`)

---

## 🧪 Test Scenarios

### Scenario 1: Customer Registration & Login

1. **Register as Customer**:
   - Navigate to `/register`
   - Select "Customer" role (👤 icon)
   - Fill in the form:
     - Name: `John Doe`
     - Email: `john@example.com`
     - Phone: `1234567890`
     - Location: `New York, NY`
     - Password: `password123`
     - Confirm Password: `password123`
   - Click "Create Account"
   - Should see success message and redirect to login

2. **Login as Customer**:
   - Enter email: `john@example.com`
   - Enter password: `password123`
   - Click "Login"
   - Should redirect to `/dashboard` (Customer Dashboard)

3. **Verify Customer Dashboard**:
   - Should see colorful service cards
   - Should see "My Bookings" button
   - Should see Popular Services section
   - Should see Offers & Discounts
   - Should see Provider Finder options

4. **Test Route Protection**:
   - Try manually navigating to `/provider-dashboard`
   - Should automatically redirect back to `/dashboard`
   - Try navigating to `/admin-dashboard`
   - Should automatically redirect back to `/dashboard`

---

### Scenario 2: Provider Registration & Login

1. **Register as Provider**:
   - Navigate to `/register`
   - Select "Provider" role (🏢 icon)
   - Fill in the form:
     - Name: `Jane Smith`
     - Email: `jane@business.com`
     - Business Name: `Jane's Plumbing Services`
     - Service Category: `Plumbing`
     - Service Area: `Los Angeles, CA`
     - Phone: `9876543210`
     - Password: `provider123`
     - Confirm Password: `provider123`
   - Click "Create Account"
   - Should see success message and redirect to login

2. **Login as Provider**:
   - Enter email: `jane@business.com`
   - Enter password: `provider123`
   - Click "Login"
   - Should redirect to `/provider-dashboard` (Provider Dashboard)

3. **Verify Provider Dashboard**:
   - Should see business information cards
   - Should see statistics (Total Bookings, Pending, Completed, Earnings)
   - Should see Quick Actions section
   - Should see "No bookings yet" message
   - Purple gradient background

4. **Test Route Protection**:
   - Try manually navigating to `/dashboard`
   - Should automatically redirect back to `/provider-dashboard`
   - Try navigating to `/admin-dashboard`
   - Should automatically redirect back to `/provider-dashboard`

---

### Scenario 3: Admin Registration & Login

1. **Register as Admin**:
   - Navigate to `/register`
   - Select "Admin" role (⚙️ icon)
   - Fill in the form:
     - Name: `Admin User`
     - Email: `admin@quickserv.com`
     - Admin Secret Key: `QUICKSERV_ADMIN_2024`
     - Password: `admin123`
     - Confirm Password: `admin123`
   - Click "Create Account"
   - Should see success message and redirect to login

2. **Login as Admin**:
   - Enter email: `admin@quickserv.com`
   - Enter password: `admin123`
   - Click "Login"
   - Should redirect to `/admin-dashboard` (Admin Dashboard)

3. **Verify Admin Dashboard**:
   - Should see system statistics (Total Users, Customers, Providers, Admins)
   - Should see Customers table with John Doe
   - Should see Providers table with Jane Smith
   - Should see System Information section
   - Dark blue/purple gradient background

4. **Test Route Protection**:
   - Try manually navigating to `/dashboard`
   - Should automatically redirect back to `/admin-dashboard`
   - Try navigating to `/provider-dashboard`
   - Should automatically redirect back to `/admin-dashboard`

---

### Scenario 4: Security Testing

1. **Test Duplicate Email**:
   - Try registering with `john@example.com` again
   - Should show error: "This email is already registered. Please login."

2. **Test Invalid Admin Key**:
   - Register as Admin with wrong key: `WRONG_KEY`
   - Should show error: "Invalid admin key. Access denied."

3. **Test Password Validation**:
   - Try password: `123` (too short)
   - Should show error: "Password must be at least 6 characters."

4. **Test Password Mismatch**:
   - Password: `password123`
   - Confirm: `password456`
   - Should show error: "Passwords do not match."

5. **Test Unauthorized Access**:
   - Logout from any account
   - Try navigating to `/dashboard` directly
   - Should redirect to `/login`

6. **Test Wrong Credentials**:
   - Try logging in with wrong password
   - Should show error: "Incorrect email or password. Please try again."

---

### Scenario 5: Role Switching

1. **Login as Customer** → Access customer features
2. **Logout** → Click logout button
3. **Login as Provider** → Access provider features
4. **Logout** → Click logout button
5. **Login as Admin** → Access admin features
6. **Verify** → Each role sees only their dashboard

---

## 📊 Expected Results Summary

| Role | Dashboard Route | Can Access | Cannot Access |
|------|----------------|------------|---------------|
| Customer | `/dashboard` | Customer features, bookings, services | Provider/Admin dashboards |
| Provider | `/provider-dashboard` | Business info, bookings management | Customer/Admin dashboards |
| Admin | `/admin-dashboard` | All users, statistics, system info | Customer/Provider dashboards |
| Not Logged In | `/login` | Login, Register pages | Any dashboard |

---

## 🎯 Key Features to Demonstrate

1. **Dynamic Registration Form**:
   - Show how form fields change based on role selection
   - Customer: Phone + Location
   - Provider: Business Name + Category + Location + Phone
   - Admin: Admin Key only

2. **Password Strength Meter**:
   - Type weak password → Red "Weak"
   - Type medium password → Orange "Fair"
   - Type strong password → Green "Strong"

3. **Role-Based Redirection**:
   - Each role automatically goes to their dashboard
   - No manual navigation needed

4. **Route Protection**:
   - Cannot access other role's dashboards
   - Automatic redirect to correct dashboard

5. **Admin Panel**:
   - Shows all registered users
   - Real-time statistics
   - System information

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot access dashboard after login"
**Solution**: Check browser console for errors. Clear localStorage and try again.

### Issue: "Admin key not working"
**Solution**: Ensure you're using exactly: `QUICKSERV_ADMIN_2024` (case-sensitive)

### Issue: "Redirecting in loops"
**Solution**: Clear browser cache and localStorage, then refresh.

### Issue: "Form validation not working"
**Solution**: Ensure all required fields are filled correctly.

---

## 🔍 Browser Console Testing

Open browser console (F12) and test localStorage:

```javascript
// View all users
JSON.parse(localStorage.getItem('qs_users'))

// View current session
JSON.parse(localStorage.getItem('qs_session'))

// Clear all data (logout + reset)
localStorage.clear()
```

---

## ✅ Checklist for Complete Testing

- [ ] Register customer successfully
- [ ] Register provider successfully
- [ ] Register admin with correct key
- [ ] Login as customer → see customer dashboard
- [ ] Login as provider → see provider dashboard
- [ ] Login as admin → see admin dashboard
- [ ] Customer cannot access provider dashboard
- [ ] Provider cannot access admin dashboard
- [ ] Admin cannot access customer dashboard
- [ ] Logout works for all roles
- [ ] Cannot access dashboards without login
- [ ] Duplicate email shows error
- [ ] Wrong admin key shows error
- [ ] Password validation works
- [ ] Password mismatch shows error
- [ ] Wrong login credentials show error
- [ ] Admin can see all users in tables
- [ ] Statistics update correctly

---

## 📱 Mobile Testing

Test on mobile devices or browser mobile view:
- Role selector should stack vertically
- Forms should be responsive
- Dashboards should adapt to small screens
- All buttons should be easily tappable

---

## 🎓 For Viva Demonstration

### Recommended Demo Flow:

1. **Start**: Show login page
2. **Register Customer**: Walk through customer registration
3. **Login Customer**: Show customer dashboard features
4. **Logout**: Demonstrate logout
5. **Register Provider**: Show provider registration with business fields
6. **Login Provider**: Show provider dashboard
7. **Logout**: Demonstrate logout
8. **Register Admin**: Show admin key requirement
9. **Login Admin**: Show admin panel with user tables
10. **Security**: Try accessing wrong dashboard → show redirect
11. **Validation**: Show form validation errors
12. **Conclusion**: Explain security features

---

**Happy Testing! 🚀**
