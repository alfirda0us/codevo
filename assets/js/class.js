// Adaptasi dari class.js
        const progressData = {
            totalLessons: 6,
            completedLessons: 0,
            currentLesson: 1,
            progressPercentage: 0,
            lessons: {
                1: { completed: false, title: "Selamat datang", duration: "1:00",
                     desc: `<h3>Selamat Datang di HTML Dasar</h3><p>Selamat datang di kursus HTML Dasar! Di kursus ini, Anda akan mempelajari dasar-dasar HTML dari nol hingga mahir.</p><p>HTML adalah fondasi dari semua website. Dengan menguasai HTML, Anda akan dapat membuat struktur website yang solid.</p><p><strong>Apa yang akan Anda pelajari:</strong></p><ul><li>Struktur dasar HTML</li><li>Elemen dan atribut HTML</li><li>Heading, paragraf, dan formatting text</li><li>Link dan navigasi</li><li>Gambar dan multimedia</li><li>List dan tabel</li></ul>` },
                2: { completed: false, title: "HTML Introduction", duration: "15:00", 
                     desc: `<h3>Pengenalan HTML</h3><p>HTML (HyperText Markup Language) adalah bahasa markup standar untuk membuat halaman web.</p><ul><li><code>&lt;!DOCTYPE html&gt;</code> - Deklarasi tipe dokumen</li><li><code>&lt;html&gt;</code> - Elemen root</li><li><code>&lt;head&gt;</code> - Meta informasi</li><li><code>&lt;body&gt;</code> - Konten halaman</li></ul>` },
                3: { completed: false, title: "HTML Basic Structure", duration: "20:00",
                     desc: `<h3>Struktur Dasar HTML</h3><p>Setiap dokumen HTML memiliki struktur dasar yang konsisten.</p>` },
                4: { completed: false, title: "HTML Elements", duration: "18:00",
                     desc: `<h3>Elemen HTML</h3><p>Elemen adalah blok bangunan dari halaman HTML.</p>` },
                5: { completed: false, title: "HTML Attributes", duration: "12:00",
                     desc: `<h3>Atribut HTML</h3><p>Atribut memberikan informasi tambahan tentang elemen.</p>` },
                6: { completed: false, title: "HTML Headings", duration: "10:00",
                     desc: `<h3>Heading HTML</h3><p>Heading dari h1 sampai h6 untuk hierarki konten.</p>` }
            }
        };

        let currentLessonNum = progressData.currentLesson;

        function saveProgressToLocalStorage() {
            localStorage.setItem('htmlCourseProgress', JSON.stringify(progressData));
        }

        function loadProgressFromLocalStorage() {
            const saved = localStorage.getItem('htmlCourseProgress');
            if (saved) {
                const savedData = JSON.parse(saved);
                Object.assign(progressData, savedData);
            }
        }

        function initializeLearningPage() {
            loadProgressFromLocalStorage();
            currentLessonNum = progressData.currentLesson;
            updateCurrentLessonContent(currentLessonNum);
            updateLessonSidebar();
            updateProgressBar(progressData.progressPercentage);
        }

        function setupEventListeners() {
            const lessonItems = document.querySelectorAll('.lesson-item');
            lessonItems.forEach((item, index) => {
                item.addEventListener('click', function() {
                    selectLesson(index + 1);
                });
            });

            document.getElementById('mark-complete').addEventListener('click', markLessonComplete);
            document.getElementById('confirm-complete').addEventListener('click', confirmCourseComplete);
        }

        function selectLesson(lessonNumber) {
            if (lessonNumber < 1 || lessonNumber > progressData.totalLessons) return;

            currentLessonNum = lessonNumber;
            progressData.currentLesson = lessonNumber;

            updateCurrentLessonContent(lessonNumber);
            updateLessonSidebar();

            document.querySelector('.main-content').scrollTo(0, 0);

            saveProgressToLocalStorage();
        }

        function updateCurrentLessonContent(lessonNumber) {
            const lessonData = progressData.lessons[lessonNumber];
            if (!lessonData) return;

            // Hide all lesson content items
            const allLessons = document.querySelectorAll('.lesson-content-item');
            allLessons.forEach(lesson => {
                lesson.style.display = 'none';
            });

            // Show the current lesson
            const currentLessonDiv = document.getElementById(`lesson-${lessonNumber}`);
            if (currentLessonDiv) {
                currentLessonDiv.style.display = 'flex';
            }

            document.getElementById('lesson-title-display').textContent = `${lessonNumber}. ${lessonData.title}`;
            document.title = `${lessonData.title} - HTML Dasar`;

            const completeBtn = document.getElementById('mark-complete');
            if (lessonData.completed) {
                completeBtn.innerHTML = '<i class="fas fa-check"></i> Completed';
                completeBtn.disabled = true;
            } else {
                completeBtn.innerHTML = 'Mark Complete';
                completeBtn.disabled = false;
            }
        }

        function renderCode(code) {
            const lines = code.split('\n');
            let html = '';
            
            return html;
        }

        function highlightSyntax(code) {
            code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            code = code.replace(/&lt;(\/?[a-z0-9]+)/gi, '<span class="tag">&lt;$1');
            code = code.replace(/&gt;/g, '&gt;</span>');
            code = code.replace(/\s([a-z\-]+)=/gi, ' <span class="attribute">$1</span>=');
            code = code.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
            return code.replace(/\s/g, '&nbsp;');
        }

        function updateLessonSidebar() {
            const lessonItems = document.querySelectorAll('.lesson-item');

            lessonItems.forEach((item, index) => {
                const lessonNumber = index + 1;
                const lessonData = progressData.lessons[lessonNumber];

                if (!lessonData) return;

                const icon = item.querySelector('i');
                const lessonTitle = item.querySelector('.lesson-title');
                const lessonTime = item.querySelector('.lesson-time');

                item.classList.remove('active');

                if (lessonData.completed) {
                    icon.className = 'fas fa-check-circle completed';
                    item.classList.add('completed');
                    if (lessonTitle) lessonTitle.classList.add('completed');
                    if (lessonTime) lessonTime.classList.add('completed');
                } else {
                    icon.className = 'far fa-play-circle';
                    icon.style.color = '#6c757d';
                    if (lessonTitle) lessonTitle.classList.remove('completed');
                    if (lessonTime) lessonTime.classList.remove('completed');
                }

                if (lessonNumber === currentLessonNum) {
                    item.classList.add('active');
                    icon.className = 'fas fa-play-circle playing';
                }
            });
        }

        function markLessonComplete() {
            const lessonData = progressData.lessons[currentLessonNum];

            if (lessonData.completed) {
                showNotification('Lesson already completed!', 'info');
                return;
            }

            lessonData.completed = true;
            progressData.completedLessons += 1;

            const newPercentage = Math.round((progressData.completedLessons / progressData.totalLessons) * 100);
            progressData.progressPercentage = Math.min(newPercentage, 100);

            updateCurrentLessonContent(currentLessonNum);
            updateLessonSidebar();
            updateProgressBar(progressData.progressPercentage);

            saveProgressToLocalStorage();

            showNotification('Lesson marked as complete!', 'success');

            if (currentLessonNum === progressData.totalLessons) {
                setTimeout(() => {
                    showNotification('Congratulations! Course completed!', 'success');
                }, 2000);
            }
        }

        function updateProgressBar(progress) {
            document.querySelector('.progress-fill').style.width = `${progress}%`;
            document.querySelector('.progress-percent').textContent = `${progress}%`;

            // Show confirm complete button when progress is 100%
            const confirmBtn = document.getElementById('confirm-complete');
            if (progress === 100) {
                confirmBtn.style.display = 'inline-block';
            } else {
                confirmBtn.style.display = 'none';
            }
        }

        function confirmCourseComplete() {
            // Redirect to dashboard with certificates section
            window.location.href = '../../../dashboard.html?section=certificates';
        }

        function showNotification(message, type = 'info') {
            document.querySelectorAll('.notification').forEach(n => n.remove());

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            `;

            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });

            document.body.appendChild(notification);

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }

        document.addEventListener('keydown', function(e) {
            if (e.code === 'KeyN' && e.ctrlKey) {
                e.preventDefault();
                if (currentLessonNum < progressData.totalLessons) {
                    selectLesson(currentLessonNum + 1);
                }
            }
            
            if (e.code === 'KeyP' && e.ctrlKey) {
                e.preventDefault();
                if (currentLessonNum > 1) {
                    selectLesson(currentLessonNum - 1);
                }
            }
        });

        initializeLearningPage();
        setupEventListeners();

        console.log('Learning interface initialized - Fixed version');