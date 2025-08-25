// Utility functions for Fokus app

const Utils = {
    // DOM manipulation helpers
    createElement(tag, className = '', innerHTML = '')
    {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    // Query selector shorthand
    $(selector)
    {
        return document.querySelector(selector);
    },

    $$(selector)
    {
        return document.querySelectorAll(selector);
    },

    // Render HTML string to element
    render(htmlString)
    {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;
    },

    // Add event listener with delegation support
    on(element, event, selectorOrHandler, handler)
    {
        if (typeof selectorOrHandler === 'function')
        {
            element.addEventListener(event, selectorOrHandler);
        } else
        {
            element.addEventListener(event, (e) =>
            {
                const target = e.target.closest(selectorOrHandler);
                if (target) handler.call(target, e);
            });
        }
    },

    // Form validation
    validateEmail(email)
    {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePassword(password)
    {
        return password.length >= 8;
    },

    // Form data extraction
    getFormData(form)
    {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries())
        {
            data[key] = value;
        }
        return data;
    },

    // Show/hide element
    show(element)
    {
        element.classList.remove('hidden');
    },

    hide(element)
    {
        element.classList.add('hidden');
    },

    // Smooth scroll to element
    scrollTo(selector)
    {
        const element = document.querySelector(selector);
        if (element)
        {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Debounce function
    debounce(func, wait)
    {
        let timeout;
        return function executedFunction(...args)
        {
            const later = () =>
            {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format price
    formatPrice(price)
    {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },

    // Parse URL parameters
    getUrlParams()
    {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (let [key, value] of searchParams.entries())
        {
            params[key] = value;
        }
        return params;
    },

    // Parse hash parameters (for Supabase auth callbacks)
    getHashParams()
    {
        const params = {};
        const hash = window.location.hash.substring(1);
        const searchParams = new URLSearchParams(hash);
        for (let [key, value] of searchParams.entries())
        {
            params[key] = value;
        }
        return params;
    },

    // Local storage helpers
    storage: {
        get(key)
        {
            try
            {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e)
            {
                return null;
            }
        },

        set(key, value)
        {
            try
            {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e)
            {
                return false;
            }
        },

        remove(key)
        {
            try
            {
                localStorage.removeItem(key);
                return true;
            } catch (e)
            {
                return false;
            }
        }
    },

    // Animation helpers
    fadeIn(element, duration = 300)
    {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;

        requestAnimationFrame(() =>
        {
            element.style.opacity = '1';
        });
    },

    fadeOut(element, duration = 300)
    {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';

        setTimeout(() =>
        {
            element.style.display = 'none';
        }, duration);
    },

    // Error handling
    handleError(error)
    {
        console.error('Error:', error);
        return error.message || 'An unexpected error occurred';
    }
};