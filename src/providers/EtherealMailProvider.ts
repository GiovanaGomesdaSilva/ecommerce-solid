import nodemailer from 'nodemailer';
import { IMailProvider } from './IMailProvider';
import { getMailClient } from '../lib/mail';
import logger from '../lib/logger';

export class EtherealMailProvider implements IMailProvider{
    async sendMail(to: string, subject: string, text: string, html: string): Promise<string> {
        const mailer= await getMailClient();

       const info = await mailer.sendMail({
        from: '"DevStore" <noreply@devstore.com>',
        to: to,
        subject: subject,
        text: text,
        html: html,
      });
      const link = nodemailer.getTestMessageUrl(info) || '';
      logger.info (`Email enviado: ${link}`);
      return link
    }
}