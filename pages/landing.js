// Landing page for Fokus app

const LandingPage = {
render() {
const app = Utils.$('#app');

// Show navigation
Utils.show(Utils.$('#navigation'));

// Build page HTML
const html = `
${Components.Hero({
title: 'Productivity in Your Hands',
subtitle: 'Take control of your browsing experience with Fokus. Block distractions, filter search results, and stay
focused on what matters most.',
buttons: [
{
text: "Add to Chrome - It's Free",
variant: 'primary',
size: 'lg',
href: Config.chromeExtensionUrl
},
{
text: 'Learn More',
variant: 'secondary',
size: 'lg',
href: '#features'
}
]
})}

${Components.Section({
id: 'features',
title: 'Powerful Features for Deep Focus',
subtitle: 'Everything you need to eliminate distractions and boost your productivity',
children: `
<div class="grid grid-2">
    ${Config.features.map(feature =>
    Components.FeatureCard(feature)
    ).join('')}
</div>
`
})}

${Components.Section({
id: 'pricing',
title: 'Simple, Transparent Pricing',
subtitle: 'Start free, upgrade when you need more power',
className: 'section-gray',
children: `
<div class="pricing-grid">
    ${Components.PricingCard({
    name: Config.pricing.free.name,
    price: Config.pricing.free.price,
    period: Config.pricing.free.period,
    features: Config.pricing.free.features,
    variant: 'outline',
    ctaText: 'Get Started',
    ctaAction: Config.chromeExtensionUrl
    })}

    ${Components.PricingCard({
    name: Config.pricing.pro.name,
    price: Config.pricing.pro.price,
    period: Config.pricing.pro.period,
    features: Config.pricing.pro.features,
    variant: 'primary',
    popular: true,
    ctaText: 'Upgrade to Pro',
    ctaAction: Config.stripe.checkoutUrl
    })}
</div>
`
})}

${Components.Footer()}
`;

app.innerHTML = html;

// Add background to pricing section
const pricingSection = Utils.$('#pricing');
if (pricingSection) {
pricingSection.style.background = 'var(--gray-50)';
}

// Handle smooth scrolling for anchor links
Utils.$$('a[href^="#"]').forEach(link => {
Utils.on(link, 'click', (e) => {
e.preventDefault();
const target = link.getAttribute('href');
Utils.scrollTo(target);
});
});
}
};