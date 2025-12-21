import nodemailer from 'nodemailer';

/**
 * Email Service Utility for TCC Frontend
 * Uses Nodemailer with Gmail SMTP for production email sending
 * Implements singleton pattern for connection pooling and performance
 */

// Singleton transporter instance for connection reuse
let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create the email transporter instance
 * Uses connection pooling for better performance
 * 
 * @throws {Error} If EMAIL_USER or EMAIL_PASSWORD environment variables are missing
 * @returns {nodemailer.Transporter} Configured nodemailer transporter
 */
export function getEmailTransporter(): nodemailer.Transporter {
  if (!transporter) {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration missing: EMAIL_USER and EMAIL_PASSWORD must be set');
    }

    // Create transporter with Gmail SMTP and connection pooling
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Connection pooling configuration for production
      pool: true,
      maxConnections: 5, // Max concurrent connections
      maxMessages: 100,  // Max messages per connection before reconnecting
      rateDelta: 1000,   // Time between rate limit checks (1 second)
      rateLimit: 5,      // Max messages per rateDelta period
    });
  }

  return transporter;
}

/**
 * Verify that the email service is properly configured and can connect
 * Useful for health checks and startup validation
 * 
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transporter = getEmailTransporter();
    await transporter.verify();
    console.log('✅ Email service connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error);
    return false;
  }
}

/**
 * Send an email using the configured transporter
 * 
 * @param options - Nodemailer mail options
 * @returns {Promise<void>}
 * @throws {Error} If email sending fails
 */
export async function sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
  const transporter = getEmailTransporter();
  await transporter.sendMail(options);
}

/**
 * Close the transporter connection pool
 * Should be called during graceful shutdown
 */
export function closeEmailConnection(): void {
  if (transporter) {
    transporter.close();
    transporter = null;
    console.log('📧 Email service connection closed');
  }
}
