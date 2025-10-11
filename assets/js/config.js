// js/config.js
const CONFIG = {
    // Untuk development - ganti dengan nilai asli kamu
    SHEET_ID: '16bXaa3Gh5T4WUBvBb7uBbKIBBjINYpdxRC2UxNkwUDs',
    API_KEY: '26fc0be7039c4997c2fbd18bdefded178898080f'
};

// Export biar bisa dipake di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}