// Main application entry point for Fokus

const App = {
    init()
    {
        console.log('App initializing...');

        // Initialize Supabase if config exists
        if (typeof Config !== 'undefined' && window.supabase)
        {
            window.supabaseClient = window.supabase.createClient(
                Config.supabase.url,
                Config.supabase.anonKey
            );
        }

        // Set up routes first
        this.setupRoutes();

        // Initialize router
        if (typeof router !== 'undefined')
        {
            router.init();
        }

        // Set up auth listener
        this.setupAuthListener();

        // Set up global error handling
        this.setupErrorHandling();
    },

    setupRoutes()
    {
        console.log('Setting up routes...');

        // Check URL for routing
        const path = window.location.pathname;
        const hash = window.location.hash;

        console.log('Current path:', path);
        console.log('Current hash:', hash);

        // Handle hash-based routing for Supabase callbacks
        if (hash)
        {
            const hashParams = new URLSearchParams(hash.substring(1));
            const type = hashParams.get('type');
            const error = hashParams.get('error');

            if (type === 'recovery' || path === '/reset-password')
            {
                console.log('Loading password reset page...');
                this.loadPasswordResetPage();
                return;
            } else if (type === 'signup' || type === 'email' || path === '/confirm-email')
            {
                console.log('Loading email confirmation page...');
                this.loadEmailConfirmationPage();
                return;
            }
        }

        // Handle direct path navigation
        if (path === '/reset-password')
        {
            console.log('Direct navigation to password reset');
            this.loadPasswordResetPage();
        } else if (path === '/confirm-email')
        {
            console.log('Direct navigation to email confirmation');
            this.loadEmailConfirmationPage();
        } else
        {
            console.log('Loading landing page features...');
            this.initLandingPage();
        }
    },

    loadPasswordResetPage()
    {
        const app = document.getElementById('app');
        if (!app) return;

        // Hide navigation
        const nav = document.getElementById('navigation');
        if (nav) nav.style.display = 'none';

        // Clear current content and load password reset page
        app.innerHTML = `
            <div class="auth-page">
                <div class="container">
                    <div class="auth-container">
                        <div class="card">
                            <div class="auth-header">
                                <a href="/" class="auth-logo">FOKUS</a>
                                <h2 class="auth-title">Reset Your Password</h2>
                                <p class="auth-subtitle">Enter your new password below</p>
                            </div>
                            
                            <form id="password-reset-form">
                                <div class="form-group">
                                    <label class="form-label" for="password">New Password</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        class="form-input" 
                                        placeholder="Enter new password" 
                                        required
                                        minlength="8"
                                    />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="confirmPassword">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        class="form-input" 
                                        placeholder="Confirm new password" 
                                        required
                                        minlength="8"
                                    />
                                </div>
                                
                                <div id="form-messages"></div>
                                
                                <button type="submit" class="btn btn-primary btn-full">
                                    Update Password
                                </button>
                            </form>
                            
                            <div class="auth-footer">
                                <a href="/" class="auth-footer-link">Back to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach form handler
        const form = document.getElementById('password-reset-form');
        if (form)
        {
            form.addEventListener('submit', async (e) =>
            {
                e.preventDefault();
                await this.handlePasswordReset(e);
            });
        }
    },

    loadEmailConfirmationPage()
    {
        const app = document.getElementById('app');
        if (!app) return;

        // Hide navigation
        const nav = document.getElementById('navigation');
        if (nav) nav.style.display = 'none';

        // Clear current content and load confirmation page
        app.innerHTML = `
            <div class="auth-page">
                <div class="container">
                    <div class="auth-container">
                        <div class="card text-center">
                            <a href="/" class="auth-logo">FOKUS</a>
                            <div id="confirmation-content" class="mt-6">
                                <div class="spinner"></div>
                                <h2 class="auth-title">Verifying Email</h2>
                                <p class="auth-subtitle">Please wait while we confirm your email address...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Start verification
        this.verifyEmail();
    },

    async handlePasswordReset(e)
    {
        const form = e.target;
        const messagesDiv = document.getElementById('form-messages');
        const submitButton = form.querySelector('button[type="submit"]');

        // Get form data
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        // Clear previous messages
        messagesDiv.innerHTML = '';

        // Validate passwords match
        if (password !== confirmPassword)
        {
            messagesDiv.innerHTML = `
                <div class="alert alert-error">Passwords do not match</div>
            `;
            return;
        }

        // Validate password length
        if (password.length < 8)
        {
            messagesDiv.innerHTML = `
                <div class="alert alert-error">Password must be at least 8 characters</div>
            `;
            return;
        }

        // Update button state
        submitButton.disabled = true;
        submitButton.textContent = 'Updating...';

        try
        {
            // Update password using Supabase
            if (window.supabaseClient)
            {
                const { error } = await window.supabaseClient.auth.updateUser({
                    password: password
                });

                if (error) throw error;
            }

            // Show success message
            messagesDiv.innerHTML = `
                <div class="alert alert-success">Password updated successfully! Redirecting...</div>
            `;

            // Redirect after 3 seconds
            setTimeout(() =>
            {
                window.location.href = '/';
            }, 3000);

        } catch (error)
        {
            messagesDiv.innerHTML = `
                <div class="alert alert-error">${error.message || 'Failed to reset password'}</div>
            `;

            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Update Password';
        }
    },

    async verifyEmail()
    {
        const contentDiv = document.getElementById('confirmation-content');
        if (!contentDiv) return;

        try
        {
            // Get hash parameters from URL
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const type = hashParams.get('type');

            // Check if this is an email confirmation
            if (type === 'signup' || type === 'email')
            {
                if (accessToken && window.supabaseClient)
                {
                    // Verify the token with Supabase
                    const { data, error } = await window.supabaseClient.auth.getUser(accessToken);

                    if (error) throw error;

                    // Update status to success
                    contentDiv.innerHTML = `
                        <div class="status-icon status-icon-success">✓</div>
                        <h2 class="auth-title">Email Confirmed!</h2>
                        <p class="auth-subtitle mb-4">Your email has been successfully verified.</p>
                        <p class="text-sm text-gray-500">Redirecting to home page in 5 seconds...</p>
                        <a href="/" class="btn btn-primary mt-6">Go to Home Now</a>
                    `;

                    // Redirect after 5 seconds
                    setTimeout(() =>
                    {
                        window.location.href = '/';
                    }, 5000);

                } else
                {
                    throw new Error('No access token found in URL');
                }
            } else if (type === 'recovery')
            {
                // This is a password reset link, redirect to password reset page
                window.location.href = '/reset-password';
            } else
            {
                throw new Error('Invalid confirmation type');
            }

        } catch (error)
        {
            console.error('Email verification error:', error);

            contentDiv.innerHTML = `
                <div class="status-icon status-icon-error">×</div>
                <h2 class="auth-title">Verification Failed</h2>
                <p class="auth-subtitle mb-4">
                    ${error.message || 'We couldn\'t verify your email address. The link may have expired or is invalid.'}
                </p>
                <a href="/" class="btn btn-primary">Return to Home</a>
            `;
        }
    },

    initLandingPage()
    {
        // Show navigation
        const nav = document.getElementById('navigation');
        if (nav) nav.style.display = '';

        // Initialize smooth scrolling
        this.initSmoothScroll();

        // Initialize pricing toggle
        this.initPricingToggle();

        // Initialize mobile menu
        this.initMobileMenu();

        // Handle scroll effects
        this.handleScrollEffects();

        // Initialize animations
        this.initScrollAnimations();

        // Initialize landing page features if available
        if (typeof LandingPage !== 'undefined')
        {
            LandingPage.init();
        }
    },

    setupAuthListener()
    {
        // Listen for auth state changes
        if (window.supabaseClient)
        {
            window.supabaseClient.auth.onAuthStateChange((event, session) =>
            {
                console.log('Auth event:', event);

                switch (event)
                {
                    case 'PASSWORD_RECOVERY':
                        // User clicked password recovery link
                        this.loadPasswordResetPage();
                        break;
                    case 'USER_UPDATED':
                        // User's data was updated
                        if (session)
                        {
                            console.log('User updated:', session.user.email);
                        }
                        break;
                }
            });
        }
    },

    initSmoothScroll()
    {
        document.querySelectorAll('a[href^="#"]').forEach(anchor =>
        {
            anchor.addEventListener('click', function (e)
            {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target)
                {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    initPricingToggle()
    {
        const toggle = document.getElementById('pricing-toggle');
        if (toggle)
        {
            toggle.addEventListener('click', function ()
            {
                this.classList.toggle('active');

                // Update prices
                const isYearly = this.classList.contains('active');
                const priceElements = document.querySelectorAll('[data-monthly]');

                priceElements.forEach(el =>
                {
                    const monthly = el.getAttribute('data-monthly');
                    const yearly = el.getAttribute('data-yearly');
                    el.textContent = isYearly ? yearly : monthly;
                });

                // Update period text
                const periodElements = document.querySelectorAll('.period');
                periodElements.forEach(el =>
                {
                    el.textContent = isYearly ? '/year' : '/month';
                });
            });
        }
    },

    initMobileMenu()
    {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (toggle && navLinks)
        {
            toggle.addEventListener('click', () =>
            {
                navLinks.classList.toggle('mobile-active');
                toggle.classList.toggle('active');
            });
        }
    },

    handleScrollEffects()
    {
        const nav = document.querySelector('.navigation');
        if (!nav) return;

        window.addEventListener('scroll', () =>
        {
            if (window.scrollY > 100)
            {
                nav.classList.add('scrolled');
            } else
            {
                nav.classList.remove('scrolled');
            }
        });
    },

    initScrollAnimations()
    {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) =>
        {
            entries.forEach(entry =>
            {
                if (entry.isIntersecting)
                {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.feature-card, .step, .pricing-card, .faq-item').forEach(el =>
        {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },

    setupErrorHandling()
    {
        window.addEventListener('error', (event) =>
        {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) =>
        {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }
};