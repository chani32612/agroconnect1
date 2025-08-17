// AgroConnect Authentication Utilities

// Get current logged-in user
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Check if user has specific role
function hasRole(role) {
  const user = getCurrentUser();
  return user && user.role === role;
}

// Logout user
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Protect page - redirect to login if not authenticated
function protectPage(requiredRole = null) {
  const user = getCurrentUser();
  
  if (!user) {
    // Not logged in, redirect to login
    window.location.href = 'login.html';
    return false;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Wrong role, redirect to appropriate dashboard
    switch(user.role) {
      case 'farmer':
        window.location.href = 'farmer-dashboard.html';
        break;
      case 'consumer':
        window.location.href = 'consumer-dashboard.html';
        break;
      case 'supplier':
        window.location.href = 'supplier-dashboard.html';
        break;
      case 'expert':
        window.location.href = 'expert-dashboard.html';
        break;
      default:
        window.location.href = 'index.html';
    }
    return false;
  }
  
  return true;
}

// Display user info in dashboard
function displayUserInfo(containerId = 'user-info') {
  const user = getCurrentUser();
  const container = document.getElementById(containerId);
  
  if (user && container) {
    const displayName = user.details?.full_name || 
                       user.details?.company_name || 
                       user.username;
    
    container.innerHTML = `
      <div class="user-welcome">
        <span>Welcome, ${displayName}</span>
        <button onclick="logout()" class="logout-btn">Logout</button>
      </div>
    `;
  }
}

// Handle account creation
function handleCreateAccount(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!username || !email || !password || !role) {
        alert('All fields are required!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(user => user.email === email)) {
        alert('An account with this email already exists!');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        role,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! You can now log in.');
    window.location.href = 'login.html';
}

// Initialize dashboard (call this on dashboard pages)
function initDashboard(requiredRole) {
  // Protect the page
  if (!protectPage(requiredRole)) {
    return;
  }
  
  // Display user info
  displayUserInfo();
  
  // Add logout functionality to any existing logout buttons
  const logoutBtns = document.querySelectorAll('.logout-btn, [data-action="logout"]');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', logout);
  });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only auto-protect if we're on a dashboard page
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage.includes('dashboard')) {
    const role = currentPage.split('-')[0]; // Extract role from filename
    initDashboard(role);
  }
});