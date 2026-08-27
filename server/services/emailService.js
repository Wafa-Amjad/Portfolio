import nodemailer from 'nodemailer';

const recipientEmail = process.env.NOTIFICATION_EMAIL || 'wafaamjad058@gmail.com';

// Create Nodemailer Transporter
const createTransporter = () => {
    // If custom SMTP parameters are set in environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10) || 587,
            secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT, 10) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    // Default fallback transporter using direct send or service if configured
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || process.env.SMTP_USER,
            pass: process.env.GMAIL_PASS || process.env.SMTP_PASS
        }
    });
};

/**
 * Sends an email notification to wafaamjad058@gmail.com when a new contact message is received.
 * @param {Object} param0 
 * @param {string} param0.name
 * @param {string} param0.email
 * @param {string} param0.subject
 * @param {string} param0.message
 */
export const sendContactNotificationEmail = async ({ name, email, subject, message }) => {
    try {
        const smtpConfigured = (process.env.SMTP_USER || process.env.GMAIL_USER) && (process.env.SMTP_PASS || process.env.GMAIL_PASS);

        if (!smtpConfigured) {
            console.log(`[Email Service] SMTP credentials not fully configured in .env. Logging notification target for: ${recipientEmail}`);
            console.log(`[Email Notification Details] From: ${name} (${email}) | Subject: ${subject} | Message: ${message}`);
            return { success: true, mode: 'logged' };
        }

        const transporter = createTransporter();

        const htmlContent = `
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
                    Wafa Amjad Portfolio System • Automatic Email Dispatcher
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"${name} via Portfolio" <${process.env.SMTP_USER || process.env.GMAIL_USER || email}>`,
            to: recipientEmail,
            replyTo: email,
            subject: `[Portfolio Contact] ${subject} - from ${name}`,
            text: `New Portfolio Contact Message\n\nFrom: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Notification successfully dispatched to ${recipientEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[Email Service Error] Failed to send email notification:', error.message);
        // Return handled error object so message saving is not broken
        return { success: false, error: error.message };
    }
};
