// Main application entry point for Fokus

const App = {
    init()
    {
        // Set up routes
        this.setupRoutes();

        // Initialize Supabase auth listener
        this.setupAuthListener();

        // Handle initial route
        router.init();

        // Set up global error handling
        this.setupErrorHandling();

        // Make router globally accessible for onclick handlers
        window.router = router;
    },

    setupRoutes()
    {
        // Define application routes
        router
            .route('/', function () { LandingPage.render(); })
            .route('/reset-password', function () { PasswordResetPage.render(); })
            .route('/confirm-email', function () { EmailConfirmationPage.render(); })
            .route('*', function () { App.handle404(); });
    },

    setupAuthListener()
    {
        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) =>
        {
            console.log('Auth event:', event);

            switch (event)
            {
                case 'SIGNED_IN':
                    this.handleSignIn(session);
                    break;
                case 'SIGNED_OUT':
                    this.handleSignOut();
                    break;
                case 'PASSWORD_RECOVERY':
                    // User clicked password recovery link
                    router.navigate('/reset-password');
                    break;
                case 'USER_UPDATED':
                    // User's data was updated
                    this.handleUserUpdate(session);
                    break;
            }
        });
    },

    handleSignIn(session)
    {
        if (session)
        {
            // Store user session
            Utils.storage.set('fokus_user', {
                id: session.user.id,
                email: session.user.email,
                confirmed: session.user.confirmed_at !== null
            });

            // Check if user has pro subscription
            this.checkSubscription(session.user.id);
        }
    },

    handleSignOut()
    {
        // Clear stored user data
        Utils.storage.remove('fokus_user');
        Utils.storage.remove('fokus_subscription');

        // Redirect to home if on protected route
        const protectedRoutes = ['/dashboard', '/settings'];
        if (protectedRoutes.includes(router.getCurrentRoute()))
        {
            router.navigate('/');
        }
    },

    handleUserUpdate(session)
    {
        if (session)
        {
            // Update stored user data
            Utils.storage.set('fokus_user', {
                id: session.user.id,
                email: session.user.email,
                confirmed: session.user.confirmed_at !== null
            });
        }
    },

    async checkSubscription(userId)
    {
        try
        {
            // This would typically check your database for subscription status
            // For now, we'll just store a placeholder
            const subscription = {
                plan: 'free',
                expires_at: null
            };

            Utils.storage.set('fokus_subscription', subscription);
        } catch (error)
        {
            console.error('Error checking subscription:', error);
        }
    },

    handle404()
    {
        const app = Utils.$('#app');
        app.innerHTML = `
            <div class="auth-page">
                <div class="container">
                    <div class="auth-container text-center">
                        ${Components.Card({
            children: `
                                <h1 class="auth-title">404 - Page Not Found</h1>
                                <p class="auth-subtitle mb-4">The page you're looking for doesn't exist.</p>
                                ${Components.Button({
                text: 'Go to Home',
                variant: 'primary',
                onclick: "router.navigate('/')"
            })}
                            `
        })}
                    </div>
                </div>
            </div>
        `;
    },

    setupErrorHandling()
    {
        // Global error handler
        window.addEventListener('error', (event) =>
        {
            console.error('Global error:', event.error);

            // Log to error tracking service in production
            if (window.location.hostname !== 'localhost')
            {
                this.logError(event.error);
            }
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) =>
        {
            console.error('Unhandled promise rejection:', event.reason);

            // Log to error tracking service in production
            if (window.location.hostname !== 'localhost')
            {
                this.logError(event.reason);
            }
        });
    },

    logError(error)
    {
        // In production, you would send this to your error tracking service
        // For example: Sentry, LogRocket, etc.
        const errorData = {
            message: error.message || error,
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        // Store errors locally as fallback
        const errors = Utils.storage.get('fokus_errors') || [];
        errors.push(errorData);

        // Keep only last 10 errors
        if (errors.length > 10)
        {
            errors.shift();
        }

        Utils.storage.set('fokus_errors', errors);
    },

    // Utility method to check if user is authenticated
    isAuthenticated()
    {
        const user = Utils.storage.get('fokus_user');
        return user && user.confirmed;
    },

    // Utility method to get current user
    getCurrentUser()
    {
        return Utils.storage.get('fokus_user');
    },

    // Utility method to get subscription status
    getSubscription()
    {
        return Utils.storage.get('fokus_subscription') || { plan: 'free' };
    }
};

// App initialization is now handled in index.html to ensure all scripts are loaded
// The App.init() method is called from index.html after window.load event