// Simplified router for Fokus app
// This is now mainly for compatibility - actual routing is handled in App.js

const router = {
    navigate(path)
    {
        console.log('Navigating to:', path);
        window.location.href = path;
    },

    init()
    {
        console.log('Router initialized');
        // Router functionality is now handled in App.js
    },

    getCurrentRoute()
    {
        return window.location.pathname;
    }
};

// Make router globally available
window.router = router;