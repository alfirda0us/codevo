// course.js - JavaScript for Course Detail Page
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    // Initialize first tab as active
    let activeTab = document.querySelector('.tab[aria-selected="true"]');
    let activePanel = document.querySelector('.tab-panel[aria-hidden="false"]');
    
    // Tab click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active state from all tabs and panels
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
            });
            
            panels.forEach(panel => {
                panel.setAttribute('aria-hidden', 'true');
            });
            
            // Set active state for clicked tab
            this.setAttribute('aria-selected', 'true');
            this.setAttribute('tabindex', '0');
            this.focus();
            
            // Show corresponding panel
            const panelId = this.id.replace('tab-', 'panel-');
            const activePanel = document.getElementById(panelId);
            if (activePanel) {
                activePanel.setAttribute('aria-hidden', 'false');
            }
            
            // Update URL hash without scrolling
            history.replaceState(null, null, `#${this.id}`);
        });
        
        // Keyboard navigation for tabs
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextTab = this.nextElementSibling || tabs[0];
                nextTab.click();
                nextTab.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevTab = this.previousElementSibling || tabs[tabs.length - 1];
                prevTab.click();
                prevTab.focus();
            }
        });
    });
    
    // Enrollment button functionality
    const enrollButton = document.querySelector('.enroll-box button');
    if (enrollButton) {
        enrollButton.addEventListener('click', function() {
            const courseTitle = document.getElementById('class-title').textContent;
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Memproses...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Success message
                alert(`Selamat! Anda telah berhasil mendaftar ke kelas "${courseTitle}". Silakan periksa email Anda untuk instruksi selanjutnya.`);
                
                // Reset button
                this.textContent = originalText;
                this.disabled = false;
                
                // Optional: Change button state to show enrolled
                this.textContent = 'Sudah Terdaftar';
                this.style.backgroundColor = '#2563EB';
                this.style.cursor = 'default';
                
                // Track enrollment in localStorage
                const enrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '{}');
                enrollments[courseTitle] = new Date().toISOString();
                localStorage.setItem('courseEnrollments', JSON.stringify(enrollments));
                
            }, 1500);
        });
    }
    
    // Lesson list interaction
    const lessonItems = document.querySelectorAll('.lesson-list li');
    lessonItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all lessons
            lessonItems.forEach(lesson => lesson.classList.remove('active'));
            
            // Add active class to clicked lesson
            this.classList.add('active');
            
            // In a real app, you would load the lesson content here
            console.log(`Loading lesson: ${this.textContent.split(' ')[0]}`);
        });
        
        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Review rating interaction
    const ratingStars = document.querySelectorAll('.rating svg');
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const ratingContainer = this.closest('.rating');
            const stars = ratingContainer.querySelectorAll('svg');
            const clickedIndex = Array.from(stars).indexOf(this);
            
            // Update stars visual state
            stars.forEach((s, index) => {
                if (index <= clickedIndex) {
                    s.classList.add('filled');
                    s.classList.remove('empty');
                } else {
                    s.classList.add('empty');
                    s.classList.remove('filled');
                }
            });
            
            // In a real app, you would submit the rating here
            console.log(`Rating submitted: ${clickedIndex + 1} stars`);
        });
    });
    
    // Check if user is already enrolled
    function checkEnrollmentStatus() {
        const courseTitle = document.getElementById('class-title').textContent;
        const enrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '{}');
        
        if (enrollments[courseTitle] && enrollButton) {
            enrollButton.textContent = 'Sudah Terdaftar';
            enrollButton.style.backgroundColor = '#2563EB';
            enrollButton.addEventListener('click', function() {
                window.location.href = 'open-class.html';
            }) 
        }
    }
    
    // Initialize enrollment status check
    checkEnrollmentStatus();
    
    // Handle URL hash on page load
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const tabId = hash.substring(1); // Remove # symbol
            const tab = document.getElementById(tabId);
            if (tab && tab.classList.contains('tab')) {
                tab.click();
            }
        }
    }
    
    // Initialize tab state based on URL hash
    handleInitialHash();
    
    // Progress tracking simulation
    function trackProgress() {
        const progress = localStorage.getItem('courseProgress') || '0';
        console.log(`Course progress: ${progress}%`);
        
        // In a real app, you would update a progress bar here
    }
    
    // Initialize progress tracking
    trackProgress();
    
    // Tool card interaction
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.querySelector('.tool-title').textContent;
            alert(`Informasi lebih lanjut tentang ${toolName} akan tersedia di pelajaran terkait.`);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Print certificate functionality (placeholder)
    const printCertificate = () => {
        alert('Fitur cetak sertifikat akan tersedia setelah menyelesaikan semua pelajaran dalam kursus ini.');
    };
    
    // Add print certificate button if not exists
    const certificateItem = document.querySelector('.summary-item:nth-child(3)');
    if (certificateItem) {
        certificateItem.style.cursor = 'pointer';
        certificateItem.addEventListener('click', printCertificate);
        certificateItem.title = 'Klik untuk informasi sertifikat';
    }
    
    // Responsive behavior for mobile
    function handleMobileLayout() {
        if (window.innerWidth < 768) {
            // Add mobile-specific behaviors here
            document.querySelector('.main-grid').classList.add('mobile-layout');
        } else {
            document.querySelector('.main-grid').classList.remove('mobile-layout');
        }
    }
    
    // Initialize mobile layout
    handleMobileLayout();
    window.addEventListener('resize', handleMobileLayout);
    
    // Course completion simulation
    function simulateCompletion() {
        // This would be called when all lessons are completed
        console.log('Course completed! Showing certificate option...');
        
        // Enable certificate download
        const certificateItem = document.querySelector('.summary-item:nth-child(3)');
        if (certificateItem) {
            certificateItem.addEventListener('click', function() {
                // In a real app, this would download the certificate
                alert('Sertifikat berhasil diunduh!');
            });
        }
    }
    
    // Share course functionality
    function shareCourse() {
        const courseTitle = document.getElementById('class-title').textContent;
        const shareText = `Saya sedang belajar "${courseTitle}" di Codevo. Yuk bergabung!`;
        
        if (navigator.share) {
            navigator.share({
                title: courseTitle,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link kursus berhasil disalin ke clipboard!');
            });
        }
    }
    
    // Add share button if not exists
    const titleSection = document.querySelector('.title-section');
    if (titleSection && !document.querySelector('.share-btn')) {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg> Bagikan';
        shareBtn.style.marginLeft = '10px';
        shareBtn.style.padding = '5px 10px';
        shareBtn.style.background = 'transparent';
        shareBtn.style.border = '1px solid #ccc';
        shareBtn.style.borderRadius = '4px';
        shareBtn.style.cursor = 'pointer';
        shareBtn.addEventListener('click', shareCourse);
        
        titleSection.appendChild(shareBtn);
    }
    
    console.log('Course page JavaScript loaded successfully!');
});