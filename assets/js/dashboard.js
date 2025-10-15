// Initialize sample data
function initializeSampleData() {
    // Initialize currentUser if not exists
    if (!localStorage.getItem('currentUser')) {
        const sampleUser = {
            name: 'John Doe',
            email: 'john.doe@example.com'
        };
        localStorage.setItem('currentUser', JSON.stringify(sampleUser));
    }

    // Initialize courseEnrollments if not exists
    if (!localStorage.getItem('courseEnrollments')) {
        const sampleEnrollments = {
            'HTML & CSS Fundamentals': '2024-01-15T10:00:00.000Z',
            'JavaScript Basics': '2024-01-20T14:30:00.000Z',
            'React Development': '2024-02-01T09:15:00.000Z'
        };
        localStorage.setItem('courseEnrollments', JSON.stringify(sampleEnrollments));
    }

    // Initialize certificates if not exists
    if (!localStorage.getItem('certificates')) {
        const sampleCertificates = [
            {
                id: 'cert-001',
                courseName: 'HTML & CSS Fundamentals',
                date: '15 Januari 2024',
                claimed: false
            },
            {
                id: 'cert-002',
                courseName: 'JavaScript Basics',
                date: '20 Januari 2024',
                claimed: true,
                claimedDate: '22 Januari 2024',
                certificateNumber: '12345678'
            }
        ];
        localStorage.setItem('certificates', JSON.stringify(sampleCertificates));
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

    // Initialize sample data if not exists
    initializeSampleData();

    // Load user profile
    loadUserProfile();

    // Load dashboard stats
    loadDashboardStats();

    // Load classes
    loadClasses();

    // Load certificates
    loadCertificates();

    // Set up navigation
    setupNavigation();
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

    // Update rating (dummy data for now)
    const ratingCount = document.getElementById('rating-count');
    if (ratingCount) {
        ratingCount.textContent = '4.7';
    }
}

// Load classes
function loadClasses() {
    const courseEnrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '{}');
    const classesList = document.getElementById('classes-list');

    if (classesList) {
        const enrolledCourses = Object.keys(courseEnrollments);
        if (enrolledCourses.length > 0) {
            classesList.innerHTML = enrolledCourses.map(courseTitle => `
                <div class="class-card">
                    <div class="class-icon">
                        <i class="fa-solid fa-book"></i>
                    </div>
                    <div class="class-info">
                        <h4>${courseTitle}</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 50%"></div>
                        </div>
                        <p>Progress: 50%</p>
                    </div>
                    <div class="class-actions">
                        <button class="btn-detail" onclick="viewCourse('${courseTitle}')">Detail Kelas</button>
                    </div>
                </div>
            `).join('');
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
            certificatesList.innerHTML = certificates.map(cert => `
                <div class="certificate-card">
                    <div class="certificate-icon">
                        <i class="fa-solid fa-certificate"></i>
                    </div>
                    <div class="certificate-info">
                        <h4>${cert.courseName}</h4>
                        <p>Diterbitkan: ${cert.date}</p>
                    </div>
                    <div class="class-actions">
                        ${cert.claimed ? '<span class="claimed-text">Terklaim</span>' : `<button class="btn-claim" onclick="claimCertificate('${cert.id}')">Klaim</button>`}
                    </div>
                </div>
            `).join('');
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
        'Daftar Kelas': 'classes-view',
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

function showClasses() {
    // Already handled by setupNavigation
}

function showCertificates() {
    // Already handled by setupNavigation
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
