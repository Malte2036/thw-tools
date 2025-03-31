import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly defaultFromEmail: string;
  private readonly isDevelopment: boolean;

  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') !== 'production';

    if (this.isDevelopment) {
      this.logger.log('Skipping email service in development mode');
      return;
    }

    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    this.resend = new Resend(resendApiKey);
    this.defaultFromEmail =
      this.configService.get<string>('DEFAULT_FROM_EMAIL') ||
      'noreply@service.thw-tools.de';
  }

  async sendEmail(options: SendEmailOptions) {
    const { to, subject, html, text, cc, bcc, replyTo, attachments, tags } =
      options;

    if (this.isDevelopment) {
      this.logger.log(
        `[Development] Email would have been sent:
        To: ${Array.isArray(to) ? to.join(', ') : to}
        Subject: ${subject}
        HTML: ${html ? 'Yes' : 'No'}
        Text: ${text ? 'Yes' : 'No'}
        CC: ${cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : 'None'}
        BCC: ${bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : 'None'}
        ReplyTo: ${replyTo ? (Array.isArray(replyTo) ? replyTo.join(', ') : replyTo) : 'None'}
        Attachments: ${attachments ? attachments.length : 0}
        Tags: ${tags ? tags.length : 0}`,
      );
      return { data: { id: 'dev-' + Date.now() }, error: null };
    }

    try {
      const response = await this.resend.emails.send({
        from: this.defaultFromEmail,
        to,
        subject,
        html,
        text,
        cc,
        bcc,
        reply_to: replyTo,
        attachments,
        tags,
      });

      if (response.error) {
        this.logger.error('Failed to send email:', response.error);
        throw new Error(
          response.error.message ||
            'Unknown error occurred while sending email',
        );
      }

      this.logger.log(
        `Email sent successfully to ${to} with subject "${subject}" (ID: ${response.data.id})`,
      );
      return response;
    } catch (error: any) {
      const errorMessage =
        error.message || 'Unknown error occurred while sending email';
      this.logger.error('Failed to send email:', error);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
}
