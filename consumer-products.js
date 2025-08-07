// Consumer Product Display System
// This file handles displaying farmer products to consumers

// Get all farmer products from all farmers
function getAllFarmerProducts() {
  const allProducts = [];
  
  // Get all users from dataa.json to find farmers
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  // If we have user data, get farmer IDs
  if (userData.users) {
    const farmers = userData.users.filter(user => user.role === 'farmer');
    
    farmers.forEach(farmer => {
      const farmerProducts = localStorage.getItem(`farmer_products_${farmer.id}`);
      if (farmerProducts) {
        const products = JSON.parse(farmerProducts);
        // Add farmer info to each product
        products.forEach(product => {
          const farmerDetails = userData.farmers?.find(f => f.user_id === farmer.id);
          product.farmer_name = farmerDetails?.full_name || farmer.username;
          product.farmer_location = farmerDetails?.location || 'Unknown';
        });
        allProducts.push(...products);
      }
    });
  }
  
  // Also check for any products in localStorage without specific farmer association
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('farmer_products_')) {
      const farmerId = key.replace('farmer_products_', '');
      // Skip if we already processed this farmer
      if (!userData.users || !userData.users.find(u => u.id == farmerId)) {
        const products = JSON.parse(localStorage.getItem(key) || '[]');
        products.forEach(product => {
          product.farmer_name = `Farmer ${farmerId}`;
          product.farmer_location = 'Unknown';
        });
        allProducts.push(...products);
      }
    }
  }
  
  // Filter only available products
  return allProducts.filter(product => product.status === 'available');
}

// Display products in consumer dashboard
function displayProductsForConsumers() {
  const productsContainer = document.querySelector('.products-row');
  if (!productsContainer) return;
  
  const products = getAllFarmerProducts();
  
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; width: 100%; color: #666;">
        <h3>No products available at the moment</h3>
        <p>Check back later for fresh products from local farmers!</p>
      </div>
    `;
    return;
  }
  
  // Sort products by creation date (newest first)
  products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card" data-product-id="${product.id}" data-farmer-id="${product.farmer_id}">
      <img src="${product.image_url || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop'}" 
           alt="${product.name}" 
           onerror="this.src='https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop'"/>
      <div class="product-desc">
        <div class="product-title">${product.name}</div>
        <div class="product-price">₹${product.price} / ${product.unit}</div>
        <div style="font-size: 0.85em; color: #666; margin: 4px 0;">
          ${product.quantity} ${product.unit} available
        </div>
        <div style="font-size: 0.8em; color: #888; margin: 2px 0;">
          by ${product.farmer_name}
        </div>
        <div style="font-size: 0.75em; color: #999;">
          📍 ${product.farmer_location}
        </div>
        ${product.organic ? '<div style="font-size: 0.75em; color: #4CAE4E; font-weight: 600; margin-top: 4px;">🌱 Organic</div>' : ''}
      </div>
      <button class="add-btn" onclick="addToCart(${product.id}, ${product.farmer_id})">+ Add to Cart</button>
    </div>
  `).join('');
}

// Filter products by category
function filterProductsByCategory(category) {
  const products = getAllFarmerProducts();
  const filteredProducts = category === 'all' ? products : products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  
  displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(products) {
  const productsContainer = document.querySelector('.products-row');
  if (!productsContainer) return;
  
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; width: 100%; color: #666;">
        <h3>No products found in this category</h3>
        <p>Try browsing other categories or check back later!</p>
      </div>
    `;
    return;
  }
  
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card" data-product-id="${product.id}" data-farmer-id="${product.farmer_id}">
      <img src="${product.image_url || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop'}" 
           alt="${product.name}" 
           onerror="this.src='https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop'"/>
      <div class="product-desc">
        <div class="product-title">${product.name}</div>
        <div class="product-price">₹${product.price} / ${product.unit}</div>
        <div style="font-size: 0.85em; color: #666; margin: 4px 0;">
          ${product.quantity} ${product.unit} available
        </div>
        <div style="font-size: 0.8em; color: #888; margin: 2px 0;">
          by ${product.farmer_name}
        </div>
        <div style="font-size: 0.75em; color: #999;">
          📍 ${product.farmer_location}
        </div>
        ${product.organic ? '<div style="font-size: 0.75em; color: #4CAE4E; font-weight: 600; margin-top: 4px;">🌱 Organic</div>' : ''}
      </div>
      <button class="add-btn" onclick="addToCart(${product.id}, ${product.farmer_id})">+ Add to Cart</button>
    </div>
  `).join('');
}

// Search products
function searchProducts(searchTerm) {
  const products = getAllFarmerProducts();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.farmer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  displayFilteredProducts(filteredProducts);
  
  // Update the heading to show search results
  const heading = document.querySelector('h3');
  if (heading && searchTerm) {
    heading.textContent = `Search Results for "${searchTerm}" (${filteredProducts.length} found)`;
  }
}

// Add to cart functionality (placeholder)
function addToCart(productId, farmerId) {
  // Get the product details
  const farmerProducts = JSON.parse(localStorage.getItem(`farmer_products_${farmerId}`) || '[]');
  const product = farmerProducts.find(p => p.id === productId);
  
  if (!product) {
    showConsumerNotification('Product not found!', 'error');
    return;
  }
  
  // Get current cart or create new one
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showConsumerNotification('Please login to add items to cart', 'error');
    return;
  }
  
  const cartKey = `cart_${currentUser.id}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.productId === productId && item.farmerId === farmerId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      farmerId: farmerId,
      productName: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1,
      farmerName: product.farmer_name || 'Unknown Farmer',
      addedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(cartKey, JSON.stringify(cart));
  showConsumerNotification(`${product.name} added to cart!`, 'success');
}

// Show notification for consumers
function showConsumerNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.consumer-notification');
  existingNotifications.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `consumer-notification consumer-notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 1001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    ${type === 'success' ? 'background: #28a745;' : ''}
    ${type === 'error' ? 'background: #dc3545;' : ''}
    ${type === 'info' ? 'background: #17a2b8;' : ''}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Load user data for farmer information
async function loadUserDataForConsumer() {
  try {
    const response = await fetch('dataa.json');
    const userData = await response.json();
    localStorage.setItem('userData', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

// Handle logout functionality
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear user session
    localStorage.removeItem('currentUser');
    
    // Show logout message
    showConsumerNotification('Logged out successfully!', 'success');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  }
}

// Display user information
function displayUserInfo() {
  const user = getCurrentUser();
  if (!user) {
    // Redirect to login if no user
    window.location.href = 'login.html';
    return;
  }
  
  // Update sidebar profile
  const userDisplayName = document.getElementById('user-display-name');
  const userAvatar = document.getElementById('user-avatar');
  
  if (userDisplayName) {
    const displayName = user.details?.full_name || user.username;
    userDisplayName.textContent = displayName;
  }
  
  // Update avatar based on user data
  if (userAvatar && user.details?.full_name) {
    // You could customize avatar based on user data
    userAvatar.alt = user.details.full_name;
  }
  
  // Update welcome section
  const welcomeUserName = document.getElementById('welcome-user-name');
  const userInfo = document.getElementById('user-info');
  
  if (welcomeUserName && userInfo) {
    const displayName = user.details?.full_name || user.username;
    welcomeUserName.textContent = displayName;
    userInfo.style.display = 'flex';
  }
}

// Check authentication and redirect if needed
function checkAuthentication() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  
  if (user.role !== 'consumer') {
    // Redirect to appropriate dashboard based on role
    switch(user.role) {
      case 'farmer':
        window.location.href = 'farmer-dashboard.html';
        break;
      case 'supplier':
        window.location.href = 'supplier-dashboard.html';
        break;
      case 'expert':
        window.location.href = 'expert-dashboard.html';
        break;
      default:
        window.location.href = 'login.html';
    }
    return false;
  }
  
  return true;
}

// Initialize consumer products when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'consumer-dashboard.html') {
    // Check authentication first
    if (!checkAuthentication()) {
      return;
    }
    
    // Display user information
    displayUserInfo();
    
    // Load user data first
    await loadUserDataForConsumer();
    
    // Display products
    displayProductsForConsumers();
    
    // Set up search functionality
    const searchForm = document.querySelector('.search-row');
    const searchInput = searchForm?.querySelector('input');
    
    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          searchProducts(searchTerm);
        } else {
          displayProductsForConsumers();
          const heading = document.querySelector('h3');
          if (heading) {
            heading.textContent = 'Featured Products';
          }
        }
      });
    }
    
    // Set up category filtering
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', function() {
        const categoryText = this.textContent.trim();
        let category = 'all';
        
        if (categoryText.includes('Vegetables')) category = 'Vegetables';
        else if (categoryText.includes('Fruits')) category = 'Fruits';
        else if (categoryText.includes('Dairy')) category = 'Dairy';
        else if (categoryText.includes('Grains')) category = 'Grains';
        
        filterProductsByCategory(category);
        
        // Update heading
        const heading = document.querySelector('h3');
        if (heading) {
          heading.textContent = category === 'all' ? 'All Products' : `${categoryText} Products`;
        }
      });
    });
  }
});