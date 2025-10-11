// js/config.js
const CONFIG = {
    // Untuk development - ganti dengan nilai asli kamu
    SHEET_ID: '16bXaa3Gh5T4WUBvBb7uBbKIBBjINYpdxRC2UxNkwUDs',
    API_KEY: '26fc0be7039c4997c2fbd18bdefded178898080f',
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyBEnRQxd1JFHTgB663b_kn8XHdLGLM_poA6Y8Bj-YAsUh5tuRnQjRIqgpAlwefj5YZ/exec'
};

// Export biar bisa dipake di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}