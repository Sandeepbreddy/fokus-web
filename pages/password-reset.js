// Password Reset page for Fokus app

const PasswordResetPage = {
    state: {
        loading: false,
        error: '',
        success: ''
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
            children: `
                                <div class="auth-header">
                                    <a href="/" class="auth-logo">Fokus</a>
                                    <h2 class="auth-title">Reset Your Password</h2>
                                    <p class="auth-subtitle">Enter your new password below</p>
                                </div>
                                
                                <form id="password-reset-form">
                                    ${Components.Input({
                label: 'New Password',
                type: 'password',
                name: 'password',
                placeholder: 'Enter new password',
                required: true
            })}
                                    
                                    ${Components.Input({
                label: 'Confirm Password',
                type: 'password',
                name: 'confirmPassword',
                placeholder: 'Confirm new password',
                required: true
            })}
                                    
                                    <div id="form-messages"></div>
                                    
                                    ${Components.Button({
                text: 'Update Password',
                variant: 'primary',
                className: 'btn-full',
                disabled: false
            })}
                                </form>
                                
                                <div class="auth-footer">
                                    <a href="/" class="auth-footer-link">Back to Home</a>
                                </div>
                            `
        })}
                    </div>
                </div>
            </div>
        `;

        app.innerHTML = html;

        // Attach event listeners
        this.attachEventListeners();
    },

    attachEventListeners()
    {
        const form = Utils.$('#password-reset-form');

        if (form)
        {
            Utils.on(form, 'submit', async (e) =>
            {
                e.preventDefault();
                await this.handlePasswordReset(e);
            });
        }
    },

    async handlePasswordReset(e)
    {
        const formData = Utils.getFormData(e.target);
        const messagesDiv = Utils.$('#form-messages');
        const submitButton = e.target.querySelector('button[type="button"]') || e.target.querySelector('button');

        // Clear previous messages
        messagesDiv.innerHTML = '';

        // Validate passwords match
        if (formData.password !== formData.confirmPassword)
        {
            messagesDiv.innerHTML = Components.Alert({
                message: 'Passwords do not match',
                type: 'error'
            });
            return;
        }

        // Validate password length
        if (formData.password.length < 8)
        {
            messagesDiv.innerHTML = Components.Alert({
                message: 'Password must be at least 8 characters',
                type: 'error'
            });
            return;
        }

        // Update button state
        submitButton.disabled = true;
        submitButton.textContent = 'Updating...';

        try
        {
            // Update password using Supabase
            const { error } = await supabase.auth.updateUser({
                password: formData.password
            });

            if (error) throw error;

            // Show success message
            messagesDiv.innerHTML = Components.Alert({
                message: 'Password updated successfully! Redirecting...',
                type: 'success'
            });

            // Redirect after 3 seconds
            setTimeout(() =>
            {
                router.navigate('/');
            }, 3000);

        } catch (error)
        {
            messagesDiv.innerHTML = Components.Alert({
                message: error.message || 'Failed to reset password',
                type: 'error'
            });

            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Update Password';
        }
    },

    // Validate form inputs in real-time
    validateForm()
    {
        const password = Utils.$('input[name="password"]');
        const confirmPassword = Utils.$('input[name="confirmPassword"]');
        const submitButton = Utils.$('button[type="submit"]');

        const checkValidity = () =>
        {
            const isValid =
                password.value.length >= 8 &&
                password.value === confirmPassword.value;

            submitButton.disabled = !isValid;
        };

        Utils.on(password, 'input', checkValidity);
        Utils.on(confirmPassword, 'input', checkValidity);
    }
};