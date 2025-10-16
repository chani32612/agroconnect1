# agroconnect1

A complete frontend-only login system using JSON data for user authentication.

## 🚀 Quick Start

### Method 1: Using VS Code Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Your browser will open automatically

### Method 2: Using Python HTTP Server
```bash
# Navigate to the project directory
cd "/Users/chanakyavarma/Desktop/AU PROJECT/WPM"

# Start Python HTTP server
python3 -m http.server 8000

# Open browser and go to:
# http://localhost:8000
```

### Method 3: Using Node.js HTTP Server
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to project directory and start server
cd "/Users/chanakyavarma/Desktop/AU PROJECT/WPM"
http-server -p 8000

# Open browser and go to:
# http://localhost:8000
```

## 🔐 Test Credentials

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Farmer | `farmer101` | `farmer101@email.com` | `hash1` |
| Consumer | `consumer_jane` | `jane.c@email.com` | `hash2` |
| Expert | `expert_rk` | `rkexpert@agro.com` | `hash3` |
| Supplier | `supplymax` | `contact@supplymax.com` | `hash4` |

## 📁 File Structure

```
/
├── index.html              # Main landing page with role selection
├── login.html              # Login page with authentication
├── dataa.json             # User data (your existing file)
├── auth.js                # Authentication utilities
├── farmer-dashboard.html   # Farmer dashboard (protected)
├── consumer-dashboard.html # Consumer dashboard (protected)
├── supplier-dashboard.html # Supplier dashboard (protected)
├── expert-dashboard.html   # Expert dashboard (protected)
├── test-credentials.md     # Test credentials reference
└── README.md              # This file
```

## ✨ Features Implemented

### ✅ Authentication System
- JSON-based user data loading
- Username/email + password validation
- Role-based authentication
- Session management with localStorage
- Automatic redirection based on user role

### ✅ User Interface
- Responsive design
- Role selection on landing page
- Success/error message display
- Clean, modern styling
- Mobile-friendly layout

### ✅ Security Features
- Protected dashboard pages
- Automatic logout functionality
- Role-based access control
- Session validation

### ✅ User Experience
- Smooth transitions and animations
- Clear feedback messages
- Intuitive navigation
- Consistent design across pages

## 🔄 How It Works

1. **Landing Page (`index.html`)**
   - User selects their role (Farmer, Consumer, Expert, Supplier)
   - Redirects to login page with role parameter

2. **Login Page (`login.html`)**
   - Loads user data from `dataa.json`
   - Validates credentials against JSON data
   - Stores user session in localStorage
   - Redirects to appropriate dashboard

3. **Dashboard Pages**
   - Protected by authentication check
   - Displays user information
   - Provides logout functionality
   - Role-specific content and features

## 🛠️ Technical Implementation

### Data Loading
```javascript
// Loads user data from JSON file
async function loadUserData() {
  const response = await fetch('dataa.json');
  userData = await response.json();
}
```

### Credential Validation
```javascript
// Validates username/email and password
function validateCredentials(usernameOrEmail, password) {
  return userData.users.find(u => 
    (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
    u.password === password
  );
}
```

### Session Management
```javascript
// Stores user session
localStorage.setItem('currentUser', JSON.stringify(userInfo));

// Retrieves current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
```

## 🔧 Customization

### Adding New Users
Edit `dataa.json` to add new users:
```json
{
  "users": [
    {
      "id": 5,
      "username": "newuser",
      "email": "newuser@email.com",
      "password": "newpassword",
      "role": "farmer"
    }
  ]
}
```

### Styling
- Modify CSS in individual HTML files
- Colors use a green theme (`#6c9f6c`, `#25632A`, etc.)
- Responsive breakpoints included

### Adding New Roles
1. Add role to `dataa.json`
2. Create new dashboard HTML file
3. Update role selection in `index.html`
4. Update redirection logic in `login.html` and `auth.js`

## 🚨 Important Notes

- **Local Server Required**: Must run on HTTP server (not file://) for fetch() to work
- **No Backend**: This is frontend-only - passwords are stored in plain text in JSON
- **Session Storage**: Uses localStorage - data persists until manually cleared
- **CORS**: No CORS issues when served from local HTTP server

## 🔮 Future Enhancements

- Password hashing
- User registration functionality
- Password reset feature
- Remember me option
- Session timeout
- Backend integration
- Database storage
- Email verification

## 📞 Support

If you encounter any issues:
1. Ensure you're running on an HTTP server (not opening files directly)
2. Check browser console for error messages
3. Verify JSON file is accessible
4. Test with provided credentials first