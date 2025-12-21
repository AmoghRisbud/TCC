import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getEmailTransporter, verifyEmailConnection } from '../../../../lib/email';

// Email service configuration - Production Nodemailer with Gmail SMTP
// Requires EMAIL_USER and EMAIL_PASSWORD environment variables

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const cvFile = formData.get('cv') as File;

    // Validate required fields
    if (!name || !email || !message || !cvFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate file
    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(cvFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or Word document' },
        { status: 400 }
      );
    }

    // Convert file to base64 for email attachment
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');

    // Prepare email content
    const emailContent = {
      to: 'info.thecollectivecounsel@gmail.com',
      subject: `New CV Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #1a472a; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #ddd; }
              .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1a472a; margin-top: 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">New CV Submission</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">The Collective Counsel Careers</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Candidate Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #1a472a;">${email}</a></div>
                </div>
                
                ${phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${phone}</div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">Message to Hiring Manager:</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="field">
                  <div class="label">CV Attachment:</div>
                  <div class="value">${cvFile.name} (${(cvFile.size / 1024).toFixed(1)} KB)</div>
                </div>
                
                <div class="footer">
                  <p>This CV was submitted through the TCC website careers page.</p>
                  <p>Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: cvFile.name,
          content: base64File,
          encoding: 'base64',
          contentType: cvFile.type,
        },
      ],
    };

    // Verify email service is available before attempting to send
    const emailServiceReady = await verifyEmailConnection();
    if (!emailServiceReady) {
      console.error('Email service unavailable - CV submission cannot be processed');
      return NextResponse.json(
        { error: 'Email service temporarily unavailable. Please try again later.' },
        { status: 503 } // Service Unavailable
      );
    }

    // Send email with CV attachment using Nodemailer
    try {
      const transporter = getEmailTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.html,
        attachments: emailContent.attachments,
      });

      // Log successful submission
      console.log('✅ CV submission email sent successfully:', {
        name,
        email,
        phone,
        fileName: cvFile.name,
        fileSize: cvFile.size,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'CV submitted successfully',
        data: { name, email },
      });

    } catch (emailError) {
      console.error('❌ Failed to send CV submission email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later or contact us directly.' },
        { status: 503 } // Service Unavailable
      );
    }

  } catch (error) {
    console.error('Error processing CV submission:', error);
    return NextResponse.json(
      { error: 'Failed to process CV submission' },
      { status: 500 }
    );
  }
}
