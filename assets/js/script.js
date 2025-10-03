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
});

$('.js-tilt').tilt({
    scale: 1.1
})

