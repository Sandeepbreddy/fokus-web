// Simple client-side router for Fokus app

class Router
{
    constructor()
    {
        this.routes = {};
        this.currentRoute = null;

        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', () => this.handleRoute());

        // Intercept link clicks
        document.addEventListener('click', (e) =>
        {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin))
            {
                const url = new URL(link.href);
                // Only handle internal links without hash
                if (!url.hash && !link.hasAttribute('data-external'))
                {
                    e.preventDefault();
                    this.navigate(url.pathname);
                }
            }
        });
    }

    // Register a route
    route(path, handler)
    {
        this.routes[path] = handler;
        return this;
    }

    // Navigate to a route
    navigate(path)
    {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    // Handle current route
    handleRoute()
    {
        const path = window.location.pathname;
        const handler = this.routes[path] || this.routes['*'];

        if (handler)
        {
            this.currentRoute = path;
            handler();
        }
    }

    // Initialize router
    init()
    {
        this.handleRoute();
    }

    // Get current route
    getCurrentRoute()
    {
        return this.currentRoute || window.location.pathname;
    }

    // Check if current route matches
    isRoute(path)
    {
        return this.getCurrentRoute() === path;
    }
}

// Create global router instance
const router = new Router();