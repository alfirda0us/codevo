// Toggle between login and signup forms
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (formType === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

// Handle login form submission
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Email dan password harus diisi!');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Format email tidak valid!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }
    
    alert('Login berhasil! (Demo - Ganti dengan backend logic)');
});

// Handle signup form submission
document.getElementById('signupFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!fullName || !email || !password || !confirmPassword) {
        alert('Semua field harus diisi!');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Format email tidak valid!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Password konfirmasi tidak cocok!');
        return;
    }
    
    alert('Daftar berhasil! (Demo - Ganti dengan backend logic)');
});

// Helper function for email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize: Show login form by default
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').classList.add('active');
});

// assets/js/classes.js
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Classes page loaded');
    
    await loadAllCourses();
    setupFilters();
});

async function loadAllCourses() {
    try {
        const db = new GoogleSheetsDB();
        const courses = await db.readSheet('Courses');
        
        const activeCourses = courses.filter(course => course.is_active === 'TRUE');
        displayAllCourses(activeCourses);
        
        // Update course count
        document.querySelector('.course-count').textContent = `${activeCourses.length} courses available`;
        
    } catch (error) {
        console.error('Error loading courses:', error);
        document.querySelector('.courses-container').innerHTML = 
            '<p>Error loading courses. Please try again later.</p>';
    }
}

function displayAllCourses(courses) {
    const container = document.querySelector('.courses-container');
    if (!container) return;
    
    container.innerHTML = courses.map(course => `
        <div class="course-card" data-category="${course.category.toLowerCase()}" data-level="${course.level.toLowerCase()}">
            <div class="course-image">${course.title}</div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span class="level">${course.level}</span>
                    <span class="duration">${course.duration} Hours</span>
                    <span class="instructor">By ${course.instructor}</span>
                </div>
                <div class="course-footer">
                    <span class="price">${course.price == '0' ? 'FREE' : `Rp ${course.price}`}</span>
                    <a href="course-detail.html?id=${course.id}" class="btn">Enroll Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const categoryFilter = document.querySelector('#category-filter');
    const levelFilter = document.querySelector('#level-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', filterCourses);
    }
}

function filterCourses() {
    const selectedCategory = document.querySelector('#category-filter')?.value.toLowerCase() || 'all';
    const selectedLevel = document.querySelector('#level-filter')?.value.toLowerCase() || 'all';
    
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardLevel = card.dataset.level;
        
        const categoryMatch = selectedCategory === 'all' || cardCategory === selectedCategory;
        const levelMatch = selectedLevel === 'all' || cardLevel === selectedLevel;
        
        card.style.display = (categoryMatch && levelMatch) ? 'block' : 'none';
    });
}

// assets/js/login.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    setupAuthForms();
    checkExistingUser();
});

function setupAuthForms() {
    // Login form
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    try {
        const db = new GoogleSheetsDB();
        const users = await db.readSheet('Users');
        
        const user = users.find(u => u.email === email && u.is_active === 'TRUE');
        
        if (user) {
            // Simple password check (in real app, use proper hashing)
            if (user.password_hash === simpleHash(password)) {
                // Login successful
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }));
                
                alert('Login successful!');
                window.location.href = '../index.html';
            } else {
                alert('Invalid password!');
            }
        } else {
            alert('User not found!');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const phone = document.querySelector('#phone').value;
    
    try {
        const db = new GoogleSheetsDB();
        const users = await db.readSheet('Users');
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert('Email already registered!');
            return;
        }
        
        // Create new user
        const newUserId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;
        
        const newUser = [
            newUserId.toString(),
            name,
            email,
            phone,
            simpleHash(password), // Simple hash for demo
            'student',
            new Date().toISOString().split('T')[0],
            '',
            'TRUE'
        ];
        
        await db.appendToSheet('Users', newUser);
        
        alert('Registration successful! Please login.');
        window.location.href = 'signin.html';
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('Registration failed. Please try again.');
    }
}

function checkExistingUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = '../index.html';
    }
}

// Simple hash function for demo (use proper hashing in production)
function simpleHash(str) {
    return btoa(str).substring(0, 15);
}