// Cursor follower circle - smooth follow
const cursorCircle = document.querySelector('.cursor-circle');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let circleX = mouseX;
let circleY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Lerp for smoothness
    circleX += (mouseX - circleX) * 0.18;
    circleY += (mouseY - circleY) * 0.18;
    if (cursorCircle) {
        cursorCircle.style.left = circleX + 'px';
        cursorCircle.style.top = circleY + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// FAQ Accordion interaction
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
        const parent = this.parentElement;
        if (parent.classList.contains('active')) {
            parent.classList.remove('active');
        } else {
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
            parent.classList.add('active');
        }
    });
});

// Common JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Course card hover effect enhancement
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Mobile menu toggle (if needed in future)
    const initMobileMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if(menuToggle && navLinks) {
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
        }
    };
    
    initMobileMenu();
    
    // Course enrollment functionality
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    enrollButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseName = this.closest('.course-card').querySelector('.course-title').textContent;
            alert(`Terima kasih! Anda telah mendaftar untuk kursus: ${courseName}`);
            // In a real application, you would send this data to a server
        });
    });
    
    // Testimonial slider functionality
    const initTestimonialSlider = () => {
        const testimonialGrid = document.querySelector('.testimonials-grid');
        if(!testimonialGrid) return;
        
        // This would be more complex in a real implementation
        console.log('Testimonial grid initialized');
    };
    
    initTestimonialSlider();

    // Banner functionality
    const banner = document.getElementById('welcome-banner');
    const closeButton = document.getElementById('close-banner');

    // Show the banner when the page loads
    if (banner) {
        banner.classList.add('show-banner');
    }

    // Close the banner when the button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            if (banner) {
                banner.style.display = 'none';
            }
        });
    }

    // Tools and Review Panel functionality
    const toolsButton = document.getElementById('tools-button');
    const reviewPanelButton = document.getElementById('review-panel-button');
    const toolsPanel = document.getElementById('tools-panel');
    const reviewPanel = document.getElementById('review-panel');

    if (toolsButton && reviewPanelButton && toolsPanel && reviewPanel) {
        toolsButton.addEventListener('click', function () {
            toolsPanel.classList.toggle('visible');
            reviewPanel.classList.remove('visible'); // Hide Review Panel if open
        });

        reviewPanelButton.addEventListener('click', function () {
            reviewPanel.classList.toggle('visible');
            toolsPanel.classList.remove('visible'); // Hide Tools Panel if open
        });
    }
});

// Search bar functionality
document.querySelector('.search-input input[type="text"]').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const classSections = document.querySelectorAll('.class-section');

    classSections.forEach(section => {
        const courseCards = section.querySelectorAll('.course-card');
        let hasVisibleCourse = false;

        courseCards.forEach(card => {
            const title = card.querySelector('.course-title').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = '';
                hasVisibleCourse = true;
            } else {
                card.style.display = 'none';
            }
        });

        let noResultMessage = section.querySelector('.no-result');
        if (!hasVisibleCourse) {
            if (!noResultMessage) {
                noResultMessage = document.createElement('p');
                noResultMessage.classList.add('no-result');
                noResultMessage.textContent = 'No courses found.';
                section.appendChild(noResultMessage);
            }
        } else if (noResultMessage) {
            noResultMessage.remove();
        }
    });
});

// Redirect to classes page when search bar is clicked (only on home page)
if (window.location.pathname.endsWith('index.html')) {
    document.querySelector('.search-input input[type="text"]').addEventListener('focus', function() {
        window.location.href = 'classes.html';
    });
}

$('.js-tilt').tilt({
    scale: 1.1
});


    document.getElementById('loginForm').addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      fetch('https://script.google.com/macros/s/AKfycbyL0IXtaW8b742JlKOb-VRFvIzF6bSkamTS5AVMKCYx2BCNVWGADkTtdY6c4WvF5jXeaQ/exec', {
        method: 'POST',
        body: new URLSearchParams({
          action: 'login',
          username: username,
          password: password
        })
      })
        .then(response => response.text())
        .then(data => {
          document.getElementById('loginMessage').textContent = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });

    // assets/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage loaded');
    
    // Load featured courses
    loadFeaturedCourses();
    
    // Setup navigation
    setupNavigation();
    
    // Setup animations
    setupAnimations();
});

async function loadFeaturedCourses() {
    try {
        if (!window.GoogleSheetsDB) {
            console.log('GoogleSheetsDB not loaded on homepage');
            return;
        }
        
        const db = new GoogleSheetsDB();
        const courses = await db.readSheet('Courses');
        
        // Show only active courses
        const featuredCourses = courses.filter(course => course.is_active === 'TRUE').slice(0, 3);
        
        displayFeaturedCourses(featuredCourses);
    } catch (error) {
        console.log('Could not load courses:', error.message);
    }
}

function displayFeaturedCourses(courses) {
    const container = document.querySelector('.courses-grid');
    if (!container) return;
    
    container.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-image">${course.title}</div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <div class="course-meta">
                    <span>${course.level}</span>
                    <span>${course.duration} Hours</span>
                </div>
                <a href="pages/courses/course-detail.html?id=${course.id}" class="btn">Lihat Kelas</a>
            </div>
        </div>
    `).join('');
}

function setupNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function setupAnimations() {
    // Add hover effects to course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}