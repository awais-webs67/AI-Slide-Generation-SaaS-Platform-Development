// API Configuration
const API_URL = 'http://localhost:5000/api/v1';
let currentUser = null;
let currentToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentToken = token;
        currentUser = JSON.parse(user);
        showAuthenticatedUI();
    } else {
        showUnauthenticatedUI();
    }
}

// Show/Hide UI based on auth state
function showAuthenticatedUI() {
    document.getElementById('nav-menu').classList.add('hidden');
    document.getElementById('user-menu').classList.remove('hidden');
    document.getElementById('user-name').textContent = currentUser.name;
    updateUserCredits();
}

function showUnauthenticatedUI() {
    document.getElementById('nav-menu').classList.remove('hidden');
    document.getElementById('user-menu').classList.add('hidden');
}

// Update user credits display
async function updateUserCredits() {
    try {
        const response = await axios.get(`${API_URL}/credits/balance`, {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        const credits = response.data.data.credits;
        document.getElementById('user-credits').textContent = `${credits} credits`;
        if (document.getElementById('dashboard-credits')) {
            document.getElementById('dashboard-credits').textContent = credits;
        }
    } catch (error) {
        console.error('Error fetching credits:', error);
    }
}

// Show sections
function showSection(section) {
    // Hide all sections
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('features-section').classList.add('hidden');
    document.getElementById('pricing-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    
    // Show requested section
    if (section === 'home') {
        document.getElementById('home-section').classList.remove('hidden');
    } else if (section === 'features') {
        document.getElementById('features-section').classList.remove('hidden');
    } else if (section === 'pricing') {
        document.getElementById('pricing-section').classList.remove('hidden');
    }
}

// Show dashboard
async function showDashboard() {
    showSection('none');
    document.getElementById('dashboard-section').classList.remove('hidden');
    await loadDashboardData();
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load user data
        const userResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        
        const userData = userResponse.data.data;
        document.getElementById('dashboard-credits').textContent = userData.credits;
        document.getElementById('dashboard-presentations').textContent = userData.usage.presentationsCreated || 0;
        document.getElementById('dashboard-slides').textContent = userData.usage.slidesGenerated || 0;
        document.getElementById('dashboard-plan').textContent = userData.subscription.plan;
        
        // Load presentations (placeholder - will be implemented when backend is complete)
        document.getElementById('presentations-list').innerHTML = `
            <div class="col-span-3 text-center py-12">
                <i class="fas fa-presentation text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No presentations yet.</p>
                <p class="text-gray-400 mb-6">Create your first AI-powered presentation!</p>
                <button onclick="showCreateModal()" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
                    <i class="fas fa-plus mr-2"></i> Create Presentation
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Error', 'Failed to load dashboard data', 'error');
    }
}

// Modal functions
function showLogin() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function showRegister() {
    document.getElementById('register-modal').classList.remove('hidden');
}

function showCreateModal() {
    document.getElementById('create-modal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function switchToRegister() {
    closeModal('login-modal');
    showRegister();
}

function switchToLogin() {
    closeModal('register-modal');
    showLogin();
}

// Select creation method
function selectMethod(method) {
    // Reset borders
    document.getElementById('method-document').classList.remove('border-purple-600', 'bg-purple-50');
    document.getElementById('method-prompt').classList.remove('border-purple-600', 'bg-purple-50');
    
    // Hide both sections
    document.getElementById('document-upload').classList.add('hidden');
    document.getElementById('prompt-input').classList.add('hidden');
    
    if (method === 'document') {
        document.getElementById('method-document').classList.add('border-purple-600', 'bg-purple-50');
        document.getElementById('document-upload').classList.remove('hidden');
    } else {
        document.getElementById('method-prompt').classList.add('border-purple-600', 'bg-purple-50');
        document.getElementById('prompt-input').classList.remove('hidden');
    }
}

// Authentication functions
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        
        if (response.data.success) {
            currentToken = response.data.data.token;
            currentUser = response.data.data.user;
            
            localStorage.setItem('token', currentToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            closeModal('login-modal');
            showAuthenticatedUI();
            showNotification('Success', 'Welcome back!', 'success');
            showDashboard();
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login Failed', error.response?.data?.message || 'Invalid credentials', 'error');
    }
}

async function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            name,
            email,
            password
        });
        
        if (response.data.success) {
            currentToken = response.data.data.token;
            currentUser = response.data.data.user;
            
            localStorage.setItem('token', currentToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            closeModal('register-modal');
            showAuthenticatedUI();
            showNotification('Welcome!', `Account created successfully! You have ${currentUser.credits} free credits.`, 'success');
            showDashboard();
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration Failed', error.response?.data?.message || 'Please try again', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentToken = null;
    currentUser = null;
    
    showUnauthenticatedUI();
    showSection('home');
    showNotification('Logged Out', 'See you soon!', 'success');
}

// Create presentation function
async function createPresentation() {
    const title = document.getElementById('create-title').value;
    const slideCount = document.getElementById('slide-count').value;
    
    if (!title) {
        showNotification('Error', 'Please enter a presentation title', 'error');
        return;
    }
    
    // Check which method is selected
    const documentMethod = !document.getElementById('document-upload').classList.contains('hidden');
    const promptMethod = !document.getElementById('prompt-input').classList.contains('hidden');
    
    if (!documentMethod && !promptMethod) {
        showNotification('Error', 'Please select a creation method', 'error');
        return;
    }
    
    try {
        if (promptMethod) {
            const prompt = document.getElementById('prompt-text').value;
            if (!prompt) {
                showNotification('Error', 'Please describe your presentation', 'error');
                return;
            }
            
            // Create presentation from prompt
            showNotification('Processing', 'Creating your presentation... This may take a minute.', 'info');
            closeModal('create-modal');
            
            const response = await axios.post(`${API_URL}/presentations`, {
                title,
                sourceType: 'prompt',
                sourcePrompt: prompt,
                slideCount: parseInt(slideCount)
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            
            showNotification('Success', 'Presentation created successfully!', 'success');
            loadDashboardData();
            
        } else if (documentMethod) {
            const file = document.getElementById('document-file').files[0];
            if (!file) {
                showNotification('Error', 'Please select a document to upload', 'error');
                return;
            }
            
            // Upload document
            const formData = new FormData();
            formData.append('document', file);
            formData.append('title', title);
            formData.append('slideCount', slideCount);
            
            showNotification('Processing', 'Uploading and processing document... This may take a minute.', 'info');
            closeModal('create-modal');
            
            const response = await axios.post(`${API_URL}/presentations/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            showNotification('Success', 'Document uploaded successfully!', 'success');
            loadDashboardData();
        }
    } catch (error) {
        console.error('Create presentation error:', error);
        const message = error.response?.data?.message || 'Failed to create presentation. Please try again.';
        showNotification('Error', message, 'error');
    }
}

// Notification system
function showNotification(title, message, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notification-icon');
    const titleEl = document.getElementById('notification-title');
    const messageEl = document.getElementById('notification-message');
    
    // Set icon based on type
    if (type === 'success') {
        icon.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
    } else if (type === 'error') {
        icon.innerHTML = '<i class="fas fa-times-circle text-red-500"></i>';
    } else if (type === 'info') {
        icon.innerHTML = '<i class="fas fa-info-circle text-blue-500"></i>';
    }
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    notification.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Initialize axios defaults
axios.defaults.timeout = 30000; // 30 second timeout
