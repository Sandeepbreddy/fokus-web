// Email Confirmation page for Fokus app

const EmailConfirmationPage = {
    state: {
        status: 'verifying', // 'verifying', 'success', 'error'
        message: ''
    },

    render()
    {
        const app = Utils.$('#app');

        // Hide navigation for auth pages
        Utils.hide(Utils.$('#navigation'));

        const html = `
            <div class="auth-page">
                <div class="container">
                    <div class="auth-container">
                        ${Components.Card({
            className: 'text-center',
            children: `
                                <a href="/" class="auth-logo">Fokus</a>
                                <div id="confirmation-content" class="mt-6">
                                    ${this.getStatusContent()}
                                </div>
                            `
        })}
                    </div>
                </div>
            </div>
        `;

        app.innerHTML = html;

        // Start verification process
        this.verifyEmail();
    },

    getStatusContent()
    {
        switch (this.state.status)
        {
            case 'verifying':
                return `
                    ${Components.Spinner()}
                    <h2 class="auth-title">Verifying Email</h2>
                    <p class="auth-subtitle">Please wait while we confirm your email address...</p>
                `;

            case 'success':
                return `
                    ${Components.StatusIcon({
                    type: 'success'
                })}
                    <h2 class="auth-title">Email Confirmed!</h2>
                    <p class="auth-subtitle mb-4">Your email has been successfully verified.</p>
                    <p class="text-sm text-gray-500">Redirecting to home page in 5 seconds...</p>
                    ${Components.Button({
                    text: 'Go to Home Now',
                    variant: 'primary',
                    className: 'mt-6',
                    onclick: "router.navigate('/')"
                })}
                `;

            case 'error':
                return `
                    ${Components.StatusIcon({
                    type: 'error'
                })}
                    <h2 class="auth-title">Verification Failed</h2>
                    <p class="auth-subtitle mb-4">
                        ${this.state.message || 'We couldn\'t verify your email address. The link may have expired or is invalid.'}
                    </p>
                    ${Components.Button({
                    text: 'Return to Home',
                    variant: 'primary',
                    onclick: "router.navigate('/')"
                })}
                `;

            default:
                return '';
        }
    },

    async verifyEmail()
    {
        try
        {
            // Get hash parameters from URL
            const hashParams = Utils.getHashParams();
            const accessToken = hashParams.access_token;
            const type = hashParams.type;

            // Check if this is an email confirmation
            if (type === 'signup' || type === 'email')
            {
                if (accessToken)
                {
                    // Verify the token with Supabase
                    const { data, error } = await supabase.auth.getUser(accessToken);

                    if (error) throw error;

                    // Update status to success
                    this.updateStatus('success');

                    // Redirect after 5 seconds
                    setTimeout(() =>
                    {
                        router.navigate('/');
                    }, 5000);

                } else
                {
                    throw new Error('No access token found in URL');
                }
            } else if (type === 'recovery')
            {
                // This is a password reset link, redirect to password reset page
                router.navigate('/reset-password');
            } else
            {
                throw new Error('Invalid confirmation type');
            }

        } catch (error)
        {
            console.error('Email verification error:', error);
            this.updateStatus('error', error.message);
        }
    },

    updateStatus(status, message = '')
    {
        this.state.status = status;
        this.state.message = message;

        const contentDiv = Utils.$('#confirmation-content');
        if (contentDiv)
        {
            contentDiv.innerHTML = this.getStatusContent();

            // Re-attach button event listeners after updating content
            if (status === 'success' || status === 'error')
            {
                this.attachButtonListeners();
            }
        }
    },

    attachButtonListeners()
    {
        // Since we're using onclick attributes in the button components,
        // we need to ensure the router is accessible globally
        window.router = router;
    },

    // Alternative verification method using Supabase's built-in handling
    async verifyWithSupabase()
    {
        try
        {
            // Get the current session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (session)
            {
                // User is authenticated, email is confirmed
                this.updateStatus('success');

                // Store session info if needed
                Utils.storage.set('fokus_session', {
                    user: session.user,
                    expires_at: session.expires_at
                });

                // Redirect after delay
                setTimeout(() =>
                {
                    router.navigate('/');
                }, 5000);
            } else
            {
                throw new Error('No valid session found');
            }

        } catch (error)
        {
            this.updateStatus('error', error.message);
        }
    },

    // Handle different types of confirmation links
    handleConfirmationType()
    {
        const hashParams = Utils.getHashParams();
        const type = hashParams.type;
        const errorDescription = hashParams.error_description;

        if (errorDescription)
        {
            this.updateStatus('error', decodeURIComponent(errorDescription));
            return;
        }

        switch (type)
        {
            case 'signup':
            case 'email':
            case 'email_change':
                this.verifyEmail();
                break;
            case 'recovery':
                // Password recovery - redirect to reset password
                router.navigate('/reset-password');
                break;
            default:
                // Try alternative verification
                this.verifyWithSupabase();
        }
    }
};