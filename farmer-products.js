// Farmer Product Management System

// Get farmer's products from localStorage
function getFarmerProducts() {
  const user = getCurrentUser();
  if (!user || user.role !== 'farmer') return [];
  
  const products = localStorage.getItem(`farmer_products_${user.id}`);
  return products ? JSON.parse(products) : [];
}

// Save farmer's products to localStorage
function saveFarmerProducts(products) {
  const user = getCurrentUser();
  if (!user || user.role !== 'farmer') return false;
  
  localStorage.setItem(`farmer_products_${user.id}`, JSON.stringify(products));
  return true;
}

// Add a new product
function addProduct(productData) {
  const user = getCurrentUser();
  if (!user || user.role !== 'farmer') return false;
  
  const products = getFarmerProducts();
  const newProduct = {
    id: Date.now(), // Simple ID generation
    farmer_id: user.id,
    name: productData.name,
    category: productData.category,
    description: productData.description,
    price: parseFloat(productData.price),
    quantity: parseInt(productData.quantity),
    unit: productData.unit,
    harvest_date: productData.harvest_date,
    expiry_date: productData.expiry_date,
    location: productData.location,
    organic: productData.organic || false,
    image_url: productData.image_url || '',
    status: 'available',
    created_at: new Date().toISOString()
  };
  
  products.push(newProduct);
  saveFarmerProducts(products);
  return newProduct;
}

// Update an existing product
function updateProduct(productId, updatedData) {
  const products = getFarmerProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return false;
  
  products[productIndex] = { ...products[productIndex], ...updatedData };
  saveFarmerProducts(products);
  return products[productIndex];
}

// Delete a product
function deleteProduct(productId) {
  const products = getFarmerProducts();
  const filteredProducts = products.filter(p => p.id !== productId);
  
  if (filteredProducts.length === products.length) return false;
  
  saveFarmerProducts(filteredProducts);
  return true;
}

// Get product by ID
function getProductById(productId) {
  const products = getFarmerProducts();
  return products.find(p => p.id === productId);
}

// Display products in the dashboard
function displayFarmerProducts() {
  const products = getFarmerProducts();
  const container = document.getElementById('products-container');
  
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <h3>No products listed yet</h3>
        <p>Start by adding your first product to sell!</p>
        <button class="add-btn" onclick="showAddProductModal()">+ Add Your First Product</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="products-header">
      <h2>My Products (${products.length})</h2>
      <button class="add-btn" onclick="showAddProductModal()">+ Add New Product</button>
    </div>
    <div class="products-grid">
      ${products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <img src="${product.image_url || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop'}" 
                 alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop'">
            ${product.organic ? '<span class="organic-badge">Organic</span>' : ''}
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
              <span class="price">₹${product.price}/${product.unit}</span>
              <span class="quantity">${product.quantity} ${product.unit} available</span>
            </div>
            <div class="product-meta">
              <small>Harvest: ${new Date(product.harvest_date).toLocaleDateString()}</small>
              <small>Location: ${product.location}</small>
            </div>
            <div class="product-actions">
              <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
              <button class="delete-btn" onclick="deleteProductConfirm(${product.id})">Delete</button>
              <span class="status status-${product.status}">${product.status}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Show add product modal
function showAddProductModal() {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('modal-title');
  
  title.textContent = 'Add New Product';
  form.reset();
  form.dataset.mode = 'add';
  modal.style.display = 'block';
}

// Show edit product modal
function editProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('modal-title');
  
  title.textContent = 'Edit Product';
  form.dataset.mode = 'edit';
  form.dataset.productId = productId;
  
  // Fill form with product data
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-quantity').value = product.quantity;
  document.getElementById('product-unit').value = product.unit;
  document.getElementById('harvest-date').value = product.harvest_date;
  document.getElementById('expiry-date').value = product.expiry_date;
  document.getElementById('product-location').value = product.location;
  document.getElementById('organic').checked = product.organic;
  document.getElementById('image-url').value = product.image_url;
  
  modal.style.display = 'block';
}

// Handle product form submission
function handleProductSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const mode = form.dataset.mode;
  const productId = parseInt(form.dataset.productId);
  
  const productData = {
    name: document.getElementById('product-name').value,
    category: document.getElementById('product-category').value,
    description: document.getElementById('product-description').value,
    price: document.getElementById('product-price').value,
    quantity: document.getElementById('product-quantity').value,
    unit: document.getElementById('product-unit').value,
    harvest_date: document.getElementById('harvest-date').value,
    expiry_date: document.getElementById('expiry-date').value,
    location: document.getElementById('product-location').value,
    organic: document.getElementById('organic').checked,
    image_url: document.getElementById('image-url').value
  };
  
  let success = false;
  
  if (mode === 'add') {
    success = addProduct(productData);
  } else if (mode === 'edit') {
    success = updateProduct(productId, productData);
  }
  
  if (success) {
    closeProductModal();
    displayFarmerProducts();
    updateDashboardStats();
    showNotification(mode === 'add' ? 'Product added successfully!' : 'Product updated successfully!', 'success');
  } else {
    showNotification('Error saving product. Please try again.', 'error');
  }
}

// Close product modal
function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.style.display = 'none';
}

// Delete product with confirmation
function deleteProductConfirm(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
    if (deleteProduct(productId)) {
      displayFarmerProducts();
      updateDashboardStats();
      showNotification('Product deleted successfully!', 'success');
    } else {
      showNotification('Error deleting product. Please try again.', 'error');
    }
  }
}

// Update dashboard statistics
function updateDashboardStats() {
  const products = getFarmerProducts();
  const totalListings = products.length;
  const availableProducts = products.filter(p => p.status === 'available').length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  // Update stat cards
  const totalListingsEl = document.querySelector('[data-stat="total-listings"]');
  const availableProductsEl = document.querySelector('[data-stat="available-products"]');
  const totalValueEl = document.querySelector('[data-stat="total-value"]');
  
  if (totalListingsEl) totalListingsEl.textContent = totalListings;
  if (availableProductsEl) availableProductsEl.textContent = availableProducts;
  if (totalValueEl) totalValueEl.textContent = `₹${totalValue.toLocaleString()}`;
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Handle logout functionality
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear user session
    localStorage.removeItem('currentUser');
    
    // Show logout message
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = '/html_files/auth/login.html';
    }, 1500);
  }
}

// Display user information
function displayFarmerUserInfo() {
  const user = getCurrentUser();
  if (!user) {
    // Redirect to login if no user
    window.location.href = '/html_files/auth/login.html';
    return;
  }
  
  // Update sidebar profile
  const farmerDisplayName = document.getElementById('farmer-display-name');
  if (farmerDisplayName) {
    const displayName = user.details?.full_name || user.username;
    farmerDisplayName.textContent = displayName;
  }
  
  // Update welcome section if it exists
  const welcomeUserName = document.getElementById('welcome-user-name');
  const userInfo = document.getElementById('user-info');
  
  if (welcomeUserName && userInfo) {
    const displayName = user.details?.full_name || user.username;
    welcomeUserName.textContent = displayName;
    userInfo.style.display = 'flex';
  } else if (userInfo) {
    // Create a simple welcome message for farmer dashboard
    const displayName = user.details?.full_name || user.username;
    userInfo.innerHTML = `
      <div class="user-welcome" style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(55, 84, 50, 0.1);">
        <div style="color: #375432; font-size: 1.1em; font-family: 'Georgia', serif;">
          Welcome back, <span style="font-weight: 600; color: #375432;">${displayName}</span>!
        </div>
        <button class="logout-btn" onclick="handleLogout()" style="width: auto; padding: 6px 12px; font-size: 12px; background: #375432; border-radius: 5px;">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    `;
  }
}

// Check authentication and redirect if needed
function checkFarmerAuthentication() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/html_files/auth/login.html';
    return false;
  }
  
  if (user.role !== 'farmer') {
    // Redirect to appropriate dashboard based on role
    switch(user.role) {
      case 'consumer':
        window.location.href = '/html_files/consumer/consumer-dashboard.html';
        break;
      case 'supplier':
        window.location.href = '/html_files/supplier/supplier-dashboard.html';
        break;
      case 'expert':
        window.location.href = '/html_files/expert/expert-dashboard.html';
        break;
      default:
        window.location.href = '/html_files/auth/login.html';
    }
    return false;
  }
  
  return true;
}

// Initialize farmer products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'farmer-dashboard.html') {
    // Check authentication first
    if (!checkFarmerAuthentication()) {
      return;
    }
    
    // Wait a bit for auth to initialize
    setTimeout(() => {
      const user = getCurrentUser();
      if (user && user.role === 'farmer') {
        displayFarmerUserInfo();
        displayFarmerProducts();
        updateDashboardStats();
      }
    }, 100);
  }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('product-modal');
  if (event.target === modal) {
    closeProductModal();
  }
});