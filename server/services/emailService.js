const nodemailer = require('nodemailer');

// Set up transporter (checks if custom SMTP is defined in env, otherwise falls back to a simulated mode)
const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port == 465,
            auth: {
                user,
                pass
            }
        });
    }
    return null;
};

/**
 * Sends a premium verification & login alert email to the admin.
 */
const sendAdminLoginNotification = async (userEmail, username, role) => {
    const adminEmail = 'thakudipak6998@gmail.com';
    const loginTime = new Date().toLocaleString();
    const dashboardUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin`;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f8fafc;
                    color: #1e293b;
                    margin: 0;
                    padding: 40px 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 24px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    padding: 40px;
                    text-align: center;
                    color: #ffffff;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                }
                .content {
                    padding: 40px;
                }
                .info-box {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 24px;
                    margin: 24px 0;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                .info-item:last-child {
                    margin-bottom: 0;
                }
                .label {
                    font-weight: 700;
                    color: #64748b;
                }
                .value {
                    font-weight: 600;
                    color: #0f172a;
                }
                .button-container {
                    text-align: center;
                    margin-top: 32px;
                }
                .button {
                    display: inline-block;
                    background-color: #4f46e5;
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
                    transition: all 0.2s ease;
                }
                .footer {
                    background: #f8fafc;
                    padding: 24px;
                    text-align: center;
                    font-size: 12px;
                    color: #94a3b8;
                    border-top: 1px solid #f1f5f9;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔑 Security Login Notification</h1>
                </div>
                <div class="content">
                    <p style="font-size: 16px; font-weight: 600; margin-top: 0;">Hello Admin,</p>
                    <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                        A user has successfully logged into the CollabTool platform. Please find the details of the login session below:
                    </p>
                    
                    <div class="info-box">
                        <div class="info-item">
                            <span class="label">Username:</span>
                            <span class="value">${username}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Email Address:</span>
                            <span class="value">${userEmail}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Role:</span>
                            <span class="value" style="text-transform: uppercase;">${role}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Time of Login:</span>
                            <span class="value">${loginTime}</span>
                        </div>
                    </div>
                    
                    <div class="button-container">
                        <a href="${dashboardUrl}" class="button" target="_blank">Access Admin Control Center</a>
                    </div>
                </div>
                <div class="footer">
                    This is an automated security notification from CollabTool Admin Panel.
                </div>
            </div>
        </body>
        </html>
    `;

    const transporter = createTransporter();
    
    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"CollabTool Security" <${process.env.SMTP_USER}>`,
                to: adminEmail,
                subject: `🔒 CollabTool Security Alert: User Login (${username})`,
                html: htmlContent
            });
            console.log(`[Email Service] Success: Real login alert email sent to ${adminEmail}`);
        } catch (error) {
            console.error('[Email Service] Error sending real email:', error.message);
            logSimulatedEmail(adminEmail, username, userEmail, role, loginTime);
        }
    } else {
        logSimulatedEmail(adminEmail, username, userEmail, role, loginTime);
    }
};

const logSimulatedEmail = (adminEmail, username, userEmail, role, loginTime) => {
    console.log('\n=================== 📨 SIMULATED SECURITY EMAIL DISPATCH ===================');
    console.log(`To:         ${adminEmail}`);
    console.log(`Subject:    🔒 CollabTool Security Alert: User Login (${username})`);
    console.log(`Time:       ${loginTime}`);
    console.log(`Details:    User ${username} (${userEmail}) logged in with role "${role}"`);
    console.log('Status:     [Simulation Success] Set SMTP variables in .env to send real emails!');
    console.log('===========================================================================\n');
};

module.exports = {
    sendAdminLoginNotification
};
