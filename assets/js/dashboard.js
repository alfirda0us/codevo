// Initialize real data based on actual courses and progress
function initializeRealData() {
    // Initialize currentUser if not exists
    if (!localStorage.getItem('currentUser')) {
        const realUser = {
            name: 'Pelajar Codevo',
            email: 'pelajar@codevo.id'
        };
        localStorage.setItem('currentUser', JSON.stringify(realUser));
    }

    // Initialize courseEnrollments based on actual courses
    if (!localStorage.getItem('courseEnrollments')) {
        const realEnrollments = {
            'HTML Dasar': '2024-01-15T10:00:00.000Z',
            'Networking Dasar': '2024-01-20T14:30:00.000Z'
        };
        localStorage.setItem('courseEnrollments', JSON.stringify(realEnrollments));
    }

    // Initialize certificates based on course progress
    if (!localStorage.getItem('certificates')) {
        const realCertificates = [
            {
                id: 'cert-html-001',
                courseName: 'HTML Dasar',
                date: '15 Januari 2024',
                claimed: false
            },
            {
                id: 'cert-networking-001',
                courseName: 'Networking Dasar',
                date: '20 Januari 2024',
                claimed: false
            }
        ];
        localStorage.setItem('certificates', JSON.stringify(realCertificates));
    } else {
        // Update existing certificates if they have old course names
        const existingCertificates = JSON.parse(localStorage.getItem('certificates'));
        let needsUpdate = false;

        existingCertificates.forEach(cert => {
            if (cert.courseName === 'HTML Master') {
                cert.courseName = 'HTML Dasar';
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            localStorage.setItem('certificates', JSON.stringify(existingCertificates));
        }
    }

    // Initialize course progress for HTML course - start with 0 progress for new users
    if (!localStorage.getItem('htmlCourseProgress')) {
        const htmlProgress = {
            totalLessons: 6,
            completedLessons: 0, // Start with no lessons completed
            currentLesson: 1, // Start with first lesson
            progressPercentage: 0, // 0% progress initially
            lessons: {
                1: { completed: false, title: "Selamat datang", duration: "1:00" },
                2: { completed: false, title: "HTML Introduction", duration: "15:00" },
                3: { completed: false, title: "Apa itu Element HTML?", duration: "20:00" },
                4: { completed: false, title: "Atribut-atribut HTML", duration: "18:00" },
                5: { completed: false, title: "Kesimpulan", duration: "12:00" },
                6: { completed: false, title: "Penutupan", duration: "10:00" }
            }
        };
        localStorage.setItem('htmlCourseProgress', JSON.stringify(htmlProgress));
    }
}

// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'pages/signup/signup.html';
        return;
    }

    // Initialize real data if not exists
    initializeRealData();

    // Load user profile
    loadUserProfile();

    // Load enrolled classes
    loadClasses();

    // Load certificates
    loadCertificates();

    // Set up navigation
    setupNavigation();

    // Check for URL parameters to auto-navigate to sections
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section === 'certificates') {
        // Auto-navigate to certificates section
        setTimeout(() => {
            showCertificates();
        }, 100); // Small delay to ensure DOM is ready
    }
});



// Load user profile
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Nama User' };
    const userNameElement = document.getElementById('user-name');
    const userNameClassesElement = document.getElementById('user-name-classes');

    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    if (userNameClassesElement) {
        userNameClassesElement.textContent = currentUser.name;
    }
}

// Load dashboard stats
function loadDashboardStats() {
    const courseEnrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '{}');
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];

    // Update enrolled count
    const enrolledCount = document.getElementById('enrolled-count');
    if (enrolledCount) {
        enrolledCount.textContent = Object.keys(courseEnrollments).length;
    }

    // Update certificates count
    const certificatesCount = document.getElementById('certificates-count');
    if (certificatesCount) {
        certificatesCount.textContent = certificates.length;
    }

    // Remove rating stat as it's not realistic for a student
    // The rating stat was removed from dashboard.html as per user request
}

// Load classes
function loadClasses() {
    const courseEnrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '{}');
    const classesList = document.getElementById('classes-list');

    if (classesList) {
        const enrolledCourses = Object.keys(courseEnrollments);
        if (enrolledCourses.length > 0) {
            classesList.innerHTML = enrolledCourses.map(courseTitle => {
                // Get progress for each course
                let progress = 0;
                let progressText = 'Belum dimulai';

                if (courseTitle === 'HTML Dasar') {
                    const htmlProgress = JSON.parse(localStorage.getItem('htmlCourseProgress') || '{}');
                    progress = htmlProgress.progressPercentage || 0;
                    progressText = `${progress}%`;
                } else if (courseTitle === 'Networking Dasar') {
                    // For networking course, assume not started yet
                    progress = 0;
                    progressText = 'Belum dimulai';
                }

                return `
                    <div class="class-card">
                        <div class="class-icon">
                            <i class="fa-solid fa-book"></i>
                        </div>
                        <div class="class-info">
                            <h4>${courseTitle}</h4>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <p>Progress: ${progressText}</p>
                        </div>
                        <div class="class-actions">
                            <button class="btn-detail" onclick="viewCourse('${courseTitle.replace(/'/g, "\\'")}')">Detail Kelas</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            classesList.innerHTML = '<p>Belum ada kelas yang diikuti.</p>';
        }
    }
}

// Load certificates
function loadCertificates() {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const certificatesList = document.getElementById('certificates-list');

    if (certificatesList) {
        if (certificates.length > 0) {
            certificatesList.innerHTML = certificates.map(cert => {
                // Check if course is completed before allowing claim
                const isCourseCompleted = checkCourseCompletion(cert.courseName);
                const canClaim = !cert.claimed && isCourseCompleted;

                return `
                    <div class="certificate-card ${!isCourseCompleted ? 'locked' : ''}">
                        <div class="certificate-icon">
                            <i class="fa-solid fa-certificate"></i>
                        </div>
                        <div class="certificate-info">
                            <h4>${cert.courseName}</h4>
                            <p>Diterbitkan: ${cert.date}</p>
                            ${!isCourseCompleted ? '<p class="course-not-completed">Kursus belum diselesaikan</p>' : ''}
                        </div>
                        <div class="class-actions">
                            ${cert.claimed ? '<span class="claimed-text">Terklaim</span>' :
                             !isCourseCompleted ? '<span class="locked-text">Terkunci</span>' :
                             `<button class="btn-claim" onclick="claimCertificate('${cert.id}')">Klaim</button>`}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            certificatesList.innerHTML = '<p>Belum ada sertifikat.</p>';
        }
    }
}

// Setup navigation
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentTitle = document.getElementById('content-title');

    // Map button text to view IDs
    const viewMap = {
        'Dashboard': 'dashboard-view',
        'Profil': 'profile-view',
        'Sertifikat': 'certificates-view'
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            navBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all content views
            const views = document.querySelectorAll('.content-view');
            views.forEach(view => view.classList.remove('active'));

            // Show selected view
            const buttonText = this.textContent.trim();
            const targetViewId = viewMap[buttonText];
            const targetView = document.getElementById(targetViewId);
            if (targetView) {
                targetView.classList.add('active');
                contentTitle.textContent = buttonText;
            }
        });
    });
}

// Navigation functions
function showDashboard() {
    // Already handled by setupNavigation
}



function showCertificates() {
    // Already handled by setupNavigation
}

function showProfile() {
    // Already handled by setupNavigation
    // Load profile form with current user data
    loadProfileForm();
}

// Load profile form with current user data
function loadProfileForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Pelajar Codevo', email: 'pelajar@codevo.id', username: 'codevo_student' };

    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const usernameInput = document.getElementById('profile-username');

    if (nameInput) nameInput.value = currentUser.name || 'Pelajar Codevo';
    if (emailInput) emailInput.value = currentUser.email || 'pelajar@codevo.id';
    if (usernameInput) usernameInput.value = currentUser.username || 'codevo_student';

    // Set up form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfile);
    }
}

// Save profile changes
function saveProfile(event) {
    event.preventDefault();

    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const usernameInput = document.getElementById('profile-username');

    const updatedUser = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        username: usernameInput.value.trim()
    };

    // Basic validation
    if (!updatedUser.name || !updatedUser.email || !updatedUser.username) {
        alert('Semua field harus diisi.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedUser.email)) {
        alert('Format email tidak valid.');
        return;
    }

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update sidebar display
    loadUserProfile();

    alert('Profil berhasil diperbarui!');
}

// View class detail
function viewClassDetail(courseId) {
    // Redirect to class detail page or open modal
    window.location.href = `pages/courses/${courseId}/class-detail.html`;
}

// View course
function viewCourse(courseTitle) {
    // Redirect to course page based on title
    // This is a simplified version - in real app, you'd have course IDs
    if (courseTitle.includes('HTML')) {
        window.location.href = 'pages/courses/html-course/open-class.html';
    } else {
        alert('Halaman kursus sedang dalam pengembangan');
    }
}

// Claim certificate
function claimCertificate(certId) {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    const certIndex = certificates.findIndex(cert => cert.id === certId);
    if (certIndex === -1) {
        alert('Sertifikat tidak ditemukan.');
        return;
    }

    const cert = certificates[certIndex];
    if (cert.claimed) {
        alert('Sertifikat sudah diklaim.');
        return;
    }

    if (!currentUser.email) {
        alert('Email pengguna tidak ditemukan. Silakan login ulang.');
        return;
    }

    // Generate certificate number (random 8-digit)
    const certNumber = Math.floor(10000000 + Math.random() * 90000000);

    // Construct Gmail compose URL
    const subject = encodeURIComponent(`Sertifikat Kursus - ${cert.courseName}`);
    const body = encodeURIComponent(`
Selamat! Anda telah menyelesaikan kursus ${cert.courseName}.

Detail Sertifikat:
- Nama: ${currentUser.name}
- Kursus: ${cert.courseName}
- Tanggal Penyelesaian: ${cert.date}
- Nomor Sertifikat: ${certNumber}

Terima kasih telah belajar di platform kami!

Salam,
Tim Edukasi
    `.trim());

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(currentUser.email)}&su=${subject}&body=${body}`;

    // Open Gmail compose in new tab
    window.open(gmailUrl, '_blank');

    // Mark as claimed
    certificates[certIndex].claimed = true;
    certificates[certIndex].claimedDate = new Date().toLocaleDateString('id-ID');
    certificates[certIndex].certificateNumber = certNumber;

    localStorage.setItem('certificates', JSON.stringify(certificates));

    // Reload certificates to update UI
    loadCertificates();

    alert('Sertifikat berhasil diklaim! Email telah dibuka di Gmail.');
}

// Check if a course is completed
function checkCourseCompletion(courseName) {
    if (courseName === 'HTML Dasar') {
        const htmlProgress = JSON.parse(localStorage.getItem('htmlCourseProgress') || '{}');
        return htmlProgress.progressPercentage === 100;
    } else if (courseName === 'Networking Dasar') {
        // For networking course, check if it has progress data
        // For now, assume it's not completed since the course isn't implemented
        return false;
    }
    return false;
}

// Logout function with confirmation
function logout() {
    const confirmLogout = confirm('Apakah Anda yakin ingin logout? Semua data akan dihapus.');

    if (confirmLogout) {
        // Clear all localStorage data
        localStorage.clear();

        // Redirect to signup page
        window.location.href = 'pages/signup/signup.html';
    }
}
