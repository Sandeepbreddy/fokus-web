// Simple router for Fokus app - handles password reset and email confirmation

class Router
{
    constructor()
    {
        this.routes = {};
        this.currentRoute = null;

        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', () => this.handleRoute());

        // Handle hash changes for Supabase auth callbacks
        window.addEventListener('hashchange', () => this.handleHashChange());
    }

    route(path, handler)
    {
        this.routes[path] = handler;
        return this;
    }

    navigate(path)
    {
        // Only use pushState for actual navigation, not for hash-based auth callbacks
        if (!path.startsWith('#'))
        {
            window.history.pushState({}, '', path);
        }
        this.handleRoute();
    }

    handleRoute()
    {
        const path = window.location.pathname;
        const hash = window.location.hash;

        // Check for auth-related hash parameters
        if (hash.includes('access_token') || hash.includes('type=recovery') || hash.includes('type=signup'))
        {
            this.handleAuthCallback();
            return;
        }

        // Handle regular routes
        const handler = this.routes[path] || this.routes['/'];
        if (handler)
        {
            this.currentRoute = path;
            handler();
        }
    }

    handleHashChange()
    {
        const hash = window.location.hash;
        if (hash.includes('access_token') || hash.includes('type=recovery') || hash.includes('type=signup'))
        {
            this.handleAuthCallback();
        }
    }

    handleAuthCallback()
    {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');

        switch (type)
        {
            case 'recovery':
                // Password reset
                if (typeof PasswordResetPage !== 'undefined')
                {
                    PasswordResetPage.render();
                }
                break;
            case 'signup':
            case 'email':
                // Email confirmation
                if (typeof EmailConfirmationPage !== 'undefined')
                {
                    EmailConfirmationPage.render();
                }
                break;
            default:
                // Check if we're on a specific route
                if (window.location.pathname === '/reset-password')
                {
                    if (typeof PasswordResetPage !== 'undefined')
                    {
                        PasswordResetPage.render();
                    }
                } else if (window.location.pathname === '/confirm-email')
                {
                    if (typeof EmailConfirmationPage !== 'undefined')
                    {
                        EmailConfirmationPage.render();
                    }
                }
        }
    }

    init()
    {
        // Set up default routes
        this.route('/', () =>
        {
            // Landing page is already in HTML
            if (typeof App !== 'undefined')
            {
                App.initLandingPageInteractions();
            }
        })
            .route('/reset-password', () =>
            {
                if (typeof PasswordResetPage !== 'undefined')
                {
                    PasswordResetPage.render();
                }
            })
            .route('/confirm-email', () =>
            {
                if (typeof EmailConfirmationPage !== 'undefined')
                {
                    EmailConfirmationPage.render();
                }
            });

        // Handle initial route
        this.handleRoute();
    }

    getCurrentRoute()
    {
        return this.currentRoute || window.location.pathname;
    }
}

// Create global router instance
const router = new Router();