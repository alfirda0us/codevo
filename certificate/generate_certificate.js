// Client-side PDF generation using html2canvas and jsPDF with innerHTML and base64 images
function generateCertificate(name, course, date) {
    console.log('Starting certificate generation...');

    // Load required libraries
    const loadLibraries = async () => {
        const promises = [];

        if (typeof jspdf === 'undefined') {
            console.log('Loading jsPDF...');
            promises.push(new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = () => {
                    console.log('jsPDF loaded');
                    resolve();
                };
                script.onerror = () => {
                    console.error('Failed to load jsPDF');
                    resolve();
                };
                document.head.appendChild(script);
            }));
        }

        if (typeof html2canvas === 'undefined') {
            console.log('Loading html2canvas...');
            promises.push(new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = () => {
                    console.log('html2canvas loaded');
                    resolve();
                };
                script.onerror = () => {
                    console.error('Failed to load html2canvas');
                    resolve();
                };
                document.head.appendChild(script);
            }));
        }

        await Promise.all(promises);
        console.log('All libraries loaded, loading images...');
        loadImagesAndGenerate(name, course, date);
    };

    loadLibraries();
}

// Function to load images as base64
async function loadImagesAndGenerate(name, course, date) {
    try {
        console.log('Loading images as base64...');

        const imagePromises = [
            loadImageAsBase64('assets/src/icon/iconwithtext.svg'),
            loadImageAsBase64('assets/src/img/kenzie-signature.png'),
            loadImageAsBase64('assets/src/img/rauf-signature.png')
        ];

        const [logoData, kenzieSignatureData, raufSignatureData] = await Promise.all(imagePromises);

        console.log('All images loaded, generating PDF...');
        generatePDF(name, course, date, logoData, kenzieSignatureData, raufSignatureData);
    } catch (error) {
        console.error('Error loading images:', error);
        // Fallback to text-only version
        console.log('Falling back to text-only certificate...');
        generatePDF(name, course, date, null, null, null);
    }
}

// Helper function to load image as base64
async function loadImageAsBase64(src) {
    try {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn(`Failed to load image ${src}:`, error);
        return null;
    }
}

function generatePDF(name, course, date, logoData, kenzieSignatureData, raufSignatureData) {
    try {
        console.log('Creating HTML content with innerHTML...');

        // Define image variables (use base64 data if available, otherwise fallback)
        const logoSrc = logoData || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzI1NjNlYiIvPgo8dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvZGV2bzwvdGV4dD4KPHN2Zz4=';
        const kenzieSignatureSrc = kenzieSignatureData || '';
        const raufSignatureSrc = raufSignatureData || '';

        // Create a temporary HTML element with the certificate content using innerHTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
            <div style="
                width: 900px;
                height: 600px;
                background: #f8fafc;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    width: 800px;
                    background: white;
                    border-radius: 20px;
                    padding: 60px 80px;
                    text-align: center;
                    border: 1px solid #e5e7eb;
                    position: relative;
                ">
                    <div style="font-size: 32px; font-weight: 700; color: #2563eb; margin-bottom: 20px;">
                        ${logoData ? `<img src="${logoSrc}" alt="Codevo Logo" style="height: 40px; width: auto;">` : 'Codevo'}
                    </div>
                    <div style="font-size: 36px; color: #2563eb; font-weight: 700; margin-top: 20px;">Certificate of Completion</div>
                    <div style="font-size: 18px; color: #2563eb; margin-top: 10px;">this certificate is proudly presented to :</div>

                    <div style="
                        margin-top: 40px;
                        font-size: 20px;
                        font-weight: 500;
                        color: #000;
                        border-bottom: 1px solid #000;
                        display: inline-block;
                        width: 60%;
                        padding-bottom: 5px;
                    ">${name}</div>

                    <div style="color: #2563eb; font-weight: 600; margin-top: 30px;">for completing class of:</div>

                    <div style="
                        margin-top: 20px;
                        font-size: 20px;
                        font-weight: 500;
                        color: #000;
                        border-bottom: 1px solid #000;
                        display: inline-block;
                        width: 60%;
                        padding-bottom: 5px;
                    ">${course}</div>

                    <div style="
                        margin-top: 30px;
                        font-size: 14px;
                        color: #111;
                        line-height: 1.5;
                        max-width: 700px;
                        margin-left: auto;
                        margin-right: auto;
                    ">
                        Sertifikat ini diberikan kepada peserta yang telah menyelesaikan kelas di Codevo sebagai bukti keberhasilan dan komitmen dalam mempelajari dasar pengembangan web.
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 60px;">
                        <div style="text-align: center;">
                            ${kenzieSignatureData ? `<img src="${kenzieSignatureSrc}" alt="Kenzie Signature" style="height: 70px; width: auto;">` : '<div style="font-size: 24px;"></div>'}
                            <div style="font-weight: 600; margin-top: 5px;">Kenzie A. Firdaus</div>
                            <div style="color: #2563eb; font-weight: 500;">Founder of Codevo</div>
                        </div>
                        <div style="text-align: center;">
                            ${raufSignatureData ? `<img src="${raufSignatureSrc}" alt="Haidar Signature" style="height: 70px; width: auto;">` : '<div style="font-size: 24px;"></div>'}
                            <div style="font-weight: 600; margin-top: 5px;">Haidar Rauf</div>
                            <div style="color: #2563eb; font-weight: 500;">Founder of Codevo</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                font-size: 12px;
                color: #9ca3af;
            ">© 2025 Codevo. All rights reserved.</div>
        `;

        // Style the temp div
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '900px';
        tempDiv.style.height = '600px';
        document.body.appendChild(tempDiv);

        console.log('HTML element created and added to DOM');

        // Simple approach - wait a bit then capture
        setTimeout(() => {
            console.log('Starting html2canvas capture...');
            captureAndGeneratePDF(tempDiv, name, course);
        }, 1000);
    } catch (error) {
        console.error('Error in generatePDF:', error);
        alert('Error generating certificate. Please try again.');
    }
}

function captureAndGeneratePDF(tempDiv, name, course) {
    try {
        // Use html2canvas to capture the HTML as image
        html2canvas(tempDiv, {
            scale: 2,
            useCORS: false,
            allowTaint: true,
            backgroundColor: '#f8fafc',
            width: 900,
            height: 600,
            logging: false
        }).then(canvas => {
            console.log('html2canvas capture successful, canvas size:', canvas.width, 'x', canvas.height);

            const imgData = canvas.toDataURL('image/png');
            console.log('Image data created, length:', imgData.length);

            const { jsPDF } = window.jspdf;

            // Create A4 landscape PDF
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            console.log('jsPDF document created');

            // Set PDF properties
            doc.setProperties({
                title: 'Certificate of Completion - Codevo',
                subject: 'Certificate of Completion',
                author: 'Codevo',
                keywords: 'certificate, codevo, completion, course',
                creator: 'Codevo Platform'
            });

            // Calculate dimensions to fit A4
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            console.log('Adding image to PDF, dimensions:', imgWidth, 'x', imgHeight);

            // Add the captured image to PDF
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Generate filename
            const filename = `Certificate_Codevo_${course.replace(/\s+/g, '_')}_${name.replace(/\s+/g, '_')}.pdf`;

            console.log('Saving PDF with filename:', filename);

            // Download the PDF
            doc.save(filename);

            // Remove temp element
            document.body.removeChild(tempDiv);

            console.log('Certificate generation completed successfully!');
        }).catch(error => {
            console.error('Error in html2canvas:', error);
            alert('Error generating certificate. Please try again.');
            document.body.removeChild(tempDiv);
        });
    } catch (error) {
        console.error('Error in captureAndGeneratePDF:', error);
        alert('Error generating certificate. Please try again.');
        document.body.removeChild(tempDiv);
    }
}
