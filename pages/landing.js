// Landing page specific functionality for Fokus app

const LandingPage = {
    init()
    {
        // Initialize all landing page features
        this.initHeroAnimations();
        this.initFeatureCards();
        this.initStats();
        this.initTestimonials();
    },

    initHeroAnimations()
    {
        // Animate hero elements on load
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
        heroElements.forEach((el, index) =>
        {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(() =>
            {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate stats counter
        this.animateStats();
    },

    initFeatureCards()
    {
        const cards = document.querySelectorAll('.feature-card');

        cards.forEach(card =>
        {
            // Add hover effect for icon rotation
            const iconBg = card.querySelector('.icon-bg');
            if (iconBg)
            {
                card.addEventListener('mouseenter', () =>
                {
                    iconBg.style.animationDuration = '2s';
                });

                card.addEventListener('mouseleave', () =>
                {
                    iconBg.style.animationDuration = '10s';
                });
            }

            // Add click animation
            card.addEventListener('click', function ()
            {
                this.style.transform = 'scale(0.98)';
                setTimeout(() =>
                {
                    this.style.transform = '';
                }, 200);
            });
        });
    },

    animateStats()
    {
        const stats = [
            { element: null, target: 50, suffix: 'K+', current: 0 },
            { element: null, target: 2, suffix: 'M+', current: 0 },
            { element: null, target: 4.8, suffix: '', current: 0, decimal: true }
        ];

        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((el, index) =>
        {
            if (stats[index])
            {
                stats[index].element = el;
            }
        });

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const interval = setInterval(() =>
        {
            currentStep++;
            const progress = currentStep / steps;

            stats.forEach(stat =>
            {
                if (stat.element)
                {
                    if (stat.decimal)
                    {
                        stat.current = (stat.target * progress).toFixed(1);
                    } else
                    {
                        stat.current = Math.floor(stat.target * progress);
                    }
                    stat.element.textContent = stat.current + stat.suffix;
                }
            });

            if (currentStep >= steps)
            {
                clearInterval(interval);
                // Set final values
                stats.forEach(stat =>
                {
                    if (stat.element)
                    {
                        stat.element.textContent = stat.target + stat.suffix;
                    }
                });
            }
        }, stepDuration);
    },

    initTestimonials()
    {
        // If you add testimonials section later
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length > 0)
        {
            let currentIndex = 0;

            setInterval(() =>
            {
                testimonials[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % testimonials.length;
                testimonials[currentIndex].classList.add('active');
            }, 5000);
        }
    },

    render()
    {
        // The landing page is already rendered in HTML
        // This function is here for compatibility with the router
        // Just ensure navigation is visible
        const nav = document.getElementById('navigation');
        if (nav)
        {
            nav.classList.remove('hidden');
        }

        // Initialize landing page features
        this.init();
    }
};