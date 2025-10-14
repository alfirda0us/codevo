const courseDB = new CourseDatabase();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');

    setupAuthForms();
    checkExistingUser();
});

function setupAuthForms() {
    // Login form
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.querySelector('#signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const user = await courseDB.getUserByEmail(email);

        if (user && user.is_active === 'TRUE') {
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
                window.location.href = '../../index.html';
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
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const phone = document.querySelector('#phone').value;

    try {
        // Check if user already exists
        const existingUser = await courseDB.getUserByEmail(email);
        if (existingUser) {
            alert('Email already registered!');
            return;
        }

        // Create new user
        await courseDB.createUser({
            name: name,
            email: email,
            phone: phone,
            password_hash: simpleHash(password)
        });

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
        window.location.href = '../../index.html';
    }
}

// Simple hash function for demo (use proper hashing in production)
function simpleHash(str) {
    return btoa(str).substring(0, 15);
}
