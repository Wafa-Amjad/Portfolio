/**
 * Non-SMTP Direct Email Notification Service
 * Dispatches contact messages directly to wafaaamjad058@gmail.com using modern HTTP REST APIs.
 * Completely bypasses legacy SMTP ports (25, 465, 587) and firewalls.
 */

const getRecipientEmail = () => process.env.NOTIFICATION_EMAIL || 'wafaaamjad058@gmail.com';

/**
 * Sends a contact notification email directly to Gmail via Non-SMTP REST APIs.
 * Supports Resend REST API, Web3Forms REST API, and SendGrid REST API.
 * 
 * @param {Object} param0 
 * @param {string} param0.name
 * @param {string} param0.email
 * @param {string} param0.subject
 * @param {string} param0.message
 */
export const sendContactNotificationEmail = async ({ name, email, subject, message }) => {
    const targetEmail = getRecipientEmail();

    // 1. Resend REST API (https://resend.com) - Highly recommended modern HTTP API
    if (process.env.RESEND_API_KEY) {
        try {
            console.log(`[Email Service - Non-SMTP] Dispatching via Resend HTTP REST API to ${targetEmail}...`);
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
                    to: [targetEmail],
                    reply_to: email,
                    subject: `[Portfolio Contact] ${subject} - from ${name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                            <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
                                <h2 style="margin: 0; font-size: 1.4rem;">New Portfolio Contact Message</h2>
                                <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 0.9rem;">Received from Portfolio Contact Form</p>
                            </div>
                            <div style="padding: 32px; color: #334155;">
                                <div style="margin-bottom: 20px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #0f172a; border-radius: 4px;">
                                    <p style="margin: 0 0 8px 0; font-size: 0.9rem;"><strong>Sender Name:</strong> ${name}</p>
                                    <p style="margin: 0 0 8px 0; font-size: 0.9rem;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
                                    <p style="margin: 0; font-size: 0.9rem;"><strong>Subject:</strong> ${subject}</p>
                                </div>
                                <div style="margin-top: 24px;">
                                    <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 1rem;">Message Content:</h4>
                                    <div style="padding: 16px; background-color: #f1f5f9; border-radius: 6px; white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6; color: #1e293b;">${message}</div>
                                </div>
                            </div>
                            <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0;">
                                Wafa Amjad Portfolio System • Non-SMTP REST HTTP Dispatcher
                            </div>
                        </div>
                    `
                })
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`[Email Service - Non-SMTP] Successfully delivered via Resend REST API to ${targetEmail}. Message ID: ${data.id}`);
                return { success: true, provider: 'resend', id: data.id };
            } else {
                console.error('[Email Service Error] Resend REST API response error:', data);
            }
        } catch (err) {
            console.error('[Email Service Error] Resend REST API call failed:', err.message);
        }
    }

    // 2. Web3Forms REST API (https://web3forms.com) - Zero SMTP configuration HTTP endpoint
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
        try {
            console.log(`[Email Service - Non-SMTP] Dispatching via Web3Forms REST API to ${targetEmail}...`);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: web3Key,
                    subject: `[Portfolio Contact] ${subject} - from ${name}`,
                    from_name: name,
                    replyto: email,
                    name: name,
                    email: email,
                    message: `Subject: ${subject}\nFrom Email: ${email}\n\nMessage:\n${message}`
                })
            });

            const data = await response.json();
            if (data.success) {
                console.log(`[Email Service - Non-SMTP] Successfully delivered via Web3Forms REST API to ${targetEmail}`);
                return { success: true, provider: 'web3forms' };
            } else {
                console.error('[Email Service Error] Web3Forms REST API error:', data);
            }
        } catch (err) {
            console.error('[Email Service Error] Web3Forms REST API call failed:', err.message);
        }
    }

    // 3. SendGrid HTTP REST API (https://sendgrid.com)
    if (process.env.SENDGRID_API_KEY) {
        try {
            console.log(`[Email Service - Non-SMTP] Dispatching via SendGrid REST API to ${targetEmail}...`);
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
                },
                body: JSON.stringify({
                    personalizations: [{
                        to: [{ email: targetEmail }],
                        subject: `[Portfolio Contact] ${subject} - from ${name}`
                    }],
                    from: { email: process.env.SENDGRID_FROM_EMAIL || targetEmail, name: name },
                    reply_to: { email: email, name: name },
                    content: [{
                        type: 'text/html',
                        value: `<h3>New Portfolio Contact Message</h3><p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`
                    }]
                })
            });

            if (response.ok || response.status === 202) {
                console.log(`[Email Service - Non-SMTP] Successfully delivered via SendGrid REST API to ${targetEmail}`);
                return { success: true, provider: 'sendgrid' };
            } else {
                const errData = await response.text();
                console.error('[Email Service Error] SendGrid REST API error:', errData);
            }
        } catch (err) {
            console.error('[Email Service Error] SendGrid REST API call failed:', err.message);
        }
    }

    // 4. Default Non-SMTP Notification Logger
    console.log(`[Email Service - Non-SMTP] Notification target set to: ${targetEmail}`);
    console.log(`[Email Service - Non-SMTP] Message received from ${name} (${email}):`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Content: ${message}`);
    console.log(`[Email Service Note] Add RESEND_API_KEY or WEB3FORMS_ACCESS_KEY to .env for instant live inbox forwarding.`);

    return { success: true, mode: 'logged', targetEmail };
};

