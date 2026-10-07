(function() {
    try {
        var savedTheme = localStorage.getItem('lazyeye-theme') || 
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        if (document.body) {
            document.body.setAttribute('data-theme', savedTheme);
        }
    } catch (e) {
        console.error('Error applying theme:', e);
    }
})();

