// Reusable UI Components for Fokus app

const Components = {
    // Button component
    Button({ text, variant = 'primary', size = 'md', onclick, href, className = '', disabled = false })
    {
        const tag = href ? 'a' : 'button';
        const attributes = href ? `href="${href}"` : `type="button"`;
        const disabledAttr = disabled ? 'disabled' : '';

        return `
            <${tag} 
                class="btn btn-${variant} btn-${size} ${className}" 
                ${attributes} 
                ${onclick ? `onclick="${onclick}"` : ''}
                ${disabledAttr}
            >
                ${text}
            </${tag}>
        `;
    },

    // Card component
    Card({ children, className = '', popular = false })
    {
        return `
            <div class="card ${popular ? 'popular' : ''} ${className}">
                ${popular ? '<span class="pricing-popular">Most Popular</span>' : ''}
                ${children}
            </div>
        `;
    },

    // Input component
    Input({ label, type = 'text', name, placeholder = '', value = '', required = false, error = '' })
    {
        return `
            <div class="form-group">
                ${label ? `<label class="form-label" for="${name}">${label}</label>` : ''}
                <input 
                    type="${type}" 
                    id="${name}" 
                    name="${name}" 
                    class="form-input ${error ? 'error' : ''}" 
                    placeholder="${placeholder}"
                    value="${value}"
                    ${required ? 'required' : ''}
                />
                ${error ? `<div class="form-error">${error}</div>` : ''}
            </div>
        `;
    },

    // Alert component
    Alert({ message, type = 'error' })
    {
        return `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
    },

    // Feature card component
    FeatureCard({ title, description, limits })
    {
        return Components.Card({
            children: `
                <h3 class="feature-title">${title}</h3>
                <p class="feature-description">${description}</p>
                <div class="feature-limits">
                    <span class="feature-badge feature-badge-free">Free: ${limits.free}</span>
                    <span class="feature-badge feature-badge-pro">Pro: ${limits.paid}</span>
                </div>
            `
        });
    },

    // Pricing card component
    PricingCard({ name, price, period, features, variant, popular = false, ctaText, ctaAction })
    {
        const featuresHtml = features.map(feature => `
            <li class="pricing-feature">
                <span class="pricing-check">✓</span>
                <span>${feature}</span>
            </li>
        `).join('');

        return Components.Card({
            popular,
            children: `
                <div class="pricing-header">
                    <h3 class="pricing-name">${name}</h3>
                    <div class="pricing-price">
                        <span class="pricing-amount">$${price}</span>
                        <span class="pricing-period">/${period}</span>
                    </div>
                </div>
                <ul class="pricing-features">
                    ${featuresHtml}
                </ul>
                ${Components.Button({
                text: ctaText,
                variant,
                className: 'btn-full',
                href: ctaAction
            })}
            `
        });
    },

    // Loading spinner
    Spinner()
    {
        return '<div class="spinner"></div>';
    },

    // Status icon
    StatusIcon({ type, message })
    {
        const icon = type === 'success' ? '✓' : '×';
        return `
            <div class="status-icon status-icon-${type}">${icon}</div>
            ${message ? `<p>${message}</p>` : ''}
        `;
    },

    // Navigation component
    Navigation()
    {
        return `
            <nav id="navigation" class="navigation">
                <div class="container">
                    <div class="nav-content">
                        <a href="/" class="logo">Fokus</a>
                        <div class="nav-links">
                            <a href="#features" class="nav-link">Features</a>
                            <a href="#pricing" class="nav-link">Pricing</a>
                            ${Components.Button({
            text: 'Install Extension',
            variant: 'primary',
            size: 'sm',
            href: Config.chromeExtensionUrl
        })}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    },

    // Footer component
    Footer()
    {
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-logo">Fokus</div>
                    <p class="footer-copyright">© 2025 Fokus. All rights reserved.</p>
                    <div class="footer-links">
                        <a href="/privacy" class="footer-link">Privacy Policy</a>
                        <a href="/terms" class="footer-link">Terms of Service</a>
                        <a href="mailto:support@fokus.app" class="footer-link">Contact</a>
                    </div>
                </div>
            </footer>
        `;
    },

    // Section component
    Section({ id = '', title, subtitle, children, className = '' })
    {
        return `
            <section ${id ? `id="${id}"` : ''} class="section ${className}">
                <div class="container">
                    ${title ? `
                        <h2 class="section-title">${title}</h2>
                        ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
                    ` : ''}
                    ${children}
                </div>
            </section>
        `;
    },

    // Hero component
    Hero({ title, subtitle, buttons = [] })
    {
        const buttonsHtml = buttons.map(button =>
            Components.Button(button)
        ).join('');

        return `
            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">${title}</h1>
                        <p class="hero-subtitle">${subtitle}</p>
                        <div class="hero-buttons">
                            ${buttonsHtml}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};