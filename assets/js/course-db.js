// course-database.js
class CourseDatabase {
    constructor(sheetId, apiKey) {
        this.db = new GoogleSheetsDB(sheetId, apiKey);
    }

    // COURSES OPERATIONS
    async getAllCourses() {
        return await this.db.readSheet('Courses');
    }

    async getCourseById(id) {
        const courses = await this.getAllCourses();
        return courses.find(course => course.id == id);
    }

    async getCoursesByCategory(category) {
        const courses = await this.getAllCourses();
        return courses.filter(course => 
            course.category.toLowerCase() === category.toLowerCase() && 
            course.is_active === 'TRUE'
        );
    }

    // USERS OPERATIONS
    async getAllUsers() {
        return await this.db.readSheet('Users');
    }

    async getUserById(id) {
        const users = await this.getAllUsers();
        return users.find(user => user.id == id);
    }

    async getUserByEmail(email) {
        const users = await this.getAllUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    async createUser(userData) {
        const users = await this.getAllUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;
        
        const newUser = [
            newId.toString(),
            userData.name,
            userData.email,
            userData.phone,
            userData.password_hash,
            userData.role || 'student',
            new Date().toISOString().split('T')[0],
            '',
            'TRUE'
        ];
        
        return await this.db.appendToSheet('Users', newUser);
    }

    // ENROLLMENTS OPERATIONS
    async getAllEnrollments() {
        return await this.db.readSheet('Enrollments');
    }

    async getEnrollmentsByUser(userId) {
        const enrollments = await this.getAllEnrollments();
        return enrollments.filter(enrollment => enrollment.user_id == userId);
    }

    async getEnrollmentsByCourse(courseId) {
        const enrollments = await this.getAllEnrollments();
        return enrollments.filter(enrollment => enrollment.course_id == courseId);
    }

    async enrollUser(userId, courseId) {
        const enrollments = await this.getAllEnrollments();
        const existingEnrollment = enrollments.find(e => 
            e.user_id == userId && e.course_id == courseId
        );

        if (existingEnrollment) {
            throw new Error('User already enrolled in this course');
        }

        const newId = enrollments.length > 0 ? Math.max(...enrollments.map(e => parseInt(e.id))) + 1 : 1;
        
        const newEnrollment = [
            newId.toString(),
            userId.toString(),
            courseId.toString(),
            new Date().toISOString().split('T')[0],
            'enrolled',
            '0', // progress
            new Date().toISOString().split('T')[0]
        ];
        
        return await this.db.appendToSheet('Enrollments', newEnrollment);
    }

    async updateProgress(userId, courseId, progress) {
        const enrollments = await this.getAllEnrollments();
        const enrollment = enrollments.find(e => 
            e.user_id == userId && e.course_id == courseId
        );

        if (!enrollment) {
            throw new Error('Enrollment not found');
        }

        const updatedEnrollment = [
            enrollment.id,
            enrollment.user_id,
            enrollment.course_id,
            enrollment.enrollment_date,
            progress >= 100 ? 'completed' : 'in_progress',
            progress.toString(),
            new Date().toISOString().split('T')[0]
        ];

        return await this.db.updateRow('Enrollments', enrollment._rowNumber, updatedEnrollment);
    }

    // CERTIFICATES OPERATIONS
    async getAllCertificates() {
        return await this.db.readSheet('Certificates');
    }

    async getCertificateByUser(userId) {
        const certificates = await this.getAllCertificates();
        return certificates.filter(cert => cert.user_id == userId);
    }

    async issueCertificate(userId, courseId) {
        const certificates = await this.getAllCertificates();
        const existingCertificate = certificates.find(cert => 
            cert.user_id == userId && cert.course_id == courseId
        );

        if (existingCertificate) {
            return existingCertificate; // Certificate already exists
        }

        const newId = certificates.length > 0 ? Math.max(...certificates.map(c => parseInt(c.id))) + 1 : 1;
        const certificateId = `CERT-${newId.toString().padStart(3, '0')}-${new Date().getFullYear()}`;
        const verificationCode = `CODEVO${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const newCertificate = [
            newId.toString(),
            userId.toString(),
            courseId.toString(),
            certificateId,
            new Date().toISOString().split('T')[0],
            `https://codevo.id/certificates/${certificateId}`,
            verificationCode
        ];
        
        await this.db.appendToSheet('Certificates', newCertificate);
        
        return {
            id: newId,
            certificate_id: certificateId,
            issue_date: newCertificate[4],
            download_url: newCertificate[5],
            verification_code: verificationCode
        };
    }

    async verifyCertificate(certificateId, verificationCode) {
        const certificates = await this.getAllCertificates();
        return certificates.find(cert => 
            cert.certificate_id === certificateId && 
            cert.verification_code === verificationCode
        );
    }
}

// course-detail.js
document.addEventListener('DOMContentLoaded', async function() {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || '1';

    try {
        // Load course data
        const course = await courseDB.getCourseById(courseId);
        if (!course) {
            alert('Course not found!');
            return;
        }

        // Load reviews for this course
        const reviews = await courseDB.getCourseReviews(courseId);

        // Display course data
        displayCourseData(course);
        displayReviews(reviews);

        // Check if user is enrolled
        const currentUser = getCurrentUser(); // You'll need to implement this
        if (currentUser) {
            const enrollment = await checkEnrollment(currentUser.id, courseId);
            updateEnrollmentButton(enrollment);
        }

    } catch (error) {
        console.error('Error loading course:', error);
    }
});

// Enrollment function
async function enrollInCourse(courseId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        alert('Please login first to enroll in this course');
        return;
    }

    try {
        await courseDB.enrollUser(currentUser.id, courseId);
        alert('Successfully enrolled in the course!');
        updateEnrollmentButton(true);
    } catch (error) {
        alert('Error enrolling: ' + error.message);
    }
}

// Check enrollment status
async function checkEnrollment(userId, courseId) {
    const enrollments = await courseDB.getEnrollmentsByUser(userId);
    return enrollments.find(e => e.course_id == courseId);
}

// Update UI based on enrollment
function updateEnrollmentButton(isEnrolled) {
    const enrollBtn = document.querySelector('.enroll-box button');
    if (isEnrolled) {
        enrollBtn.textContent = 'Continue Learning';
        enrollBtn.style.backgroundColor = '#28a745';
        enrollBtn.onclick = () => {
            // Redirect to learning page
            window.location.href = `/learn.html?course=${courseId}`;
        };
    } else {
        enrollBtn.textContent = 'Enroll Now';
        enrollBtn.onclick = () => enrollInCourse(courseId);
    }
}

// Display course data
function displayCourseData(course) {
    document.getElementById('class-title').textContent = course.title;
    document.querySelector('.title-section p').textContent = course.description;
    
    // Update other course info
    const levelElement = document.querySelector('.summary-item:nth-child(1) .summary-value');
    if (levelElement) levelElement.textContent = course.level;
    
    const memberElement = document.querySelector('.summary-item:nth-child(2) .summary-value');
    if (memberElement) {
        // You might want to count actual enrollments
        courseDB.getEnrollmentsByCourse(course.id).then(enrollments => {
            memberElement.textContent = enrollments.length;
        });
    }
}

// course-database.js
import { CONFIG } from './config.js';

class CourseDatabase {
    constructor() {
        this.db = new GoogleSheetsDB(CONFIG.SHEET_ID, CONFIG.API_KEY);
    }
}