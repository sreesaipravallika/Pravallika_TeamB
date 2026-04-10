# 🔧 Troubleshooting Guide - Cannot Open Application

## ✅ Current Status

Both servers are confirmed running:
- ✅ Frontend (Vite): Port 5173 is OPEN and LISTENING
- ✅ Backend (Express): Port 8080 is OPEN and RESPONDING

## 🌐 Try These Methods to Access

### Method 1: Direct Browser Access
Open your browser and type these URLs directly:

1. **Main Application**: `http://localhost:5173`
2. **Alternative**: `http://127.0.0.1:5173`
3. **Network Access**: `http://192.168.1.2:5173`

### Method 2: Use the Launch Page
1. Open the file: `OPEN_APP.html` (should have opened automatically)
2. Click the "Open QuickServ Application" button

### Method 3: Command Line
Run this in your terminal:
```bash
start http://localhost:5173
```

Or in PowerShell:
```powershell
Start-Process "http://localhost:5173"
```

## 🔍 Common Issues & Solutions

### Issue 1: Browser Shows "Can't Reach This Page"

**Solution A: Clear Browser Cache**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Try accessing again

**Solution B: Try Different Browser**
- Chrome: `http://localhost:5173`
- Firefox: `http://localhost:5173`
- Edge: `http://localhost:5173`

**Solution C: Disable Browser Extensions**
- Some ad blockers or security extensions block localhost
- Try opening in Incognito/Private mode: `Ctrl + Shift + N`

### Issue 2: "Connection Refused" or "ERR_CONNECTION_REFUSED"

**Check if services are actually running:**
```bash
# In your terminal, run:
curl http://localhost:5173
curl http://localhost:8080/api/health
```

**Restart the services:**
1. Stop both terminals (Ctrl+C in each)
2. Run again:
   ```bash
   # Terminal 1 (in project root):
   npm run dev
   
   # Terminal 2 (in backend folder):
   npm start
   ```

### Issue 3: Port Already in Use

**Check what's using the ports:**
```powershell
# Check port 5173
netstat -ano | findstr :5173

# Check port 8080
netstat -ano | findstr :8080
```

**Kill the process if needed:**
```powershell
# Replace <PID> with the process ID from above
taskkill /PID <PID> /F
```

### Issue 4: Firewall Blocking

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Make sure Node.js is allowed for Private networks

**Or temporarily disable:**
```powershell
# Run as Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```

### Issue 5: Antivirus Blocking

Some antivirus software blocks localhost connections:
- Temporarily disable antivirus
- Add exception for Node.js and your project folder

## 🧪 Verify Services Are Running

### Test Backend:
```bash
curl http://localhost:8080/api/health
```
Should return: `{"status":"ok","message":"QuickServ API is running"}`

### Test Frontend:
Open browser console (F12) and check for errors when accessing `http://localhost:5173`

## 📱 Alternative Access Methods

### Use Network IP:
If localhost doesn't work, try your machine's IP:
```
http://192.168.1.2:5173
```

### Use 127.0.0.1:
Instead of localhost:
```
http://127.0.0.1:5173
```

## 🔄 Complete Reset

If nothing works, try a complete reset:

1. **Stop all Node processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Reinstall dependencies:**
   ```bash
   # In project root
   rm -rf node_modules
   npm install
   
   # In backend folder
   cd backend
   rm -rf node_modules
   npm install
   cd ..
   ```

4. **Restart services:**
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2 (in backend)
   npm start
   ```

## 📞 Still Not Working?

### Check Browser Console:
1. Open browser (any page)
2. Press F12
3. Go to Console tab
4. Try accessing `http://localhost:5173`
5. Look for error messages

### Check Terminal Output:
Look for any error messages in the terminals where you ran:
- `npm run dev` (frontend)
- `npm start` (backend)

### System Information:
- OS: Windows
- Shell: bash
- Node.js version: Run `node --version`
- npm version: Run `npm --version`

## ✅ Success Indicators

You'll know it's working when:
1. Browser shows the QuickServ login page
2. No errors in browser console (F12)
3. Backend responds to: `http://localhost:8080/api/health`

## 🎯 Quick Test

Run this in PowerShell to test everything:
```powershell
# Test backend
Invoke-WebRequest -Uri "http://localhost:8080/api/health" -UseBasicParsing

# Test frontend port
Test-NetConnection -ComputerName localhost -Port 5173

# Open in browser
Start-Process "http://localhost:5173"
```

---

**Need more help?** Check the terminal outputs for specific error messages and share them for more targeted troubleshooting.
