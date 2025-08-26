// Main application entry point for Fokus

const App = {
    init()
    {
        // Check current path
        const path = window.location.pathname;

        // Handle routing based on URL
        if (path === '/reset-password' || window.location.hash.includes('recovery'))
        {
            this.loadPasswordReset();
        } else if (path === '/confirm-email' || window.location.hash.includes('confirmation'))
        {
            this.loadEmailConfirmation();
        } else
        {
            this.loadLandingPage();
        }

        // Initialize Supabase auth listener
        this.setupAuthListener();

        // Set up global error handling
        this.setupErrorHandling();

        // Initialize smooth scrolling
        this.initSmoothScroll();

        // Initialize pricing toggle
        this.initPricingToggle();

        // Initialize mobile menu
        this.initMobileMenu();

        // Handle scroll effects
        this.handleScrollEffects();
    },

    loadLandingPage()
    {
        // Landing page is already in HTML, just initialize interactions
        this.initLandingPageInteractions();
    },

    loadPasswordReset()
    {
        if (typeof PasswordResetPage !== 'undefined')
        {
            PasswordResetPage.render();
        }
    },

    loadEmailConfirmation()
    {
        if (typeof EmailConfirmationPage !== 'undefined')
        {
            EmailConfirmationPage.render();
        }
    },

    initLandingPageInteractions()
    {
        // Add animation on scroll
        this.initScrollAnimations();

        // Initialize FAQ interactions
        this.initFAQ();
    },

    setupAuthListener()
    {
        // Listen for auth state changes
        if (typeof supabase !== 'undefined')
        {
            supabase.auth.onAuthStateChange((event, session) =>
            {
                console.log('Auth event:', event);

                switch (event)
                {
                    case 'PASSWORD_RECOVERY':
                        // User clicked password recovery link
                        this.loadPasswordReset();
                        break;
                    case 'USER_UPDATED':
                        // User's data was updated
                        this.handleUserUpdate(session);
                        break;
                }
            });
        }
    },

    handleUserUpdate(session)
    {
        if (session)
        {
            // Store user data if needed
            Utils.storage.set('fokus_user', {
                id: session.user.id,
                email: session.user.email,
                confirmed: session.user.confirmed_at !== null
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
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all feature cards and other animated elements
        document.querySelectorAll('.feature-card, .step, .pricing-card, .faq-item').forEach(el =>
        {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },

    initFAQ()
    {
        // Make FAQ items clickable for expansion (optional enhancement)
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item =>
        {
            const question = item.querySelector('.faq-question');
            if (question)
            {
                question.style.cursor = 'pointer';
                question.addEventListener('click', () =>
                {
                    item.classList.toggle('expanded');
                });
            }
        });
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
        // In production, send this to your error tracking service
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
    }
};

// Add CSS class when elements come into view
const style = document.createElement('style');
style.textContent = `
    .animated {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);