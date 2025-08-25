
const Config = {
    // Supabase Configuration
    supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_SUPABASE_ANON_KEY'
    },
    // Stripe Configuration
    stripe: {
        checkoutUrl: 'https: //checkout.stripe.com/YOUR_CHECKOUT_SESSION'
    },
    // Chrome Extension URL
    chromeExtensionUrl: 'https: //chrome.google.com/webstore',
    // Pricing Plans
    pricing: {
        free: {
            name: 'Free',
            price: '0',
            period: 'forever',
            features: [
                '10 blocked keywords',
                '10 blocked domains',
                '1 GitHub blocklist URL',
                'Basic Focus Mode',
                '1 device sync'
            ],
            limits: {
                keywords: 10,
                domains: 10,
                githubUrls: 1,
                devices: 1
            }
        },
        pro: {
            name: 'Pro',
            price: '4.99',
            period: 'month',
            features: [
                'Unlimited blocked keywords',
                'Unlimited blocked domains',
                'Unlimited GitHub blocklist URLs',
                'Advanced Focus Mode',
                '5 device sync',
                'Priority support',
                'Custom blocklist sharing'
            ],
            limits: {
                keywords: 'unlimited',
                domains: 'unlimited',
                githubUrls: 'unlimited',
                devices: 5
            }
        }
    },
    // Features
    features: [
        {
            title: 'Block Keywords',
            description: 'Filter out distracting content by blocking specific keywords in Google search results',
            limits: {
                free: '10 keywords',
                paid: 'Unlimited keywords'
            }
        },
        {
            title: 'Block Domains',
            description: 'Stay focused by blocking access to time-wasting websites and domains',
            limits: {
                free: '10 domains',
                paid: 'Unlimited domains'
            }
        },
        {
            title: 'GitHub Blocklist Integration',
            description: 'Import curated blocklists from GitHub repositories like Steven Black\'s hosts file',
            limits: {
                free: '1 GitHub URL',
                paid: 'Unlimited GitHub URLs'
            }
        },
        {
            title: 'Focus Mode',
            description: 'Temporarily block all distracting websites with one click when you need deep focus',
            limits: {
                free: 'Available',
                paid: 'Advanced settings'
            }
        }
    ]
};

// Initialize Supabase client
const supabase = window.supabase.createClient(Config.supabase.url, Config.supabase.anonKey);